/**
 * Simple Dark Mode Toggle Utility
 * No Context API needed - just localStorage + CSS class
 */

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'turbocar-theme';

export const getTheme = (): ThemeMode => {
	if (typeof window === 'undefined') return 'light';
	
	const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
	if (saved) return saved;
	
	// Check system preference
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	
	return 'light';
};

export const setTheme = (mode: ThemeMode): void => {
	if (typeof window === 'undefined') return;
	
	localStorage.setItem(THEME_STORAGE_KEY, mode);
	document.documentElement.classList.toggle('dark', mode === 'dark');
	document.documentElement.setAttribute('data-theme', mode);
};

export const toggleTheme = (): ThemeMode => {
	const current = getTheme();
	const newMode = current === 'light' ? 'dark' : 'light';
	setTheme(newMode);
	
	// Dispatch custom event for theme change
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event('themechange'));
	}
	
	return newMode;
};

// Initialize theme on load
if (typeof window !== 'undefined') {
	const theme = getTheme();
	setTheme(theme);
}

