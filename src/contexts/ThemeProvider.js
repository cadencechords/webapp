import React, { createContext, useCallback, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export default function ThemeProvider(props) {
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem('theme');
    return theme === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    // Browser UI color follows the surface token for the active theme.
    const surface = getComputedStyle(root).getPropertyValue('--md-sys-color-surface').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', surface);
  }, [isDark]);

  const handleThemeChange = useCallback(
    newIsDarkValue => {
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
