const themeKey = 'study-web-theme';
const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');

let themePreference = 'system';
try {
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === 'light' || savedTheme === 'dark') themePreference = savedTheme;
} catch {
  // A blocked preference store should not prevent the app from following the device theme.
}

function applyInitialTheme() {
  const theme = themePreference === 'system'
    ? (systemTheme?.matches ? 'dark' : 'light')
    : themePreference;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#151a22' : '#f6f7f9');
}

applyInitialTheme();
