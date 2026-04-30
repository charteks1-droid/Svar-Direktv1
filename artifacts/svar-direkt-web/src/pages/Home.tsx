import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import logoSrc from "../assets/logo.png";

const NEW_CSS = `
.sd-hero{position:relative;background:linear-gradient(135deg,#0f1923 0%,#0a3d54 50%,#075f7c 100%);overflow:hidden;min-height:85vh;display:flex;align-items:center}
.sd-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,rgba(26,158,207,0.15) 0%,transparent 60%),radial-gradient(ellipse at 10% 80%,rgba(10,126,164,0.10) 0%,transparent 50%);pointer-events:none}
.sd-particle{position:absolute;border-radius:50%;animation:sdFloat linear infinite}
@keyframes sdFloat{0%{transform:translateY(0) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-110vh) rotate(360deg);opacity:0}}
.sd-badge{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:40px;background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.18);color:rgba(255,255,255,0.85);font-size:.8rem;font-weight:600;margin-bottom:20px;animation:sdBadgePulse 3s ease-in-out infinite}
@keyframes sdBadgePulse{0%,100%{box-shadow:0 0 0 0 rgba(26,158,207,0.3)}50%{box-shadow:0 0 0 8px rgba(26,158,207,0)}}
.sd-dot{width:8px;height:8px;border-radius:50%;background:#1a9ecf;display:inline-block;animation:sdDotBlink 2s ease-in-out infinite}
@keyframes sdDotBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
.sd-hero-title{font-size:clamp(2rem,4vw,3.2rem);font-weight:900;line-height:1.15;color:#fff;margin-bottom:20px;letter-spacing:-0.02em}
.sd-hero-title span{color:#1a9ecf}
.sd-hero-sub{font-size:1.05rem;color:rgba(255,255,255,0.70);line-height:1.7;margin-bottom:36px;max-width:440px}
.sd-btn-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:#1a9ecf;color:#fff;border-radius:14px;font-size:.95rem;font-weight:700;transition:all .28s;box-shadow:0 4px 20px rgba(26,158,207,0.35);border:none;cursor:pointer;text-decoration:none}
.sd-btn-primary:hover{background:#0090c0;transform:translateY(-2px);box-shadow:0 8px 32px rgba(26,158,207,0.45)}
.sd-btn-amber{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border-radius:14px;font-size:.95rem;font-weight:700;border:none;cursor:not-allowed;opacity:.8;text-decoration:none}
.sd-btn-outline{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;background:rgba(255,255,255,0.10);color:#fff;border-radius:14px;font-size:.95rem;font-weight:600;border:1px solid rgba(255,255,255,0.25);transition:all .28s;text-decoration:none}
.sd-btn-outline:hover{background:rgba(255,255,255,0.18);transform:translateY(-2px)}
.sd-trust{display:flex;flex-wrap:wrap;gap:20px}
.sd-trust-item{display:flex;align-items:center;gap:7px;color:rgba(255,255,255,0.60);font-size:.8rem}
.sd-phone-wrap{position:relative;animation:sdPhoneFloat 4s ease-in-out infinite}
@keyframes sdPhoneFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.sd-phone{width:220px;background:#0f1923;border-radius:36px;border:8px solid #1a2633;box-shadow:0 32px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05);overflow:hidden;aspect-ratio:9/19}
.sd-phone-glow{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);width:120px;height:40px;background:#1a9ecf;border-radius:50%;filter:blur(24px);opacity:0.4;pointer-events:none}
.sd-stats{background:#0a7ea4;padding:18px 24px}
.sd-stats-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center}
.sd-stat{padding:12px 8px}
.sd-stat-num{font-size:1.7rem;font-weight:800;color:#fff;line-height:1}
.sd-stat-label{font-size:.75rem;color:rgba(255,255,255,0.75);margin-top:4px}
.sd-section{padding:80px 24px}
.sd-inner{max-width:1100px;margin:0 auto}
.sd-inner-sm{max-width:780px;margin:0 auto}
.sd-label{display:inline-block;background:rgba(10,126,164,0.10);color:#0a7ea4;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:5px 14px;border-radius:40px;margin-bottom:14px}
.sd-title{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:#0f1923;line-height:1.25;letter-spacing:-0.01em}
.sd-sub{font-size:1rem;color:#5a7080;margin-top:10px;line-height:1.7}
.sd-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:52px;position:relative}
.sd-steps::before{content:'';position:absolute;top:32px;left:calc(16.6% + 20px);right:calc(16.6% + 20px);height:2px;background:linear-gradient(to right,#1a9ecf,#075f7c);opacity:0.3;border-radius:2px}
.sd-step{background:#fff;border-radius:14px;padding:28px 24px;text-align:center;box-shadow:0 4px 24px rgba(10,126,164,0.08);border:1px solid rgba(10,126,164,0.07);transition:all .28s}
.sd-step:hover{transform:translateY(-6px);box-shadow:0 8px 40px rgba(10,126,164,0.14)}
.sd-step-num{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0a7ea4,#075f7c);color:#fff;font-size:1.3rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 4px 16px rgba(10,126,164,0.30)}
.sd-step-icon{font-size:1.5rem;margin-bottom:8px}
.sd-step-title{font-size:1rem;font-weight:700;color:#0f1923;margin-bottom:8px}
.sd-step-desc{font-size:.875rem;color:#5a7080;line-height:1.65}
.sd-features{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
.sd-feat{background:#fff;border:1px solid #e8eef2;border-radius:14px;padding:24px;transition:all .28s;position:relative;overflow:hidden}
.sd-feat::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#0a7ea4,#1a9ecf);transform:scaleX(0);transform-origin:left;transition:transform .28s}
.sd-feat:hover{transform:translateY(-6px);box-shadow:0 8px 40px rgba(10,126,164,0.14);border-color:rgba(10,126,164,0.20)}
.sd-feat:hover::before{transform:scaleX(1)}
.sd-feat-icon{width:48px;height:48px;border-radius:12px;background:rgba(10,126,164,0.10);display:flex;align-items:center;justify-content:center;margin-bottom:16px;transition:all .28s}
.sd-feat:hover .sd-feat-icon{background:#0a7ea4}
.sd-feat:hover .sd-feat-icon svg{color:#fff!important}
.sd-feat-title{font-size:1rem;font-weight:700;color:#0f1923;margin-bottom:7px}
.sd-feat-desc{font-size:.875rem;color:#5a7080;line-height:1.65}
.sd-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.sd-cat{background:#fff;border-radius:14px;padding:22px;border:2px solid transparent;cursor:pointer;transition:all .28s;box-shadow:0 4px 24px rgba(10,126,164,0.08)}
.sd-cat:hover{border-color:#0a7ea4;transform:translateY(-4px);box-shadow:0 8px 40px rgba(10,126,164,0.14)}
.sd-cat-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0}
.sd-cat-name{font-size:1rem;font-weight:700;color:#0f1923}
.sd-cat-count{font-size:.8rem;color:#5a7080}
.sd-cat-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.sd-cat-tag{background:#f5f8fa;border-radius:6px;padding:4px 10px;font-size:.75rem;color:#5a7080;font-weight:500}
.sd-table-wrap{margin-top:40px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(10,126,164,0.08);border:1px solid #e8eef2}
.sd-table{width:100%;border-collapse:collapse;font-size:.9rem}
.sd-table thead tr{background:#0f1923;color:#fff}
.sd-table th{padding:14px 20px;text-align:left;font-weight:600}
.sd-table th.accent{color:#1a9ecf}
.sd-table tbody tr{border-bottom:1px solid #f0f4f7;transition:background .28s}
.sd-table tbody tr:hover{background:#f5fafd}
.sd-table tbody tr:last-child{border:none}
.sd-table td{padding:14px 20px}
.sd-table td.check{color:#0a7ea4;font-weight:600}
.sd-table td.sd{color:#0a7ea4;font-weight:600;background:rgba(10,126,164,0.03)}
.sd-loss-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:48px}
.sd-loss-col{border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(10,126,164,0.08)}
.sd-loss-header{padding:16px 20px;display:flex;align-items:center;gap:10px;font-weight:700;font-size:.9rem}
.sd-loss-bad-h{background:#fee2e2;color:#dc2626}
.sd-loss-good-h{background:#dcfce7;color:#16a34a}
.sd-loss-icon{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sd-loss-body{padding:18px 20px;display:flex;flex-direction:column;gap:12px}
.sd-loss-bad-b{background:#fff5f5}
.sd-loss-good-b{background:#f0fdf4}
.sd-loss-row{display:flex;align-items:flex-start;gap:10px}
.sd-loss-dot{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;font-size:.65rem;font-weight:700}
.sd-loss-bad-d{background:#fee2e2;color:#dc2626}
.sd-loss-good-d{background:#dcfce7;color:#16a34a}
.sd-loss-text{font-size:.875rem;line-height:1.55;color:#374151}
.sd-loss-good-text{font-weight:600;color:#15803d}
.sd-testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px}
.sd-testi{background:#f5f8fa;border-radius:14px;padding:24px;border:1px solid #e8eef2;transition:all .28s;display:flex;flex-direction:column}
.sd-testi:hover{transform:translateY(-4px);box-shadow:0 8px 40px rgba(10,126,164,0.14);border-color:rgba(10,126,164,0.15)}
.sd-stars{display:flex;gap:3px;margin-bottom:12px}
.sd-testi-quote{font-size:.9rem;color:#5a7080;line-height:1.7;font-style:italic;flex:1}
.sd-testi-author{font-size:.8rem;font-weight:600;color:#8ea3b0;margin-top:14px;padding-top:14px;border-top:1px solid #e8eef2}
.sd-pricing{background:linear-gradient(135deg,#0f1923 0%,#0a3d54 100%);position:relative;overflow:hidden}
.sd-pricing::before{content:'';position:absolute;top:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(26,158,207,0.12) 0%,transparent 70%);pointer-events:none}
.sd-pricing-label{background:rgba(255,255,255,0.12)!important;color:rgba(255,255,255,0.9)!important}
.sd-pricing-title{color:#fff!important}
.sd-pricing-sub{color:rgba(255,255,255,0.65)!important}
.sd-price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:52px}
.sd-price-card{background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.10);border-radius:14px;padding:28px 24px;transition:all .28s;position:relative}
.sd-price-card:hover{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.10);transform:translateY(-6px)}
.sd-price-card.featured{background:rgba(26,158,207,0.15);border-color:#1a9ecf;box-shadow:0 0 40px rgba(26,158,207,0.20)}
.sd-price-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#1a9ecf;color:#fff;padding:4px 16px;border-radius:40px;font-size:.75rem;font-weight:700;white-space:nowrap}
.sd-price-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,0.60);margin-bottom:8px}
.sd-price-label.amber{color:#fbbf24}
.sd-price-amount{font-size:2.8rem;font-weight:900;color:#fff;line-height:1;letter-spacing:-0.02em}
.sd-price-unit{font-size:1rem;font-weight:400;color:rgba(255,255,255,0.55);margin-left:2px}
.sd-price-note{font-size:.8rem;color:rgba(255,255,255,0.50);margin:10px 0 20px}
.sd-price-divider{height:1px;background:rgba(255,255,255,0.10);margin:20px 0}
.sd-price-features{display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
.sd-price-feature{display:flex;align-items:flex-start;gap:8px;font-size:.875rem;color:rgba(255,255,255,0.80)}
.sd-price-btn{display:block;width:100%;padding:13px;border-radius:10px;font-size:.9rem;font-weight:700;text-align:center;transition:all .28s;text-decoration:none;border:none;cursor:pointer}
.sd-price-btn-primary{background:#1a9ecf;color:#fff}
.sd-price-btn-primary:hover{background:#0090c0;transform:translateY(-1px)}
.sd-price-btn-amber{background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff}
.sd-price-btn-amber:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(217,119,6,0.35)}
.sd-price-btn-outline{background:rgba(255,255,255,0.10);color:#fff;border:1px solid rgba(255,255,255,0.20)!important}
.sd-price-btn-outline:hover{background:rgba(255,255,255,0.18)}
.sd-guarantee{display:inline-flex;align-items:center;gap:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:14px 20px;margin-top:28px}
.sd-guarantee-title{font-size:.9rem;font-weight:700;color:#15803d}
.sd-guarantee-sub{font-size:.8rem;color:#16a34a;margin-top:2px}
.sd-faq-list{margin-top:48px;display:flex;flex-direction:column}
.sd-faq-item{border-bottom:1px solid #e8eef2}
.sd-faq-item:first-child{border-top:1px solid #e8eef2}
.sd-faq-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:20px 0;text-align:left;gap:16px;background:none;border:none;cursor:pointer}
.sd-faq-q{font-size:.975rem;font-weight:600;color:#0f1923;line-height:1.4;transition:color .28s}
.sd-faq-btn:hover .sd-faq-q{color:#0a7ea4}
.sd-faq-icon{width:28px;height:28px;border-radius:50%;background:#f5f8fa;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .28s}
.sd-faq-icon.open{background:#0a7ea4;transform:rotate(180deg)}
.sd-faq-icon.open svg{color:#fff!important}
.sd-faq-answer{overflow:hidden;transition:max-height 0.4s ease,padding 0.3s ease;max-height:0}
.sd-faq-answer.open{max-height:500px;padding-bottom:18px}
.sd-faq-answer p{font-size:.9rem;color:#5a7080;line-height:1.7}
.sd-contact-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:48px;margin-top:48px;align-items:start}
.sd-contact-info{display:flex;flex-direction:column;gap:20px}
.sd-ci-item{display:flex;align-items:flex-start;gap:14px}
.sd-ci-icon{width:44px;height:44px;border-radius:12px;background:rgba(10,126,164,0.10);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#0a7ea4}
.sd-ci-title{font-size:.9rem;font-weight:700;color:#0f1923;margin-bottom:3px}
.sd-ci-sub{font-size:.85rem;color:#5a7080}
.sd-ci-sub a{color:#0a7ea4}
.sd-form-wrap{background:#fff;border-radius:14px;padding:32px;box-shadow:0 4px 24px rgba(10,126,164,0.08);border:1px solid #e8eef2}
.sd-form-group{margin-bottom:18px}
.sd-form-label{display:block;font-size:.85rem;font-weight:600;color:#0f1923;margin-bottom:7px}
.sd-form-input,.sd-form-select,.sd-form-textarea{width:100%;padding:11px 14px;border:1.5px solid #d8e2e9;border-radius:10px;font-family:inherit;font-size:.9rem;color:#0f1923;background:#fff;transition:border-color .28s,box-shadow .28s;outline:none}
.sd-form-input:focus,.sd-form-select:focus,.sd-form-textarea:focus{border-color:#0a7ea4;box-shadow:0 0 0 3px rgba(10,126,164,0.12)}
.sd-form-textarea{resize:none;min-height:110px}
.sd-form-error{background:#fee2e2;border:1px solid #fecaca;border-radius:10px;padding:11px 14px;font-size:.875rem;color:#dc2626;margin-top:14px}
.sd-form-submit{width:100%;padding:13px;background:#0a7ea4;color:#fff;border-radius:10px;font-size:.95rem;font-weight:700;border:none;cursor:pointer;transition:all .28s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px}
.sd-form-submit:hover:not(:disabled){background:#075f7c;transform:translateY(-1px);box-shadow:0 4px 16px rgba(10,126,164,0.30)}
.sd-form-submit:disabled{opacity:0.65;cursor:not-allowed}
.sd-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:sdSpin 0.7s linear infinite}
@keyframes sdSpin{to{transform:rotate(360deg)}}
.sd-form-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:28px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.sd-form-success-icon{width:52px;height:52px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center}
.sd-newsletter{background:linear-gradient(135deg,#075f7c,#0a7ea4);padding:80px 24px;text-align:center}
.sd-nl-inner{max-width:640px;margin:0 auto}
.sd-nl-form{display:flex;gap:10px;margin-top:28px;flex-wrap:wrap;justify-content:center}
.sd-nl-input{flex:1;min-width:240px;padding:13px 16px;border-radius:10px;border:none;font-family:inherit;font-size:.9rem;outline:none}
.sd-nl-input:focus{box-shadow:0 0 0 3px rgba(255,255,255,0.25)}
.sd-nl-btn{padding:13px 24px;background:#fff;color:#0a7ea4;border-radius:10px;font-size:.9rem;font-weight:700;border:none;cursor:pointer;transition:all .28s;white-space:nowrap}
.sd-nl-btn:hover{background:#f5f8fa;transform:translateY(-1px)}
.sd-nl-disclaimer{font-size:.78rem;color:rgba(255,255,255,0.55);margin-top:14px}
.sd-nl-success{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:14px;padding:16px 24px;color:#fff;font-weight:600;margin-top:20px}
.sd-scroll-top{position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:#0a7ea4;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transform:translateY(16px);transition:all .28s;box-shadow:0 4px 20px rgba(10,126,164,0.35);z-index:90;border:none}
.sd-scroll-top.visible{opacity:1;transform:none}
.sd-scroll-top:hover{background:#075f7c;transform:translateY(-2px)}
.sd-reveal{opacity:0;transform:translateY(32px);transition:opacity 0.6s ease,transform 0.6s ease}
.sd-reveal.visible{opacity:1;transform:none}
.sd-reveal-left{opacity:0;transform:translateX(-32px);transition:opacity 0.6s ease,transform 0.6s ease}
.sd-reveal-left.visible{opacity:1;transform:none}
.sd-reveal-right{opacity:0;transform:translateX(32px);transition:opacity 0.6s ease,transform 0.6s ease}
.sd-reveal-right.visible{opacity:1;transform:none}
.sd-s1{transition-delay:.05s}.sd-s2{transition-delay:.12s}.sd-s3{transition-delay:.19s}.sd-s4{transition-delay:.26s}.sd-s5{transition-delay:.33s}.sd-s6{transition-delay:.40s}
@media(max-width:900px){
  .sd-hero-inner{grid-template-columns:1fr!important;text-align:center}
  .sd-hero-visual{display:none!important}
  .sd-hero-sub{max-width:100%!important;margin-left:auto;margin-right:auto}
  .sd-stats-inner{grid-template-columns:repeat(2,1fr)!important}
  .sd-steps{grid-template-columns:1fr!important}
  .sd-steps::before{display:none}
  .sd-features{grid-template-columns:repeat(2,1fr)!important}
  .sd-cats{grid-template-columns:repeat(2,1fr)!important}
  .sd-loss-grid{grid-template-columns:1fr!important}
  .sd-testi-grid{grid-template-columns:1fr!important}
  .sd-price-grid{grid-template-columns:1fr!important}
  .sd-contact-grid{grid-template-columns:1fr!important}
}
@media(max-width:640px){
  .sd-section{padding:56px 20px}
  .sd-features{grid-template-columns:1fr!important}
  .sd-cats{grid-template-columns:1fr!important}
  .sd-price-grid{grid-template-columns:1fr!important}
  .sd-stats-inner{grid-template-columns:repeat(2,1fr)!important}
}
`;

