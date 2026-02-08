import type { Theme, ThemeName } from './types';
import {
    catppuccinMocha,
    catppuccinLatte,
    catppuccinFrappe,
    catppuccinMacchiato,
} from './themes';

const themes: Record<ThemeName, Theme> = {
    'catppuccin-mocha': catppuccinMocha,
    'catppuccin-latte': catppuccinLatte,
    'catppuccin-frappe': catppuccinFrappe,
    'catppuccin-macchiato': catppuccinMacchiato,
};

class ThemeManager {
    private currentTheme: Theme;

    constructor(initialTheme: ThemeName = 'catppuccin-mocha') {
        this.currentTheme = themes[initialTheme];
    }

    getTheme(): Theme {
        return this.currentTheme;
    }

    setTheme(themeName: ThemeName): void {
        this.currentTheme = themes[themeName];
    }

    getAvailableThemes(): ThemeName[] {
        return Object.keys(themes) as ThemeName[];
    }
}

export const themeManager = new ThemeManager('catppuccin-mocha');
export { themes };
