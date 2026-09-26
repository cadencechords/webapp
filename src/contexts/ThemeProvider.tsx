import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

export interface ThemeContextValue {
  isDark: boolean;
  /** Also saves the choice to localStorage. */
  setIsDark: (isDark: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

/** The theme context. Throws outside a `ThemeProvider`. */
export function useThemeContext(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === undefined) {
    throw new Error('useThemeContext must be used inside a ThemeProvider');
  }
  return value;
}

export default function ThemeProvider(props: { children?: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem('theme');
    return theme === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    // Browser UI color follows the surface token for the active theme.
    const surface = getComputedStyle(root)
      .getPropertyValue('--md-sys-color-surface')
      .trim();
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', surface);
  }, [isDark]);

  const handleThemeChange = useCallback(
    (newIsDarkValue: boolean) => {
      localStorage.setItem('theme', newIsDarkValue ? 'dark' : 'light');
      setIsDark(newIsDarkValue);
    },
    [setIsDark]
  );

  return (
    <ThemeContext.Provider
      {...props}
      value={{ isDark, setIsDark: handleThemeChange }}
    />
  );
}
