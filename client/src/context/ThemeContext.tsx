import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants/api';
import { useAppStore } from '../store/appStore';
import { getStorageString, setStorageString } from '../utils/storage';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme, toggleTheme } = useAppStore();

  useEffect(() => {
    const stored = getStorageString(STORAGE_KEYS.theme) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
  }, [setTheme]);

  useEffect(() => {
    setStorageString(STORAGE_KEYS.theme, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
