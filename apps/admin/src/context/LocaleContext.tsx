import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, Locale } from "../locales/translations";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

type LocaleProviderProps = {
  children: ReactNode;
};

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Try to get saved locale from localStorage
    const savedLocale = localStorage.getItem("locale");
    return (savedLocale as Locale) || "id";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
};
