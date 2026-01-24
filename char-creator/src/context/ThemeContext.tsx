import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ColorMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  isDarkMode: boolean;
  themeColors: {
    primary: string;
    accent: string;
    background: string;
    headerGradient: string;
  };
}

// Cosmic theme - single unified design
const COSMIC_THEME = {
  light: {
    background: 'bg-gradient-to-br from-slate-50 to-blue-50',
    headerGradient: 'bg-gradient-to-r from-blue-100 via-cyan-50 to-blue-100',
  },
  dark: {
    background: 'bg-gradient-to-br from-navy-deep to-navy-mid',
    headerGradient: 'bg-gradient-to-r from-navy-deep via-navy-mid to-navy-deep',
  },
};

const THEME_COLORS = {
  primary: 'navy',
  accent: 'cyan',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or default to 'dark' (cosmic theme works best in dark mode)
  const [mode, setModeState] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('shimmering-reach-mode');
    return (saved as ColorMode) || 'dark';
  });

  // System preference detection
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute if dark mode is active
  const isDarkMode = mode === 'dark' || (mode === 'system' && systemPrefersDark);

  // Apply dark class to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist mode changes
  const setMode = (newMode: ColorMode) => {
    setModeState(newMode);
    localStorage.setItem('shimmering-reach-mode', newMode);
  };

  // Compute theme colors based on mode
  const backgrounds = isDarkMode ? COSMIC_THEME.dark : COSMIC_THEME.light;

  const themeColors = {
    primary: THEME_COLORS.primary,
    accent: THEME_COLORS.accent,
    background: backgrounds.background,
    headerGradient: backgrounds.headerGradient,
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        isDarkMode,
        themeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
