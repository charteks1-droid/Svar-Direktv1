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

  toggleFavorite: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;

  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addToHistory: (item: Omit<HistoryItem, "id" | "usedAt">) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;

  addQuickResponse: (
    qr: Omit<QuickResponse, "id" | "createdAt">
  ) => void;
  updateQuickResponse: (id: string, updates: Partial<QuickResponse>) => void;
  deleteQuickResponse: (id: string) => void;

  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;

  addCustomTemplate: (
    t: Omit<CustomTemplate, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCustomTemplate: (id: string, updates: Partial<CustomTemplate>) => void;
  deleteCustomTemplate: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const STORAGE_KEYS = {
  favorites: "@svardirekt:favorites",
  notes: "@svardirekt:notes",
  history: "@svardirekt:history",
  quickResponses: "@svardirekt:quickResponses",
  reminders: "@svardirekt:reminders",
  customTemplates: "@svardirekt:customTemplates",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [quickResponses, setQuickResponses] = useState<QuickResponse[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [favs, nts, hist, qrs, rems, cts] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.notes),
          AsyncStorage.getItem(STORAGE_KEYS.history),
          AsyncStorage.getItem(STORAGE_KEYS.quickResponses),
          AsyncStorage.getItem(STORAGE_KEYS.reminders),
          AsyncStorage.getItem(STORAGE_KEYS.customTemplates),
        ]);
        if (favs) setFavorites(JSON.parse(favs));
        if (nts) setNotes(JSON.parse(nts));
        if (hist) setHistory(JSON.parse(hist));
        if (qrs) setQuickResponses(JSON.parse(qrs));
        if (rems) setReminders(JSON.parse(rems));
        if (cts) setCustomTemplates(JSON.parse(cts));
      } catch {}
    };
    load();
  }, []);

  const persist = useCallback(async (key: string, value: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, []);

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
