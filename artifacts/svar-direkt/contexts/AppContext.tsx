import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryItem {
  id: string;
  templateTitle: string;
  content: string;
  usedAt: string;
}

export interface QuickResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  completed: boolean;
}

export interface CustomTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  favorites: string[];
  notes: Note[];
  history: HistoryItem[];
  quickResponses: QuickResponse[];
  reminders: Reminder[];
  customTemplates: CustomTemplate[];
  disclaimerAccepted: boolean;

  toggleFavorite: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;

  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addToHistory: (item: Omit<HistoryItem, "id" | "usedAt">) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;

  addQuickResponse: (qr: Omit<QuickResponse, "id" | "createdAt">) => void;
  updateQuickResponse: (id: string, updates: Partial<QuickResponse>) => void;
  deleteQuickResponse: (id: string) => void;

  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;

  addCustomTemplate: (t: Omit<CustomTemplate, "id" | "createdAt" | "updatedAt">) => void;
  updateCustomTemplate: (id: string, updates: Partial<CustomTemplate>) => void;
  deleteCustomTemplate: (id: string) => void;

  acceptDisclaimer: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const ts = new Date().toISOString();
const DEFAULT_QUICK_RESPONSES: QuickResponse[] = [
  { id: "dqr-1", title: "Mottaget – återkommer", content: "Hej, tack för ditt meddelande. Jag bekräftar mottagandet och återkommer inom kort.", createdAt: ts },
  { id: "dqr-2", title: "Bestrider kravet", content: "Jag bestrider detta krav i sin helhet. Vänligen skicka fullständig dokumentation och underlag.", createdAt: ts },
  { id: "dqr-3", title: "Fel person – kontrollera", content: "Ni har kontaktat fel person. Jag har ingen skuld till er och ber er kontrollera era uppgifter omgående.", createdAt: ts },
  { id: "dqr-4", title: "Skulden är preskriberad", content: "Den aktuella skulden är preskriberad och kan inte längre krävas. Se preskriptionslagen (1981:130). Ytterligare krav lämnas utan åtgärd.", createdAt: ts },
  { id: "dqr-5", title: "Skulden redan betald", content: "Betalning av denna skuld har redan skett. Kvitto och transaktionsreferens kan uppvisas på begäran. Ärendet bör avslutas.", createdAt: ts },
  { id: "dqr-6", title: "Begär specificerad faktura", content: "Jag begär en fullständigt specificerad faktura med underlag innan någon betalning sker.", createdAt: ts },
  { id: "dqr-7", title: "Önskar avbetalningsplan", content: "Jag erkänner skulden och önskar upprätta en avbetalningsplan. Vänligen kontakta mig för att komma överens om rimliga villkor.", createdAt: ts },
  { id: "dqr-8", title: "Kontaktar juridiskt ombud", content: "Jag har anlitat juridiskt ombud i detta ärende. Vänligen rikta all framtida kommunikation direkt till ombudet.", createdAt: ts },
  { id: "dqr-9", title: "Invändning till Kronofogden", content: "Jag har lämnat in en formell invändning mot er ansökan om betalningsföreläggande till Kronofogden.", createdAt: ts },
  { id: "dqr-10", title: "Begär skriftlig kommunikation", content: "Jag önskar att all kommunikation i detta ärende sker skriftligen och dokumenteras.", createdAt: ts },
  { id: "dqr-11", title: "Hyresvärden – brister i lägenheten", content: "Jag meddelar formellt att lägenheten har brister som hyresvärden är skyldig att åtgärda enligt hyreslagens regler.", createdAt: ts },
  { id: "dqr-12", title: "Inget avtal – bestrider", content: "Det finns inget undertecknat avtal som stödjer ert krav. Fakturan bestrids och lämnas utan betalning.", createdAt: ts },
  { id: "dqr-13", title: "Stoppa kontaktförsöken", content: "Jag ber er upphöra med alla kontaktförsök. Ytterligare kontakter dokumenteras och kan anmälas.", createdAt: ts },
  { id: "dqr-14", title: "Behöver mer tid", content: "Jag behöver ytterligare tid för att gå igenom ärendet. Återkommer med svar inom 14 dagar.", createdAt: ts },
  { id: "dqr-15", title: "Kräver kvitto på betalning", content: "Vänligen skicka ett skriftligt kvitto och bekräftelse på att betalningen är mottagen och skulden är reglerad.", createdAt: ts },
  { id: "dqr-16", title: "Inkasso – obefogat krav", content: "Kravet från inkassobolaget är obefogat. Ärendet lämnas vidare till Konsumentverket och Integritetsskyddsmyndigheten vid behov.", createdAt: ts },
  { id: "dqr-17", title: "Svarar ej utan ombud", content: "Jag kommer inte att svara på detta krav utan mitt juridiska ombuds närvaro. Vänta på kontakt från mitt ombud.", createdAt: ts },
  { id: "dqr-18", title: "Begär tidsfrist", content: "Jag begär en skälig tidsfrist på 30 dagar för att kunna inhämta juridisk rådgivning i detta ärende.", createdAt: ts },
];

