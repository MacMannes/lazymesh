import {
    BoxRenderable,
    CliRenderer,
    TextRenderable,
    SelectRenderable,
    SelectRenderableEvents,
    RGBA,
} from '@opentui/core';
import { themeManager } from '~/theme';
import type { ThemeName } from '~/theme/types';

/**
 * Manages the theme selection menu
 */
export class ThemeMenu {
    private overlay!: BoxRenderable;
    private themeMenuBox!: BoxRenderable;
    private themeSelect!: SelectRenderable;
    private menuVisible = false;
    private originalTheme!: ThemeName; // Store theme before opening menu
    private onThemeChange?: () => void;

    constructor(private renderer: CliRenderer) {
        this.createMenu();
    }

    private createMenu() {
        const theme = themeManager.getTheme();
        const themes = themeManager.getAvailableThemes();

        // Create centered overlay container
        this.overlay = new BoxRenderable(this.renderer, {
            id: 'theme-menu-overlay',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
        });

        // Create menu container (centered by parent flexbox)
        this.themeMenuBox = new BoxRenderable(this.renderer, {
            id: 'theme-menu',
            width: 40,
            height: 14,
            backgroundColor: RGBA.fromHex(theme.colors.surface),
            border: true,
            borderStyle: 'rounded',
            borderColor: RGBA.fromHex(theme.colors.accent),
            padding: 0,
            paddingLeft: 1,
            paddingRight: 1,
            paddingTop: 1,
            paddingBottom: 0,
        });

        // Create title
        const titleText = new TextRenderable(this.renderer, {
            id: 'menu-title',
            content: '  Select Theme',
            fg: RGBA.fromHex(theme.colors.accent),
        });

        // Create select component
        const currentThemeName = themeManager.getThemeName();
        const currentIndex = themes.findIndex(
            (t: ThemeName) => t === currentThemeName,
        );
        this.themeSelect = new SelectRenderable(this.renderer, {
            id: 'theme-select',
            width: 36,
            height: 9,
            marginTop: 1,
            options: themes.map((themeName: ThemeName) => {
                const isCurrent = themeName === currentThemeName;
                return {
                    name: isCurrent ? `${themeName} (current)` : themeName,
                    description: '',
                    value: themeName,
                };
            }),
            selectedIndex: currentIndex >= 0 ? currentIndex : 0,
            backgroundColor: RGBA.fromHex(theme.colors.surface),
            textColor: RGBA.fromHex(theme.colors.text),
            focusedBackgroundColor: RGBA.fromHex(theme.colors.surface),
            focusedTextColor: RGBA.fromHex(theme.colors.text),
            selectedBackgroundColor: RGBA.fromHex(theme.colors.accent),
            selectedTextColor: RGBA.fromHex(theme.colors.background),
            descriptionColor: RGBA.fromHex(theme.colors.textMuted),
            selectedDescriptionColor: RGBA.fromHex(theme.colors.background),
            showScrollIndicator: true,
            showDescription: false, // Hide description line
        });

        // Handle theme preview on navigation (up/down arrows or j/k)
        this.themeSelect.on(
            SelectRenderableEvents.SELECTION_CHANGED,
            (_index: number, option: any) => {
                // Live preview: apply theme as user navigates
                themeManager.setTheme(option.value);
                this.updateMenu();
                this.onThemeChange?.();
            },
        );

        // Handle final theme selection (Enter key)
        this.themeSelect.on(
            SelectRenderableEvents.ITEM_SELECTED,
            (_index: number, option: any) => {
                // This will be the final selection to save to config
                themeManager.setTheme(option.value);
                // Update originalTheme since this is now the "saved" theme
                this.originalTheme = option.value;
                this.updateMenu();
                this.onThemeChange?.();
                this.hide();
            },
        );

        this.themeMenuBox.add(titleText);
        this.themeMenuBox.add(this.themeSelect);

        // Add menu to overlay
        this.overlay.add(this.themeMenuBox);
    }

    /**
     * Updates the menu to reflect the current theme
     */
    updateMenu() {
        const theme = themeManager.getTheme();
        const themes = themeManager.getAvailableThemes();

        // Update menu box colors
        this.themeMenuBox.backgroundColor = RGBA.fromHex(theme.colors.surface);
        this.themeMenuBox.borderColor = RGBA.fromHex(theme.colors.accent);

        // Update title
        const titleText = this.themeMenuBox.getRenderable(
            'menu-title',
        ) as TextRenderable;
        if (titleText) {
            titleText.fg = RGBA.fromHex(theme.colors.accent);
        }

        // Update select colors
        this.themeSelect.backgroundColor = RGBA.fromHex(theme.colors.surface);
        this.themeSelect.textColor = RGBA.fromHex(theme.colors.text);
        this.themeSelect.focusedBackgroundColor = RGBA.fromHex(
            theme.colors.surface,
        );
        this.themeSelect.focusedTextColor = RGBA.fromHex(theme.colors.text);
        this.themeSelect.descriptionColor = RGBA.fromHex(
            theme.colors.textMuted,
        );
        this.themeSelect.selectedBackgroundColor = RGBA.fromHex(
            theme.colors.accent,
        );
        this.themeSelect.selectedTextColor = RGBA.fromHex(
            theme.colors.background,
        );
        this.themeSelect.selectedDescriptionColor = RGBA.fromHex(
            theme.colors.background,
        );

        // Update options - use originalTheme for "(current)" indicator
        this.themeSelect.options = themes.map((themeName: ThemeName) => {
            const displayName = themeName
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            // Show "(current)" for the saved/original theme, not the preview
            const isCurrent = themeName === this.originalTheme;
            return {
                name: isCurrent ? `${displayName} (current)` : displayName,
                description: '',
                value: themeName,
            };
        });
    }

    /**
     * Shows the theme menu
     */
    show() {
        if (!this.menuVisible) {
            // Store current theme so we can restore it if user presses Escape
            this.originalTheme = themeManager.getThemeName();
            this.renderer.root.add(this.overlay);
            this.themeSelect.focus();
            this.menuVisible = true;
            this.renderer.requestRender();
        }
    }

    /**
     * Hides the theme menu
     * @param restoreOriginal - If true, restore the original theme before closing
     */
    hide(restoreOriginal = false) {
        if (this.menuVisible) {
            // If cancelled (Escape), restore original theme
            if (restoreOriginal && this.originalTheme) {
                themeManager.setTheme(this.originalTheme);
                this.updateMenu();
                this.onThemeChange?.();
            }
            this.renderer.root.remove('theme-menu-overlay');
            this.themeSelect.blur();
            this.menuVisible = false;
            this.renderer.requestRender();
        }
    }

    /**
     * Toggles the theme menu visibility
     */
    toggle() {
        if (this.menuVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Returns true if the menu is currently visible
     */
    isVisible(): boolean {
        return this.menuVisible;
    }

    /**
     * Set a callback to be called when the theme changes
     */
    setOnThemeChange(callback: () => void) {
        this.onThemeChange = callback;
    }
}
