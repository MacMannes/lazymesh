import type { Theme, ThemeName } from './types';
import {
    opencode,
    catppuccinMocha,
    catppuccinLatte,
    catppuccinFrappe,
    catppuccinMacchiato,
} from './themes';

const themes: Record<ThemeName, Theme> = {
    'opencode': opencode,
    'catppuccin-mocha': catppuccinMocha,
    'catppuccin-latte': catppuccinLatte,
    'catppuccin-frappe': catppuccinFrappe,
    'catppuccin-macchiato': catppuccinMacchiato,
};

class ThemeManager {
    private currentTheme: Theme;
    private currentThemeName: ThemeName;

    constructor(initialTheme: ThemeName = 'catppuccin-mocha') {
        this.currentThemeName = initialTheme;
        this.currentTheme = themes[initialTheme];
    }

    getTheme(): Theme {
        return this.currentTheme;
    }

    getThemeName(): ThemeName {
        return this.currentThemeName;
    }

    setTheme(themeName: ThemeName): void {
        this.currentThemeName = themeName;
        this.currentTheme = themes[themeName];
    }

    getAvailableThemes(): ThemeName[] {
        return Object.keys(themes) as ThemeName[];
    }
}

export const themeManager = new ThemeManager('opencode');
export { themes };
