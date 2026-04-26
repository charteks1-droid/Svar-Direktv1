# Wgranie backendu na Hostinger - 5 kroków

## 1. Wgraj plik
- Pobierz: **svar-ai-backend.zip**
- Hostinger Panel → Twoja aplikacja Node.js → wgraj zip → Restart

## 2. Ustaw zmienne środowiskowe (Environment Variables)
W panelu Hostinger dodaj 2 zmienne:

```
JWT_SECRET = (wpisz losowy długi tekst, np. 64 znaki)
STRIPE_SECRET_KEY = (skopiuj z Twojego Stripe Dashboard)
```

## 3. Skonfiguruj webhook w Stripe
Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **URL:** `https://twoja-domena.pl/api/subscription/webhook`
- **Events do nasłuchu:**
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

Po zapisaniu Stripe pokaże **Signing secret** (zaczyna się od `whsec_...`).

## 4. Dodaj webhook secret do Hostinger
```
STRIPE_WEBHOOK_SECRET = whsec_...
```
**Restart aplikacji** po dodaniu.

## 5. Test
Otwórz w przeglądarce: `https://twoja-domena.pl/health`
Powinno zwrócić: `{"status":"ok",...}`

---

## ⚠️ WAŻNE: Backup danych użytkowników
Plik `users.json` jest **nadpisywany** przy każdym redeploy.
**Przed wgraniem nowej wersji:** pobierz aktualny `users.json` z serwera (FTP/SSH), a po wgraniu wgraj go z powrotem.

Twoje konto (`charteks1@gmail.com`) jest właścicielem na stałe — nawet bez bazy działa za darmo.
