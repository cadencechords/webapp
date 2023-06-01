import React, { createContext, useCallback, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export default function ThemeProvider(props) {
  const [isDark, setIsDark] = useState(() => {
    const theme = localStorage.getItem('theme');
    return theme === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.querySelector('html').className += ' dark';
      document.querySelector(':root').style.setProperty('--rsbs-bg', '#0d1117');
      document
        .querySelector(':root')
        .style.setProperty('--rsbs-handle-bg', '#8b949e');
    } else {
      document.querySelector('html').classList.remove('dark');
      document
        .querySelector(':root')
        .style.setProperty('--rsbs-handle-bg', 'hsla(0, 0%, 0%, 0.14)');
      document.querySelector(':root').style.setProperty('--rsbs-bg', '#ffffff');
    }
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
