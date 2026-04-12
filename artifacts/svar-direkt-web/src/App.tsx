import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Landmark, 
  Globe, 
  Home,
  ArrowRight
} from "lucide-react";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const PhoneMockup = () => (
  <div className="relative mx-auto w-[280px] h-[580px] border-[12px] border-slate-900 rounded-[2.5rem] bg-slate-950 shadow-2xl overflow-hidden ring-4 ring-primary/20">
    <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl w-32 mx-auto z-10" />
    <div className="p-4 pt-12 flex flex-col gap-4 h-full relative">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-primary" />
        </div>
        <div className="h-2 w-16 bg-slate-800 rounded-full" />
      </div>
      <div className="h-32 bg-slate-800 rounded-2xl p-4 flex flex-col justify-end border border-slate-700/50">
        <div className="h-3 w-3/4 bg-slate-600 rounded-full mb-3" />
        <div className="h-2 w-1/2 bg-slate-600/50 rounded-full" />
      </div>
      <div className="flex-1 bg-slate-900 rounded-2xl p-4 space-y-4 border border-slate-800">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 bg-slate-800 rounded-xl flex items-center px-4 gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center">
               <div className="w-3 h-3 bg-primary rounded-sm" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-full bg-slate-600 rounded-full mb-2" />
              <div className="h-1.5 w-2/3 bg-slate-600/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto h-12 bg-primary rounded-xl flex items-center justify-center">
        <div className="h-2 w-1/3 bg-white/50 rounded-full" />
      </div>
    </div>
  </div>
);

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </div>
            Svar Direkt
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#problem" className="hover:text-primary transition-colors">Problemet</a>
            <a href="#funktioner" className="hover:text-primary transition-colors">Lösningen</a>
            <a href="#myndigheter" className="hover:text-primary transition-colors">Myndigheter</a>
            <a href="#paket" className="hover:text-primary transition-colors">Paket</a>
          </div>
          <a href="#download" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25">
            Ladda ner
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nu tillgänglig i Sverige
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Skriv rätt.<br />
              <span className="text-primary">Få svar.</span><br />
              Sluta stressa.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Färdiga mallar, snabba SMS-svar och PDF-guider för verkliga problem i Sverige. Rätt ord till rätt myndighet, direkt i mobilen.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                <Smartphone className="w-5 h-5" />
                Ladda ner appen
              </a>
              <a href="#paket" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-full text-lg font-semibold transition-all border border-slate-200 hover:border-slate-300">
                Se paket
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Säkert
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Snabbt
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Juridiskt korrekt
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-md relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full -z-10" />
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
            Fel ord kan kosta tid, pengar och energi
          </h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Att ha kontakt med myndigheter, hyresvärdar eller inkasso är tillräckligt stressande. Att dessutom inte veta exakt vad man ska skriva gör det värre. Ett missat ord kan leda till avslag, fördröjningar eller dyra misstag.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
              <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Långa väntetider</h3>
              <p className="text-slate-600 text-sm">Felaktigt ifyllda ansökningar skickas tillbaka och du hamnar sist i kön igen.</p>
            </div>
            <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100">
              <AlertCircle className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Ekonomiska risker</h3>
              <p className="text-slate-600 text-sm">Ett felformulerat bestridande kan göra att du blir skyldig att betala felaktiga krav.</p>
            </div>
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
              <AlertCircle className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Psykisk stress</h3>
              <p className="text-slate-600 text-sm">Oron över att skriva "fel sak" håller dig vaken om nätterna och stjäl din energi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funktioner" className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Lösningen är färdiga svar</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Svar Direkt ger dig exakt vad du behöver skriva. Kopiera, klistra in, skicka.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Färdiga svar</h3>
              <p className="text-slate-600 leading-relaxed">Professionellt formulerade texter för de flesta situationer du kan stöta på.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tydliga mallar</h3>
              <p className="text-slate-600 leading-relaxed">Strukturerade brev och ansökningar som myndigheter förstår och accepterar.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Snabba SMS</h3>
              <p className="text-slate-600 leading-relaxed">Korta, koncisa svar för arbetsgivare, hyresvärdar eller svåra relationer.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direkt i mobilen</h3>
              <p className="text-slate-600 leading-relaxed">Alltid tillgängligt när du behöver det som mest. Fungerar offline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Authorities Section */}
      <section id="myndigheter" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Korrekt språk för rätt instans</h2>
              <p className="text-xl text-slate-600">
                Olika myndigheter kräver olika jargong. Vi har anpassat mallarna så att de passar mottagaren perfekt.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 md:p-10 border border-slate-100 hover:border-[#00b894]/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark className="w-32 h-32 text-[#00b894]" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#00b894]/10 flex items-center justify-center mb-6">
                  <Landmark className="w-8 h-8 text-[#00b894]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Skatteverket</h3>
                <p className="text-slate-600 text-lg max-w-sm mb-6">Hantera deklarationer, skattekrav, folkbokföring och företagsfrågor med rätt terminologi.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 md:p-10 border border-slate-100 hover:border-[#0984e3]/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-[#0984e3]" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#0984e3]/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-[#0984e3]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Försäkringskassan</h3>
                <p className="text-slate-600 text-lg max-w-sm mb-6">Överklaganden, sjukskrivningar, vab och bidragsansökningar formulerade för att bli godkända.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 md:p-10 border border-slate-100 hover:border-[#6c5ce7]/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-32 h-32 text-[#6c5ce7]" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#6c5ce7]/10 flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-[#6c5ce7]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Migrationsverket</h3>
                <p className="text-slate-600 text-lg max-w-sm mb-6">Tydliga brev för kompletteringar, påskyndanden och frågor om uppehållstillstånd.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 md:p-10 border border-slate-100 hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Home className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Boverket & Hyresrätt</h3>
                <p className="text-slate-600 text-lg max-w-sm mb-6">Bestridande av uppsägning, klagomål på brister och formella krav till hyresvärdar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Så fungerar det</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Från problem till professionellt svar på under en minut.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-800" />
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center text-3xl font-bold mb-6 ring-8 ring-slate-900">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Ladda ner appen</h3>
              <p className="text-slate-400">Installera Svar Direkt från App Store eller Google Play utan krånglig registrering.</p>
            </div>

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center text-3xl font-bold mb-6 ring-8 ring-slate-900">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Välj paket</h3>
              <p className="text-slate-400">Hitta den kategori som matchar ditt problem. Myndigheter, jobb, boende eller ekonomi.</p>
            </div>

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center text-3xl font-bold mb-6 ring-8 ring-slate-900">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Kopiera & skicka</h3>
              <p className="text-slate-400">Fyll i dina uppgifter i mallen, kopiera texten och skicka. Klart!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="paket" className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Köp de svar du behöver</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Inga dyra abonnemang. Köp bara de paket och guider som löser ditt specifika problem just nu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Package 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-xl hover:border-primary/30 transition-all group">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Snabba svar</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Arbete</h3>
                <p className="text-slate-600 text-sm h-16">67 professionella SMS-svar och mail för jobbsituationer, sjukskrivningar och konflikter.</p>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-extrabold text-slate-900 mb-6">49 kr</div>
                <a href="#" className="w-full block text-center bg-slate-900 hover:bg-primary text-white font-semibold py-3 rounded-xl transition-colors">
                  Köp nu
                </a>
              </div>
            </div>

            {/* Package 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-xl hover:border-primary/30 transition-all group">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-100 px-3 py-1 rounded-full">Snabba svar</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Relationer</h3>
                <p className="text-slate-600 text-sm h-16">Tydliga, gränssättande svar för sociala och personliga situationer. Säg nej på ett snyggt sätt.</p>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-extrabold text-slate-900 mb-6">49 kr</div>
                <a href="#" className="w-full block text-center bg-slate-900 hover:bg-primary text-white font-semibold py-3 rounded-xl transition-colors">
                  Köp nu
                </a>
              </div>
            </div>

            {/* Package 3 */}
            <div className="bg-white rounded-3xl p-8 border-2 border-primary shadow-md flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                Mest populär
              </div>
              <div className="mb-6 mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">PDF-Guide</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Kronofogden</h3>
                <p className="text-slate-600 text-sm h-16">Komplett guide för att hantera skulder, bestrida felaktiga krav och kommunicera rätt.</p>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-extrabold text-primary mb-6">79 kr</div>
                <a href="#" className="w-full block text-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-primary/25">
                  Köp nu
                </a>
              </div>
            </div>

            {/* Package 4 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-xl hover:border-primary/30 transition-all group">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">PDF-Guide</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Tjäna pengar</h3>
                <p className="text-slate-600 text-sm h-16">Praktisk guide för sidoinkomster, frilansande i Sverige och hur du skattar rätt.</p>
              </div>
              <div className="mt-auto">
                <div className="text-3xl font-extrabold text-slate-900 mb-6">79 kr</div>
                <a href="#" className="w-full block text-center bg-slate-900 hover:bg-primary text-white font-semibold py-3 rounded-xl transition-colors">
                  Köp nu
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 tracking-tight">För vem är Svar Direkt?</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              "Du som känner dig osäker på formell svenska",
              "Du som har en pågående tvist med hyresvärden",
              "Du som fått ett krav från Inkasso eller Kronofogden",
              "Du som vill överklaga ett beslut från Försäkringskassan",
              "Du som behöver sjukskriva dig och vill formulera det rätt",
              "Du som vill bestrida en felaktig faktura snabbt"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="download" className="py-24 bg-primary relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Redo att göra det enklare?</h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Sluta gissa vad du ska skriva. Ladda ner Svar Direkt idag och få tillgång till professionella svar direkt i din telefon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#download" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary hover:bg-slate-50 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl hover:-translate-y-0.5">
              <Smartphone className="w-5 h-5" />
              Ladda ner appen
            </a>
            <a href="#paket" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-foreground/10 text-white hover:bg-primary-foreground/20 px-8 py-4 rounded-full text-lg font-bold transition-all border border-white/20">
              Se alla paket
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </div>
            Svar Direkt
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
            <a href="mailto:info@svardirekt.se" className="hover:text-white transition-colors">info@svardirekt.se</a>
            <a href="#" className="hover:text-white transition-colors">Villkor</a>
            <a href="#" className="hover:text-white transition-colors">Integritetspolicy</a>
          </div>
          
          <div className="text-sm">
            &copy; 2026 Svar Direkt
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;