import { useThemeContext } from '../contexts/ThemeProvider';

export default function useTheme() {
  const { isDark, setIsDark } = useThemeContext();

  return { isDark, setIsDark };
}
