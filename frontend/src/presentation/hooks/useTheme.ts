import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  return (localStorage.getItem('wp-theme') as Theme) ?? 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : '';
  localStorage.setItem('wp-theme', theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      applyTheme(next); // apply immediately, before re-render
      return next;
    });

  return { theme, toggleTheme };
}
