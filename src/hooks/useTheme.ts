import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

/**
 * Gestiona el estado del tema (claro/oscuro) y sincroniza la clase `dark`
 * en el elemento raíz del documento para que Tailwind aplique los estilos
 * correspondientes.
 */
export function useTheme(initialTheme: Theme = 'dark') {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    window.document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, isDark: theme === 'dark', setTheme, toggleTheme };
}
