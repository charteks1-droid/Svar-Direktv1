const express = require("express");
const Stripe = require("stripe");
const { authMiddleware, loadUsers, saveUsers, publicUser, isOwner, normalizeEmail, withUsersLock } = require("./auth");

const router = express.Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const PRICE_AMOUNT = 7900;
const PRICE_CURRENCY = "sek";
const PRODUCT_NAME = "Svar Direkt Premium";
const TRIAL_DAYS = 7;

let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY);
} else {
  console.warn("STRIPE_SECRET_KEY not set - subscription routes will return errors");
}

let cachedPriceId = null;

async function getOrCreatePrice() {
  if (cachedPriceId) return cachedPriceId;
  if (!stripe) throw new Error("Stripe not configured");

  const products = await stripe.products.search({
    query: "metadata['app']:'svar-direkt' AND active:'true'",
    limit: 1,
  });

  let product;
  if (products.data.length > 0) {
    product = products.data[0];
  } else {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description: "Premium features: AI Generator, History, Försvar, Påminnelser",
      metadata: { app: "svar-direkt" },
    });
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 10,
  });

  let price = prices.data.find(
    (p) =>
      p.unit_amount === PRICE_AMOUNT &&
      p.currency === PRICE_CURRENCY &&
      p.recurring &&
      p.recurring.interval === "month"
  );

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: PRICE_AMOUNT,
      currency: PRICE_CURRENCY,
      recurring: { interval: "month" },
      metadata: { app: "svar-direkt" },
    });
  }

  cachedPriceId = price.id;
  return cachedPriceId;
}

async function getOrCreateCustomer(user) {
  if (!stripe) throw new Error("Stripe not configured");
  if (user.stripeCustomerId) {
    try {
      const c = await stripe.customers.retrieve(user.stripeCustomerId);
      if (c && !c.deleted) return user.stripeCustomerId;
    } catch (e) {}
  }
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { userId: user.id, app: "svar-direkt" },
  });
  return customer.id;
}

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: "Stripe nie skonfigurowany" });
    if (isOwner(req.user.email)) {
      return res.status(400).json({ error: "Konto właściciela ma dożywotni dostęp" });
    }

    const successUrl = req.body.successUrl || "svar-direkt://subscription/success";
    const cancelUrl = req.body.cancelUrl || "svar-direkt://subscription/cancel";

    const priceId = await getOrCreatePrice();
    const customerId = await getOrCreateCustomer(req.user);

    if (req.user.stripeCustomerId !== customerId) {
      req.user.stripeCustomerId = customerId;
      req.users[req.user.email] = req.user;
      saveUsers(req.users);
    }

    try {
      const existing = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 5,
      });
      const activeSub = existing.data.find((s) =>
        ["trialing", "active", "past_due"].includes(s.status)
      );
      if (activeSub) {
        const portal = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: req.body.returnUrl || "svar-direkt://profile",
        });
        return res.json({ url: portal.url, alreadySubscribed: true });
      }
    } catch (e) {
      console.warn("Active sub check failed:", e.message);
    }

    const sub = req.user.subscription;
    const alreadyUsedTrial = sub && sub.trialEndsAt;

    const sessionParams = {
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: req.user.id, app: "svar-direkt" },
      },
      metadata: { userId: req.user.id, app: "svar-direkt" },
    };

    if (!alreadyUsedTrial) {
      sessionParams.subscription_data.trial_period_days = TRIAL_DAYS;
      sessionParams.payment_method_collection = "always";
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error("checkout error:", e);
    res.status(500).json({ error: e.message || "Błąd Stripe" });
  }
});

router.post("/portal", authMiddleware, async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: "Stripe nie skonfigurowany" });
    if (!req.user.stripeCustomerId) {
      return res.status(400).json({ error: "Brak subskrypcji" });
    }
    const returnUrl = req.body.returnUrl || "svardirekt://profile";
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: returnUrl,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error("portal error:", e);
    res.status(500).json({ error: e.message || "Błąd Stripe" });
  }
});

