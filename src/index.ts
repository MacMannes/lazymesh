import {
    ASCIIFontRenderable,
    BoxRenderable,
    createCliRenderer,
    TextRenderable,
    SelectRenderable,
    SelectRenderableEvents,
    RGBA,
} from '@opentui/core';
import { themeManager } from './theme';
import type { ThemeName } from './theme/types';

const renderer = await createCliRenderer({
    exitOnCtrlC: false,
});

// Store references to UI elements for theme updates
let rootBox: BoxRenderable;
let contentBox: BoxRenderable;
let asciiFont: ASCIIFontRenderable;
let subtitleText: TextRenderable;
let themeText: TextRenderable;
let footerBox: BoxRenderable;
let shortcutText: TextRenderable;
let themeMenuBox: BoxRenderable;
let themeSelect: SelectRenderable;
let menuVisible = false;
let originalTheme: ThemeName; // Store theme before opening menu

function createUI() {
    const theme = themeManager.getTheme();

    // Create root container
    rootBox = new BoxRenderable(renderer, {
        id: 'root',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: RGBA.fromHex(theme.colors.background),
    });

    // Create content box
    contentBox = new BoxRenderable(renderer, {
        id: 'content',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 1,
        padding: 2,
        backgroundColor: RGBA.fromHex(theme.colors.surface),
        border: true,
        borderStyle: 'rounded',
        borderColor: RGBA.fromHex(theme.colors.accent),
    });

    // Create ASCII font
    asciiFont = new ASCIIFontRenderable(renderer, {
        id: 'logo',
        font: 'block',
        text: 'lazymesh',
        color: RGBA.fromHex(theme.colors.accent),
    });

    // Create subtitle
    subtitleText = new TextRenderable(renderer, {
        id: 'subtitle',
        content: 'A simple terminal UI for MeshCore',
        fg: RGBA.fromHex(theme.colors.textMuted),
    });

    // Create theme info container
    const themeInfoBox = new BoxRenderable(renderer, {
        id: 'theme-info',
        marginTop: 1,
        gap: 1,
    });

    // Create theme text
    themeText = new TextRenderable(renderer, {
        id: 'theme-name',
        content: `Theme: ${theme.name}`,
        fg: RGBA.fromHex(theme.colors.success),
    });

    // Assemble content box
    themeInfoBox.add(themeText);
    contentBox.add(asciiFont);
    contentBox.add(subtitleText);
    contentBox.add(themeInfoBox);
    rootBox.add(contentBox);

    // Create footer with keyboard shortcuts
    footerBox = new BoxRenderable(renderer, {
        id: 'footer',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: RGBA.fromHex(theme.colors.backgroundAlt),
        paddingLeft: 1,
        paddingRight: 1,
    });

    shortcutText = new TextRenderable(renderer, {
        id: 'shortcuts',
        content: 'ctrl+p: Theme Menu | ctrl+c: Exit',
        fg: RGBA.fromHex(theme.colors.textSubtle),
    });

    footerBox.add(shortcutText);

    return { rootBox, footerBox };
}