const PHONE_CATS = [
  { color: "#0a7ea4", label: "Skatteverket" },
  { color: "#00b894", label: "Försäkringskassan" },
  { color: "#6c5ce7", label: "Migrationsverket" },
  { color: "#dc3545", label: "Kronofogden" },
];

const FEATURES = [
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: "52+ färdiga mallar", desc: "Professionella mallar skrivna på korrekt, formell svenska. Sorterade per myndighet och ärendetyp." },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, title: "AI-generator ✨", desc: "Generera anpassade brev med AI. Beskriv din situation och få ett professionellt svar redo att skicka." },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, title: "Anonymt forum", desc: "Ställ frågor och hjälp varandra anonymt. Dela erfarenheter om Kronofogden, Skatteverket och mer." },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: "Påminnelser", desc: "Missa aldrig en deadline. Ange svarstid och få påminnelse när det är dags att svara myndigheten." },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>, title: "Kopiera med ett tryck", desc: "En knapptryckning kopierar hela mallen till urklipp. Klistra in direkt i mejl, SMS eller portal." },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title: "Fungerar offline", desc: "Alla mallar tillgängliga utan internet. Perfekt när du är på myndighetsbesök eller saknar uppkoppling." },
];

const CATS = [
  { icon: "📋", bg: "#e6f2f8", name: "Skatteverket", count: "14 mallar", tags: ["Folkbokföring", "Deklaration", "Överklagande", "Anstånd"] },
  { icon: "🏥", bg: "#e6f8f1", name: "Försäkringskassan", count: "14 mallar", tags: ["Sjukpenning", "Föräldrapenning", "Omprövning", "Överklagande"] },
  { icon: "🌍", bg: "#f0ebff", name: "Migrationsverket", count: "14 mallar", tags: ["Uppehållstillstånd", "Medborgarskap", "Arbetstillstånd", "Asyl"] },
  { icon: "⚖️", bg: "#fff0f0", name: "Kronofogden", count: "6 mallar", tags: ["Bestrida skuld", "Skuldsanering", "Betalningsplan"] },
  { icon: "💼", bg: "#fff8e6", name: "Arbetsförmedlingen", count: "6 mallar", tags: ["A-kassa", "Aktivitetsrapport", "Överklagande"] },
  { icon: "🏠", bg: "#e6f2f8", name: "Boverket + fler", count: "10+ mallar", tags: ["Bostadsbidrag", "Inkasso", "Socialtjänsten"] },
];

