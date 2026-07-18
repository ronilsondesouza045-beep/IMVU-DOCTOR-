/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const THEME_KEY = "imvu_doctor_theme";

export type ThemeMode = "light" | "dark";

/**
 * Obtém o tema atual salvo, ou retorna o padrão do sistema (escuro por padrão para IMVU)
 */
export function getSavedTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  // IMVU possui estética tradicionalmente escura, então vamos definir "dark" como padrão se o usuário não escolheu
  return "dark";
}

/**
 * Salva e aplica o tema ao elemento raiz HTML.
 */
export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
  
  localStorage.setItem(THEME_KEY, theme);
}
