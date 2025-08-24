import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
   children: React.ReactNode;
   defaultTheme?: Theme;
   storageKey?: string;
};

type ThemeProviderState = {
   theme: Theme;
   setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
   theme: 'system',
   setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
   children,
   defaultTheme = 'system',
   storageKey = 'vite-ui-theme',
   ...props
}: Readonly<ThemeProviderProps>) {
   // Safe initial theme retrieval for SSR (no window/localStorage on server)
   const getInitialTheme = (): Theme => {
      if (typeof window === 'undefined') return defaultTheme;
      try {
         const stored = window.localStorage.getItem(storageKey) as Theme | null;
         return stored || defaultTheme;
      } catch {
         return defaultTheme;
      }
   };

   const [theme, setTheme] = useState<Theme>(getInitialTheme);

   useEffect(() => {
      if (typeof window === 'undefined') return; // Extra safety
      const root = window.document.documentElement;

      root.classList.remove('light', 'dark');

      if (theme === 'system') {
         const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';

         root.classList.add(systemTheme);
         return;
      }

      root.classList.add(theme);
   }, [theme]);

   const value = useMemo(
      () => ({
         theme,
         setTheme: (t: Theme) => {
            if (typeof window !== 'undefined') {
               try {
                  window.localStorage.setItem(storageKey, t);
               } catch {
                  // Ignore write errors (e.g., privacy mode)
               }
            }
            setTheme(t);
         },
      }),
      [theme, storageKey],
   );

   return (
      <ThemeProviderContext.Provider {...props} value={value}>
         {children}
      </ThemeProviderContext.Provider>
   );
}

export const useTheme = () => {
   const context = useContext(ThemeProviderContext);

   if (context === undefined)
      throw new Error('useTheme must be used within a ThemeProvider');

   return context;
};
