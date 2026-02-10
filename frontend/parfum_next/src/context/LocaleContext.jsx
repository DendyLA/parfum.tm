'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const pathname = usePathname();

  const getLocaleFromPath = () => {
    const segment = pathname.split("/")[1];
    return segment === "tk" ? "tk" : "ru";
  };

  const [locale, setLocale] = useState(getLocaleFromPath);

  // если URL меняется → обновляем язык
  useEffect(() => {
    setLocale(getLocaleFromPath());
  }, [pathname]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