const LOSS_ITEMS = [
  { bad: "2–3 timmar att hitta rätt formulering", good: "Redo mall på under 30 sekunder" },
  { bad: "Risk att skriva fel ton eller missförstås", good: "Korrekt, formell svenska — direkt" },
  { bad: "Stress och osäkerhet inför varje svar", good: "Lugn och trygghet — texten är redan klar" },
  { bad: "Ärendet försenas pga misstag eller tomma sidor", good: "Skickar i tid — missar inga frister" },
  { bad: "Dyr juridisk rådgivning för ett enkelt svar", good: "Gratis — inga prenumerationer" },
  { bad: "Vet inte ens var du ska börja", good: "Klar text att kopiera och anpassa direkt" },
];

const FAQS = [
  { q: "Vad är Svar Direkt?", a: "Svar Direkt är en app med 52+ färdiga mallar för kommunikation med svenska myndigheter — Skatteverket, Försäkringskassan, Migrationsverket och Boverket. Välj rätt mall, kopiera texten och skicka. Inga tomma sidor, ingen gissning." },
  { q: "För vem passar appen?", a: "Appen passar alla som bor och lever i Sverige och ibland behöver kommunicera med myndigheter men inte alltid vet hur man formulerar sig. Nyanlända, personer med svenska som andraspråk, men också infödda svenskar som vill spara tid och slippa stressa." },
  { q: "Hur fungerar mallarna?", a: "Du väljer situation — t.ex. 'svar på begäran om komplettering från Försäkringskassan' — kopierar texten, fyller i dina egna uppgifter och skickar. Alla mallar är skrivna på korrekt, formell svenska och anpassade till den specifika myndighetens kommunikationsstil." },
  { q: "Är det här juridisk rådgivning?", a: "Nej. Svar Direkt ger dig hjälp att formulera dig — inte juridisk rådgivning. För komplexa juridiska frågor bör du alltid kontakta en jurist. Men för de flesta vardagliga myndighetssituationer räcker en välformulerad mall långt." },
  { q: "Vad ingår i appen och vad kostar den?", a: "Grundappen är gratis och innehåller alla myndighetsmallarna. App med AI kostar 79 kr/mån med 7 dagars gratis provperiod. Personlig mall kostar 99 kr — engångskostnad, inga prenumerationer." },
  { q: "Fungerar appen utan internet?", a: "Ja! Alla 52+ mallar är tillgängliga helt offline när du väl laddat ner appen. Perfekt när du är på myndighetsbesök eller saknar internetuppkoppling." },
];

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b">
    <path d="M7 1l1.5 3 3.3.5-2.4 2.3.6 3.2L7 8.5l-3 1.5.6-3.2-2.4-2.3 3.3-.5L7 1z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState("");
  const [epost, setEpost] = useState("");
  const [kategori, setKategori] = useState("");
  const [amne, setAmne] = useState("");
  const [meddelande, setMeddelande] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlSuccess, setNlSuccess] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [count52, setCount52] = useState(0);
  const [count7, setCount7] = useState(0);
  const countRef52 = useRef<HTMLSpanElement>(null);
  const countRef7 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Inject CSS
    const styleId = "sd-new-css";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent = NEW_CSS;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll reveal
    const els = document.querySelectorAll(".sd-reveal,.sd-reveal-left,.sd-reveal-right");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => obs.observe(el));

    // Scroll-to-top
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Counter animation
    function animateNum(setter: (n: number) => void, target: number, ref: React.RefObject<HTMLSpanElement>) {
      if (!ref.current) return;
      const obs2 = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          obs2.disconnect();
          const dur = 1600; let t0: number | null = null;
          function step(ts: number) {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setter(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
            else setter(target);
          }
          requestAnimationFrame(step);
        }
      }, { threshold: 0.5 });
      obs2.observe(ref.current);
    }
    animateNum(setCount52, 52, countRef52);
    animateNum(setCount7, 7, countRef7);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setContactError(""); setContactSending(true);
    try {
      const res = await fetch("/contact.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ epost, kategori, amne, meddelande }) });
      const data = await res.json();
      if (data.success) { setContactSubmitted(true); return; }
      setContactError(data.message || "Något gick fel. Skriv direkt till info@svardirekt.site");
    } catch {
      setContactSubmitted(true);
    } finally { setContactSending(false); }
  }

  function handleNewsletter() {
    if (!nlEmail || !nlEmail.includes("@")) return;
    setNlSuccess(true); setNlEmail("");
  }

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: (i * 5.5 + 2) % 100, dur: 8 + (i * 1.3) % 12, delay: -(i * 0.8) % 15, size: 2 + (i % 3),
  }));

  return (
    <div>
      {/* HERO */}
      <section className="sd-hero" id="hero">
        <div className="sd-hero-bg" />
        {particles.map(p => (
          <div key={p.id} className="sd-particle" style={{
            left: `${p.left}%`, bottom: "-10px", width: `${p.size}px`, height: `${p.size}px`,
            background: "rgba(255,255,255,0.12)", animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
          }} />
        ))}
        <div className="sd-inner w-full" style={{ paddingTop: "80px", paddingBottom: "80px", position: "relative", zIndex: 2 }}>
          <div className="sd-hero-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <div className="sd-badge sd-reveal">
                <span className="sd-dot" />
                52+ färdiga mallar — tillgänglig nu för Android
              </div>
              <h1 className="sd-hero-title sd-reveal sd-s1">
                Hitta rätt mall.<br />
                Kopiera texten.<br />
                <span>Du skickar det direkt.</span>
              </h1>
              <p className="sd-hero-sub sd-reveal sd-s2">
                Välj bland 52+ färdiga mallar för svenska myndigheter. Formella, korrekta texter för Skatteverket, Försäkringskassan, Migrationsverket och fler — redo att kopieras och skickas.
              </p>
              <div className="sd-reveal sd-s3" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}>
                <a href="https://payhip.com/b/WxtV3" target="_blank" rel="noopener noreferrer" className="sd-btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v13M7 11l5 5 5-5M20 19H4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Ladda ner gratis
                </a>
                <a href="#pricing" className="sd-btn-amber" onClick={e => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>
                  ✨ App med AI — 79 kr/mån
                </a>
                <a href="#how" className="sd-btn-outline" onClick={e => { e.preventDefault(); document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Hur det fungerar
                </a>
              </div>
              <div className="sd-trust sd-reveal sd-s4">
                {[{ icon: "🔒", text: "SSL-säker betalning" }, { icon: "✅", text: "30-dagars returrätt" }, { icon: "📲", text: "Direkt nedladdning" }].map(t => (
                  <span key={t.text} className="sd-trust-item"><span>{t.icon}</span>{t.text}</span>
                ))}
              </div>
            </div>
            <div className="sd-hero-visual" style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                <div className="sd-phone-wrap">
                  <div className="sd-phone">
                    <div style={{ height: "24px", background: "#0a1520", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <div style={{ width: "64px", height: "14px", background: "#0f1923", borderRadius: "8px" }} />
                    </div>
                    <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <img src={logoSrc} alt="" style={{ width: "28px", height: "28px", borderRadius: "8px", objectFit: "cover" }} />
                        <div style={{ height: "8px", width: "80px", background: "#2a3a4a", borderRadius: "4px" }} />
                      </div>
                      {PHONE_CATS.map(c => (
                        <div key={c.label} style={{ borderRadius: "12px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", background: c.color + "25", borderLeft: `3px solid ${c.color}` }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                          <span style={{ fontSize: "10px", color: "#fff", fontWeight: 500 }}>{c.label}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: "4px", borderRadius: "12px", background: "rgba(26,158,207,0.15)", border: "1px solid rgba(26,158,207,0.25)", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "9px", color: "#1a9ecf", fontWeight: 600 }}>AI Generator ✨</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a9ecf" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="sd-phone-glow" />
                </div>
                {/* Floating badge top-right */}
                <div style={{ position: "absolute", top: "-12px", right: "-12px", background: "#1a9ecf", borderRadius: "12px", padding: "8px 12px", boxShadow: "0 8px 32px rgba(26,158,207,0.35)" }} className="hidden sm:block">
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: 700, textTransform: "uppercase" }}>Mallar</div>
                  <div style={{ fontSize: "13px", fontWeight: 900, color: "#fff" }}>52+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" style={{ display: "block", width: "100%" }}>
            <path d="M0 48L0 28Q360 0 720 28Q1080 48 1440 28L1440 48Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* STATS */}
      <div className="sd-stats">
        <div className="sd-stats-inner">
          <div className="sd-stat sd-reveal sd-s1">
            <div className="sd-stat-num"><span ref={countRef52}>{count52}</span>+</div>
            <div className="sd-stat-label">Färdiga mallar</div>
          </div>
          <div className="sd-stat sd-reveal sd-s2">
            <div className="sd-stat-num"><span ref={countRef7}>{count7}</span></div>
            <div className="sd-stat-label">Svenska myndigheter</div>
          </div>
          <div className="sd-stat sd-reveal sd-s3">
            <div className="sd-stat-num">30s</div>
            <div className="sd-stat-label">Klar mall på under</div>
          </div>
          <div className="sd-stat sd-reveal sd-s4">
            <div className="sd-stat-num">100%</div>
            <div className="sd-stat-label">Nöjdhetsgaranti</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="sd-section" id="how" style={{ background: "#f5f8fa" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Så fungerar det</span>
            <h2 className="sd-title sd-reveal sd-s1">Tre steg. Inga krångel.</h2>
            <p className="sd-sub sd-reveal sd-s2">Från tomt papper till färdigt brev på under en minut.</p>
          </div>
          <div className="sd-steps">
            {[
              { n: "1", icon: "🏛️", title: "Välj myndighet", desc: "Öppna appen och välj vilken myndighet du vill skriva till — Skatteverket, Försäkringskassan, Kronofogden och fler." },
              { n: "2", icon: "📄", title: "Välj rätt mall", desc: "52+ mallar sorterade per myndighet och ärendetyp. Färdiga, formella texter på korrekt svenska — klara att använda." },
              { n: "3", icon: "📤", title: "Kopiera och skicka", desc: "Tryck för att kopiera hela texten. Klistra in och skicka till myndigheten — klart på under en minut." },
            ].map((s, i) => (
              <div key={s.n} className={`sd-step sd-reveal sd-s${i + 1}`}>
                <div className="sd-step-num">{s.n}</div>
                <div className="sd-step-icon">{s.icon}</div>
                <div className="sd-step-title">{s.title}</div>
                <div className="sd-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sd-section" id="features" style={{ background: "#fff" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Funktioner</span>
            <h2 className="sd-title sd-reveal sd-s1">Allt du behöver i ett ställe</h2>
            <p className="sd-sub sd-reveal sd-s2">Inga abonnemang. Inga dolda kostnader. Bara verktyg som fungerar.</p>
          </div>
          <div className="sd-features">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`sd-feat sd-reveal sd-s${i + 1}`}>
                <div className="sd-feat-icon" style={{ color: "#0a7ea4" }}>{f.icon}</div>
                <div className="sd-feat-title">{f.title}</div>
                <div className="sd-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="sd-section" id="categories" style={{ background: "linear-gradient(135deg,#f0f7fb 0%,#f5f8fa 100%)" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Myndigheter</span>
            <h2 className="sd-title sd-reveal sd-s1">Mallar för alla svenska myndigheter</h2>
            <p className="sd-sub sd-reveal sd-s2">Välj din myndighet och hitta rätt mall för din situation.</p>
          </div>
          <div className="sd-cats">
            {CATS.map((c, i) => (
              <div key={c.name} className={`sd-cat sd-reveal sd-s${i + 1}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div className="sd-cat-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <div>
                    <div className="sd-cat-name">{c.name}</div>
                    <div className="sd-cat-count">{c.count}</div>
                  </div>
                </div>
                <div className="sd-cat-tags">
                  {c.tags.map(t => <span key={t} className="sd-cat-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="sd-table-wrap sd-reveal" style={{ marginTop: "40px" }}>
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Myndighet</th>
                  <th className="accent">Antal mallar</th>
                </tr>
              </thead>
              <tbody>
                {[["Försäkringskassan","14 mallar"],["Skatteverket","14 mallar"],["Migrationsverket","14 mallar"],["Boverket","10 mallar"],["Kronofogden","6 mallar"],["Arbetsförmedlingen","6 mallar"],["Inkasso","4 mallar"]].map(([name, count]) => (
                  <tr key={name}><td>{name}</td><td className="check">✓ {count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="sd-section" id="compare" style={{ background: "#fff" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Jämförelse</span>
            <h2 className="sd-title sd-reveal sd-s1">Varför inte bara googla?</h2>
            <p className="sd-sub sd-reveal sd-s2">Du har säkert tänkt på alternativen. Här är varför de inte räcker.</p>
          </div>
          <div className="sd-table-wrap sd-reveal" style={{ marginTop: "40px" }}>
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Alternativ</th>
                  <th>Problemet</th>
                  <th className="accent">Svar Direkt</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["🔍 Google", "Generiska texter, på engelska, osäkra källor — tar timmar.", "Färdiga svenska texter för exakt din situation."],
                  ["🤖 ChatGPT", "Kräver att du vet vad du frågar. Inte tränat för svenska myndigheter.", "Mallar anpassade för svenska myndigheter. Inga juridiska termer behövs."],
                  ["⚖️ Jurist", "1 000–3 000 kr per timme. Orimligt för ett enkelt svar.", "Personlig hjälp från 99 kr. Första svaret gratis."],
                ].map(([alt, prob, sd]) => (
                  <tr key={alt}><td><strong>{alt}</strong></td><td>{prob}</td><td className="sd">{sd}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* LOSS AVERSION */}
      <section className="sd-section" style={{ background: "#f5f8fa" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Vad kostar det att vänta?</span>
            <h2 className="sd-title sd-reveal sd-s1">Vad händer utan Svar Direkt?</h2>
            <p className="sd-sub sd-reveal sd-s2">Varje myndighetsbrev du skjuter upp kostar tid, pengar och nerv.</p>
          </div>
          <div className="sd-loss-grid">
            <div className="sd-loss-col sd-reveal sd-s1">
              <div className="sd-loss-header sd-loss-bad-h">
                <div className="sd-loss-icon" style={{ background: "#fee2e2" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                Utan Svar Direkt
              </div>
              <div className="sd-loss-body sd-loss-bad-b">
                {LOSS_ITEMS.map((item, i) => (
                  <div key={i} className="sd-loss-row">
                    <div className="sd-loss-dot sd-loss-bad-d">✗</div>
                    <div className="sd-loss-text">{item.bad}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sd-loss-col sd-reveal sd-s2">
              <div className="sd-loss-header sd-loss-good-h">
                <div className="sd-loss-icon" style={{ background: "#dcfce7" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                Med Svar Direkt
              </div>
              <div className="sd-loss-body sd-loss-good-b">
                {LOSS_ITEMS.map((item, i) => (
                  <div key={i} className="sd-loss-row">
                    <div className="sd-loss-dot sd-loss-good-d">✓</div>
                    <div className="sd-loss-text sd-loss-good-text">{item.good}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sd-section" style={{ background: "#fff" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Omdömen</span>
            <h2 className="sd-title sd-reveal sd-s1">Vad säger användarna?</h2>
          </div>
          <div className="sd-testi-grid">
            {[
              { quote: "Jag visste inte var jag skulle börja med Försäkringskassan. Appen hade exakt rätt mall — färdig, formell och klar att skicka. Fick svar inom en vecka.", author: "Användare i Stockholm" },
              { quote: "Kronofogden skickade ett krav och jag fick panik. Appen hade exakt den mallen jag behövde — professionell svenska, rätt ton, klart att kopiera.", author: "Användare i Göteborg" },
              { quote: "Appen sparade mig hundratals kronor i juridisk rådgivning. Jag hittade rätt mall, kopierade texten och skickade direkt. Snabbt, enkelt och korrekt.", author: "Användare i Malmö" },
            ].map((t, i) => (
              <div key={i} className={`sd-testi sd-reveal sd-s${i + 1}`}>
                <div className="sd-stars">{[1,2,3,4,5].map(s => <StarIcon key={s} />)}</div>
                <p className="sd-testi-quote">"{t.quote}"</p>
                <div className="sd-testi-author">{t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="sd-section sd-pricing" id="pricing">
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-pricing-label sd-reveal">Priser</span>
            <h2 className="sd-title sd-pricing-title sd-reveal sd-s1">Välj din plan</h2>
            <p className="sd-sub sd-pricing-sub sd-reveal sd-s2">Börja gratis. Uppgradera när du vill. Inga bindningstider.</p>
          </div>
          <div className="sd-price-grid">
            {/* Free */}
            <div className="sd-price-card sd-reveal sd-s1">
              <div className="sd-price-label">Gratis app</div>
              <div className="sd-price-amount">0<span className="sd-price-unit">kr</span></div>
              <div className="sd-price-note">Engångsnedladdning · Inget konto krävs</div>
              <div className="sd-price-divider" />
              <div className="sd-price-features">
                {["52+ färdiga mallar","7 myndigheter","Fungerar offline","Kopiera med ett tryck"].map(f => (
                  <div key={f} className="sd-price-feature"><CheckIcon />{f}</div>
                ))}
              </div>
              <a href="https://payhip.com/b/WxtV3" target="_blank" rel="noopener noreferrer" className="sd-price-btn sd-price-btn-primary">Ladda ner gratis</a>
            </div>
            {/* AI - Featured */}
            <div className="sd-price-card featured sd-reveal sd-s2">
              <div className="sd-price-badge">Mest populär ✨</div>
              <div className="sd-price-label amber">App med AI</div>
              <div className="sd-price-amount">79<span className="sd-price-unit">kr/mån</span></div>
              <div className="sd-price-note">7 dagars gratis provperiod · Avsluta när du vill</div>
              <div className="sd-price-divider" />
              <div className="sd-price-features">
                {["Allt i gratis-appen","AI-generator för anpassade brev","Historia av genererade brev","Påminnelser om frister","Försvar – rättslig guidning"].map(f => (
                  <div key={f} className="sd-price-feature"><CheckIcon />{f}</div>
                ))}
              </div>
              <a href="https://payhip.com/b/WxtV3" target="_blank" rel="noopener noreferrer" className="sd-price-btn sd-price-btn-amber">Starta 7 dagars gratis test</a>
            </div>
            {/* Personal */}
            <div className="sd-price-card sd-reveal sd-s3">
              <div className="sd-price-label">Personlig mall</div>
              <div className="sd-price-amount">99<span className="sd-price-unit">kr</span></div>
              <div className="sd-price-note">Engångskostnad · Svar inom 24h</div>
              <div className="sd-price-divider" />
              <div className="sd-price-features">
                {["Anpassad mall för din situation","Svar inom 24 timmar","Första svaret gratis","Perfekt för komplexa ärenden"].map(f => (
                  <div key={f} className="sd-price-feature"><CheckIcon />{f}</div>
                ))}
              </div>
              <Link href="/tjanst" className="sd-price-btn sd-price-btn-outline">Beställ personlig mall</Link>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <div className="sd-guarantee" style={{ display: "inline-flex" }}>
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>🛡️</span>
              <div>
                <div className="sd-guarantee-title">30 dagar pengarna tillbaka</div>
                <div className="sd-guarantee-sub">Är du inte nöjd — återbetalar vi 100%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sd-section" id="faq" style={{ background: "#fff" }}>
        <div className="sd-inner-sm">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Vanliga frågor</span>
            <h2 className="sd-title sd-reveal sd-s1">Har du frågor om Svar Direkt?</h2>
            <p className="sd-sub sd-reveal sd-s2">Här svarar vi på det vi får frågor om mest.</p>
          </div>
          <div className="sd-faq-list sd-reveal">
            {FAQS.map((faq, i) => (
              <div key={i} className="sd-faq-item">
                <button className="sd-faq-btn" onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i}>
                  <span className="sd-faq-q">{faq.q}</span>
                  <span className={`sd-faq-icon ${faqOpen === i ? "open" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </button>
                <div className={`sd-faq-answer ${faqOpen === i ? "open" : ""}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sd-section" id="contact" style={{ background: "#f5f8fa" }}>
        <div className="sd-inner">
          <div style={{ textAlign: "center" }}>
            <span className="sd-label sd-reveal">Kontakt</span>
            <h2 className="sd-title sd-reveal sd-s1">Behöver du hjälp?</h2>
            <p className="sd-sub sd-reveal sd-s2">Hittar du inte rätt mall? Vi guidar dig till rätt formulering.</p>
          </div>
          <div className="sd-contact-grid">
            <div className="sd-contact-info sd-reveal-left">
              <div className="sd-ci-item">
                <div className="sd-ci-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div>
                  <div className="sd-ci-title">E-post</div>
                  <div className="sd-ci-sub"><a href="mailto:info@svardirekt.site">info@svardirekt.site</a></div>
                </div>
              </div>
              <div className="sd-ci-item">
                <div className="sd-ci-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div>
                  <div className="sd-ci-title">Svarstid</div>
                  <div className="sd-ci-sub">Vi svarar inom 24 timmar</div>
                </div>
              </div>
              <div className="sd-ci-item">
                <div className="sd-ci-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <div>
                  <div className="sd-ci-title">Forum</div>
                  <div className="sd-ci-sub"><Link href="/forum">Fråga communityn anonymt</Link></div>
                </div>
              </div>
              <div style={{ marginTop: "8px", padding: "18px", background: "#f0f7fb", borderRadius: "14px", borderLeft: "3px solid #0a7ea4" }}>
                <p style={{ fontSize: ".85rem", color: "#5a7080", lineHeight: "1.65" }}>
                  <strong style={{ color: "#0f1923" }}>Obs:</strong> Svar Direkt erbjuder inte juridisk rådgivning och gör ingen individuell bedömning. Vi hjälper till att guida dig till rätt mallar och innehåll.
                </p>
              </div>
            </div>
            <div className="sd-form-wrap sd-reveal-right">
              {contactSubmitted ? (
                <div className="sd-form-success">
                  <div className="sd-form-success-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f1923" }}>Tack! Vi har tagit emot ditt meddelande.</h3>
                  <p style={{ fontSize: ".875rem", color: "#5a7080", maxWidth: "320px" }}>Vi återkommer till din e-postadress så snart vi kan.</p>
                </div>
              ) : (
                <form onSubmit={handleContact}>
                  <div className="sd-form-group">
                    <label className="sd-form-label">Din e-postadress <span style={{ color: "#dc2626" }}>*</span></label>
                    <input type="email" required value={epost} onChange={e => setEpost(e.target.value)} placeholder="din@email.com" className="sd-form-input" />
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-form-label">Kategori</label>
                    <select value={kategori} onChange={e => setKategori(e.target.value)} className="sd-form-select">
                      <option value="">Välj kategori…</option>
                      {["Skatteverket","Försäkringskassan","Boverket","Migrationsverket","Kronofogden","Arbetsförmedlingen","Annat"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-form-label">Vad gäller det?</label>
                    <input type="text" value={amne} onChange={e => setAmne(e.target.value)} placeholder="Beskriv kortfattat vad ärendet handlar om" className="sd-form-input" />
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-form-label">Meddelande</label>
                    <textarea value={meddelande} onChange={e => setMeddelande(e.target.value)} rows={4} placeholder="Berätta mer om vad du söker hjälp med…" className="sd-form-textarea" />
                  </div>
                  {contactError && <div className="sd-form-error">{contactError}</div>}
                  <button type="submit" disabled={contactSending} className="sd-form-submit">
                    {contactSending ? <><div className="sd-spinner" />Skickar…</> : "Skicka meddelande"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="sd-newsletter">
        <div className="sd-nl-inner">
          <span className="sd-label sd-reveal" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>Nyhetsbrev</span>
          <h2 className="sd-title sd-reveal sd-s1" style={{ color: "#fff" }}>Håll dig uppdaterad</h2>
          <p className="sd-sub sd-reveal sd-s2" style={{ color: "rgba(255,255,255,0.75)" }}>Få tips om dina rättigheter, nya mallar och guider direkt i inkorgen.</p>
          {nlSuccess ? (
            <div className="sd-nl-success">✓ Tack! Du är nu prenumerant.</div>
          ) : (
            <div className="sd-nl-form sd-reveal sd-s3">
              <input type="email" value={nlEmail} onChange={e => setNlEmail(e.target.value)} className="sd-nl-input" placeholder="din@email.com" />
              <button className="sd-nl-btn" onClick={handleNewsletter}>Prenumerera</button>
            </div>
          )}
          <p className="sd-nl-disclaimer sd-reveal">Inga spam. Avprenumerera när du vill. Max 1 e-post per vecka.</p>
        </div>
      </section>

      {/* Scroll to top */}
      <button className={`sd-scroll-top ${showScrollTop ? "visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Till toppen">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </div>
  );
}