function createThemeMenu() {
    const theme = themeManager.getTheme();
    const themes = themeManager.getAvailableThemes();

    // Create menu container
    themeMenuBox = new BoxRenderable(renderer, {
        id: 'theme-menu',
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 40,
        height: 14,
        marginLeft: -20, // Center horizontally
        marginTop: -7, // Center vertically
        backgroundColor: RGBA.fromHex(theme.colors.surface),
        border: true,
        borderStyle: 'rounded',
        borderColor: RGBA.fromHex(theme.colors.accent),
        padding: 0,
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
        paddingBottom: 0,
        zIndex: 100,
    });

    // Create title
    const titleText = new TextRenderable(renderer, {
        id: 'menu-title',
        content: '  Select Theme',
        fg: RGBA.fromHex(theme.colors.accent),
    });

    // Create select component
    const currentThemeName = themeManager.getThemeName();
    const currentIndex = themes.findIndex((t: ThemeName) => t === currentThemeName);
    themeSelect = new SelectRenderable(renderer, {
        id: 'theme-select',
        width: 36,
        height: 9,
        marginTop: 1,
        options: themes.map((themeName: ThemeName) => {
            const displayName = themeName
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            const isCurrent = themeName === currentThemeName;
            return {
                name: isCurrent ? `${displayName} (current)` : displayName,
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
        showDescription: false,  // Hide description line
    });

    // Handle theme preview on navigation (up/down arrows or j/k)
    themeSelect.on(
        SelectRenderableEvents.SELECTION_CHANGED,
        (_index: number, option: any) => {
            // Live preview: apply theme as user navigates
            themeManager.setTheme(option.value);
            updateTheme();
            updateThemeMenu();
        },
    );

    // Handle final theme selection (Enter key)
    themeSelect.on(
        SelectRenderableEvents.ITEM_SELECTED,
        (_index: number, option: any) => {
            // This will be the final selection to save to config
            themeManager.setTheme(option.value);
            // Update originalTheme since this is now the "saved" theme
            originalTheme = option.value;
            updateTheme();
            updateThemeMenu();
            hideThemeMenu();
        },
    );

    themeMenuBox.add(titleText);
    themeMenuBox.add(themeSelect);
}

function updateThemeMenu() {
    const theme = themeManager.getTheme();
    const themes = themeManager.getAvailableThemes();
    
    // Update menu box colors
    themeMenuBox.backgroundColor = RGBA.fromHex(theme.colors.surface);
    themeMenuBox.borderColor = RGBA.fromHex(theme.colors.accent);
    
    // Update title
    const titleText = themeMenuBox.getRenderable('menu-title') as TextRenderable;
    if (titleText) {
        titleText.fg = RGBA.fromHex(theme.colors.accent);
    }
    
    // Update select colors
    themeSelect.backgroundColor = RGBA.fromHex(theme.colors.surface);
    themeSelect.textColor = RGBA.fromHex(theme.colors.text);
    themeSelect.focusedBackgroundColor = RGBA.fromHex(theme.colors.surface);
    themeSelect.focusedTextColor = RGBA.fromHex(theme.colors.text);
    themeSelect.descriptionColor = RGBA.fromHex(theme.colors.textMuted);
    themeSelect.selectedBackgroundColor = RGBA.fromHex(theme.colors.accent);
    themeSelect.selectedTextColor = RGBA.fromHex(theme.colors.background);
    themeSelect.selectedDescriptionColor = RGBA.fromHex(theme.colors.background);
    
    // Update options - use originalTheme for "(current)" indicator
    themeSelect.options = themes.map((themeName: ThemeName) => {
        const displayName = themeName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        // Show "(current)" for the saved/original theme, not the preview
        const isCurrent = themeName === originalTheme;
        return {
            name: isCurrent ? `${displayName} (current)` : displayName,
            description: '',
            value: themeName,
        };
    });
}

function showThemeMenu() {
    if (!menuVisible) {
        // Store current theme so we can restore it if user presses Escape
        originalTheme = themeManager.getThemeName();
        renderer.root.add(themeMenuBox);
        themeSelect.focus();
        menuVisible = true;
        renderer.requestRender();
    }
}

function hideThemeMenu(restoreOriginal = false) {
    if (menuVisible) {
        // If cancelled (Escape), restore original theme
        if (restoreOriginal && originalTheme) {
            themeManager.setTheme(originalTheme);
            updateTheme();
            updateThemeMenu();
        }
        renderer.root.remove('theme-menu');
        themeSelect.blur();
        menuVisible = false;
        renderer.requestRender();
    }
}

function updateTheme() {
    const theme = themeManager.getTheme();

    // Update root box background
    rootBox.backgroundColor = RGBA.fromHex(theme.colors.background);

    // Update content box
    contentBox.backgroundColor = RGBA.fromHex(theme.colors.surface);
    contentBox.borderColor = RGBA.fromHex(theme.colors.accent);

    // Update ASCII font color
    asciiFont.color = RGBA.fromHex(theme.colors.accent);

    // Update subtitle text
    subtitleText.fg = RGBA.fromHex(theme.colors.textMuted);

    // Update theme name text
    themeText.content = `Theme: ${theme.name}`;
    themeText.fg = RGBA.fromHex(theme.colors.success);

    // Update footer
    footerBox.backgroundColor = RGBA.fromHex(theme.colors.backgroundAlt);
    shortcutText.fg = RGBA.fromHex(theme.colors.textSubtle);

    // Request a re-render
    renderer.requestRender();
}

// Initialize UI
const { rootBox: root, footerBox: footer } = createUI();
renderer.root.add(root);
renderer.root.add(footer);

// Create theme menu
createThemeMenu();

// Set up keyboard shortcut handler
renderer.keyInput.on('keypress', (key) => {
    // Handle ctrl+c to exit
    if (key.ctrl && key.name === 'c') {
        renderer.destroy();
        process.exit(0);
    }

    // Handle ctrl+p to toggle theme menu
    if (key.ctrl && key.name === 'p') {
        if (menuVisible) {
            hideThemeMenu();
        } else {
            showThemeMenu();
        }
    }

    // Handle escape to close menu (restore original theme)
    if (menuVisible && key.name === 'escape') {
        hideThemeMenu(true); // true = restore original theme
    }
});