const STORAGE_KEYS = {
  favorites: "@svardirekt:favorites",
  notes: "@svardirekt:notes",
  history: "@svardirekt:history",
  quickResponses: "@svardirekt:quickResponses",
  reminders: "@svardirekt:reminders",
  customTemplates: "@svardirekt:customTemplates",
  disclaimerAccepted: "@svardirekt:disclaimerAccepted",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [quickResponses, setQuickResponses] = useState<QuickResponse[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [favs, nts, hist, qrs, rems, cts, disc] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.notes),
          AsyncStorage.getItem(STORAGE_KEYS.history),
          AsyncStorage.getItem(STORAGE_KEYS.quickResponses),
          AsyncStorage.getItem(STORAGE_KEYS.reminders),
          AsyncStorage.getItem(STORAGE_KEYS.customTemplates),
          AsyncStorage.getItem(STORAGE_KEYS.disclaimerAccepted),
        ]);
        if (favs) setFavorites(JSON.parse(favs));
        if (nts) setNotes(JSON.parse(nts));
        if (hist) setHistory(JSON.parse(hist));
        if (qrs) {
          const parsed: QuickResponse[] = JSON.parse(qrs);
          if (parsed.length > 0) {
            setQuickResponses(parsed);
          } else {
            setQuickResponses(DEFAULT_QUICK_RESPONSES);
            AsyncStorage.setItem(STORAGE_KEYS.quickResponses, JSON.stringify(DEFAULT_QUICK_RESPONSES)).catch(() => {});
          }
        } else {
          setQuickResponses(DEFAULT_QUICK_RESPONSES);
          AsyncStorage.setItem(STORAGE_KEYS.quickResponses, JSON.stringify(DEFAULT_QUICK_RESPONSES)).catch(() => {});
        }
        if (rems) setReminders(JSON.parse(rems));
        if (cts) setCustomTemplates(JSON.parse(cts));
        if (disc) setDisclaimerAccepted(JSON.parse(disc));
      } catch {}
    };
    load();
  }, []);

  const persist = useCallback(async (key: string, value: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, []);

  const acceptDisclaimer = useCallback(() => {
    setDisclaimerAccepted(true);
    persist(STORAGE_KEYS.disclaimerAccepted, true);
  }, [persist]);

  const toggleFavorite = useCallback(
    (templateId: string) => {
      setFavorites((prev) => {
        const next = prev.includes(templateId)
          ? prev.filter((id) => id !== templateId)
          : [...prev, templateId];
        persist(STORAGE_KEYS.favorites, next);
        return next;
      });
    },
    [persist]
  );

  const isFavorite = useCallback(
    (templateId: string) => favorites.includes(templateId),
    [favorites]
  );

  const addNote = useCallback(
    (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      const newNote: Note = {
        ...note,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => {
        const next = [newNote, ...prev];
        persist(STORAGE_KEYS.notes, next);
        return next;
      });
    },
    [persist]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        );
        persist(STORAGE_KEYS.notes, next);
        return next;
      });
    },
    [persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = prev.filter((n) => n.id !== id);
        persist(STORAGE_KEYS.notes, next);
        return next;
      });
    },
    [persist]
  );

  const addToHistory = useCallback(
    (item: Omit<HistoryItem, "id" | "usedAt">) => {
      const newItem: HistoryItem = {
        ...item,
        id: generateId(),
        usedAt: new Date().toISOString(),
      };
      setHistory((prev) => {
        const next = [newItem, ...prev].slice(0, 100);
        persist(STORAGE_KEYS.history, next);
        return next;
      });
    },
    [persist]
  );

  const deleteHistoryItem = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const next = prev.filter((h) => h.id !== id);
        persist(STORAGE_KEYS.history, next);
        return next;
      });
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist(STORAGE_KEYS.history, []);
  }, [persist]);

  const addQuickResponse = useCallback(
    (qr: Omit<QuickResponse, "id" | "createdAt">) => {
      const newQr: QuickResponse = {
        ...qr,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setQuickResponses((prev) => {
        const next = [newQr, ...prev];
        persist(STORAGE_KEYS.quickResponses, next);
        return next;
      });
    },
    [persist]
  );

  const updateQuickResponse = useCallback(
    (id: string, updates: Partial<QuickResponse>) => {
      setQuickResponses((prev) => {
        const next = prev.map((qr) =>
          qr.id === id ? { ...qr, ...updates } : qr
        );
        persist(STORAGE_KEYS.quickResponses, next);
        return next;
      });
    },
    [persist]
  );

  const deleteQuickResponse = useCallback(
    (id: string) => {
      setQuickResponses((prev) => {
        const next = prev.filter((qr) => qr.id !== id);
        persist(STORAGE_KEYS.quickResponses, next);
        return next;
      });
    },
    [persist]
  );

  const addReminder = useCallback(
    (reminder: Omit<Reminder, "id" | "createdAt">) => {
      const newReminder: Reminder = {
        ...reminder,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setReminders((prev) => {
        const next = [...prev, newReminder].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        persist(STORAGE_KEYS.reminders, next);
        return next;
      });
    },
    [persist]
  );

  const updateReminder = useCallback(
    (id: string, updates: Partial<Reminder>) => {
      setReminders((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
        persist(STORAGE_KEYS.reminders, next);
        return next;
      });
    },
    [persist]
  );

  const deleteReminder = useCallback(
    (id: string) => {
      setReminders((prev) => {
        const next = prev.filter((r) => r.id !== id);
        persist(STORAGE_KEYS.reminders, next);
        return next;
      });
    },
    [persist]
  );

  const toggleReminderComplete = useCallback(
    (id: string) => {
      setReminders((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, completed: !r.completed } : r
        );
        persist(STORAGE_KEYS.reminders, next);
        return next;
      });
    },
    [persist]
  );

  const addCustomTemplate = useCallback(
    (t: Omit<CustomTemplate, "id" | "createdAt" | "updatedAt">) => {
      const newT: CustomTemplate = {
        ...t,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCustomTemplates((prev) => {
        const next = [newT, ...prev];
        persist(STORAGE_KEYS.customTemplates, next);
        return next;
      });
    },
    [persist]
  );

  const updateCustomTemplate = useCallback(
    (id: string, updates: Partial<CustomTemplate>) => {
      setCustomTemplates((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        );
        persist(STORAGE_KEYS.customTemplates, next);
        return next;
      });
    },
    [persist]
  );

  const deleteCustomTemplate = useCallback(
    (id: string) => {
      setCustomTemplates((prev) => {
        const next = prev.filter((t) => t.id !== id);
        persist(STORAGE_KEYS.customTemplates, next);
        return next;
      });
    },
    [persist]
  );

  return (
    <AppContext.Provider
      value={{
        favorites,
        notes,
        history,
        quickResponses,
        reminders,
        customTemplates,
        disclaimerAccepted,
        toggleFavorite,
        isFavorite,
        addNote,
        updateNote,
        deleteNote,
        addToHistory,
        deleteHistoryItem,
        clearHistory,
        addQuickResponse,
        updateQuickResponse,
        deleteQuickResponse,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminderComplete,
        addCustomTemplate,
        updateCustomTemplate,
        deleteCustomTemplate,
        acceptDisclaimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