router.post("/cancel", authMiddleware, async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: "Stripe nie skonfigurowany" });
    const sub = req.user.subscription;
    if (!sub || !sub.stripeSubscriptionId) {
      return res.status(400).json({ error: "Brak aktywnej subskrypcji" });
    }
    const updated = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    req.user.subscription = {
      ...sub,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: updated.current_period_end ? updated.current_period_end * 1000 : sub.currentPeriodEnd,
    };
    req.users[req.user.email] = req.user;
    saveUsers(req.users);
    res.json({ user: publicUser(req.user) });
  } catch (e) {
    console.error("cancel error:", e);
    res.status(500).json({ error: e.message || "Błąd Stripe" });
  }
});

router.post("/refresh", authMiddleware, async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: "Stripe nie skonfigurowany" });
    if (!req.user.stripeCustomerId) {
      return res.json({ user: publicUser(req.user) });
    }
    const subs = await stripe.subscriptions.list({
      customer: req.user.stripeCustomerId,
      status: "all",
      limit: 5,
    });
    const active = subs.data.find((s) =>
      ["trialing", "active", "past_due"].includes(s.status)
    );
    if (active) {
      req.user.subscription = subscriptionFromStripe(active);
    } else if (subs.data.length > 0) {
      req.user.subscription = subscriptionFromStripe(subs.data[0]);
    }
    req.users[req.user.email] = req.user;
    saveUsers(req.users);
    res.json({ user: publicUser(req.user) });
  } catch (e) {
    console.error("refresh error:", e);
    res.status(500).json({ error: e.message || "Błąd Stripe" });
  }
});

function subscriptionFromStripe(sub) {
  return {
    stripeSubscriptionId: sub.id,
    status: sub.status,
    trialEndsAt: sub.trial_end ? sub.trial_end * 1000 : null,
    currentPeriodEnd: sub.current_period_end ? sub.current_period_end * 1000 : null,
    cancelAtPeriodEnd: !!sub.cancel_at_period_end,
    priceId: sub.items && sub.items.data[0] ? sub.items.data[0].price.id : null,
  };
}

async function handleStripeEvent(event) {
  await withUsersLock(async (users) => {
    let changed = false;

    function findUserByCustomer(customerId) {
      return Object.values(users).find((u) => u.stripeCustomerId === customerId);
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.trial_will_end": {
        const sub = event.data.object;
        const user = findUserByCustomer(sub.customer);
        if (user) {
          user.subscription = subscriptionFromStripe(sub);
          users[user.email] = user;
          changed = true;
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const user = findUserByCustomer(sub.customer);
        if (user) {
          user.subscription = { ...subscriptionFromStripe(sub), status: "canceled" };
          users[user.email] = user;
          changed = true;
        }
        break;
      }
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          try {
            const sub = await stripe.subscriptions.retrieve(session.subscription);
            const user = findUserByCustomer(sub.customer);
            if (user) {
              user.subscription = subscriptionFromStripe(sub);
              users[user.email] = user;
              changed = true;
            }
          } catch (e) {
            console.error("checkout.session.completed retrieve failed:", e.message);
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const user = findUserByCustomer(invoice.customer);
        if (user && user.subscription) {
          user.subscription.status = "past_due";
          users[user.email] = user;
          changed = true;
        }
        break;
      }
      default:
        break;
    }

    if (changed) saveUsers(users);
  });
}

function webhookHandler(req, res) {
  if (!stripe) return res.status(500).send("Stripe not configured");
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not set - webhook rejected for security");
    return res.status(503).send("Webhook secret not configured on server");
  }
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  handleStripeEvent(event)
    .then(() => res.json({ received: true }))
    .catch((e) => {
      console.error("handleStripeEvent error:", e);
      res.status(500).json({ error: e.message });
    });
}

module.exports = router;
module.exports.webhookHandler = webhookHandler;
