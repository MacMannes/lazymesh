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

function createUI() {
    const theme = themeManager.getTheme();

    // Create root container
    rootBox = new BoxRenderable(renderer, {
        id: 'root',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: RGBA.fromHex(theme.colors.base),
    });

    // Create content box
    contentBox = new BoxRenderable(renderer, {
        id: 'content',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 1,
        padding: 2,
        backgroundColor: RGBA.fromHex(theme.colors.surface0),
        border: true,
        borderStyle: 'rounded',
        borderColor: RGBA.fromHex(theme.colors.mauve),
    });

    // Create ASCII font
    asciiFont = new ASCIIFontRenderable(renderer, {
        id: 'logo',
        font: 'block',
        text: 'lazymesh',
        color: RGBA.fromHex(theme.colors.mauve),
    });

    // Create subtitle
    subtitleText = new TextRenderable(renderer, {
        id: 'subtitle',
        content: 'A simple terminal UI for MeshCore',
        fg: RGBA.fromHex(theme.colors.subtext0),
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
        fg: RGBA.fromHex(theme.colors.green),
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
        backgroundColor: RGBA.fromHex(theme.colors.mantle),
        paddingLeft: 1,
        paddingRight: 1,
    });

    shortcutText = new TextRenderable(renderer, {
        id: 'shortcuts',
        content: 'ctrl+p: Theme Menu | ctrl+c: Exit',
        fg: RGBA.fromHex(theme.colors.overlay0),
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
        backgroundColor: RGBA.fromHex(theme.colors.surface0),
        border: true,
        borderStyle: 'rounded',
        borderColor: RGBA.fromHex(theme.colors.mauve),
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
        fg: RGBA.fromHex(theme.colors.mauve),
    });

    // Create select component
    const currentIndex = themes.findIndex((t: ThemeName) => t === theme.name);
    themeSelect = new SelectRenderable(renderer, {
        id: 'theme-select',
        width: 36,
        height: 9,
        marginTop: 1,
        options: themes.map((themeName: ThemeName) => ({
            name: themeName
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
            description: themeName === theme.name ? '(current)' : '',
            value: themeName,
        })),
        selectedIndex: currentIndex >= 0 ? currentIndex : 0,
        backgroundColor: RGBA.fromHex(theme.colors.surface0),
        textColor: RGBA.fromHex(theme.colors.text),
        focusedBackgroundColor: RGBA.fromHex(theme.colors.surface0),
        focusedTextColor: RGBA.fromHex(theme.colors.text),
        selectedBackgroundColor: RGBA.fromHex(theme.colors.mauve),
        selectedTextColor: RGBA.fromHex(theme.colors.base),
        descriptionColor: RGBA.fromHex(theme.colors.overlay1),
        selectedDescriptionColor: RGBA.fromHex(theme.colors.base),
        showScrollIndicator: true,
    });

    // Handle theme selection
    themeSelect.on(
        SelectRenderableEvents.ITEM_SELECTED,
        (_index: number, option: any) => {
            themeManager.setTheme(option.value);
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
    themeMenuBox.backgroundColor = RGBA.fromHex(theme.colors.surface0);
    themeMenuBox.borderColor = RGBA.fromHex(theme.colors.mauve);
    
    // Update title
    const titleText = themeMenuBox.getRenderable('menu-title') as TextRenderable;
    if (titleText) {
        titleText.fg = RGBA.fromHex(theme.colors.mauve);
    }
    
    // Update select colors
    const currentIndex = themes.findIndex((t: ThemeName) => t === theme.name);
    themeSelect.backgroundColor = RGBA.fromHex(theme.colors.surface0);
    themeSelect.textColor = RGBA.fromHex(theme.colors.text);
    themeSelect.focusedBackgroundColor = RGBA.fromHex(theme.colors.surface0);
    themeSelect.focusedTextColor = RGBA.fromHex(theme.colors.text);
    themeSelect.descriptionColor = RGBA.fromHex(theme.colors.overlay1);
    themeSelect.selectedBackgroundColor = RGBA.fromHex(theme.colors.mauve);
    themeSelect.selectedTextColor = RGBA.fromHex(theme.colors.base);
    themeSelect.selectedDescriptionColor = RGBA.fromHex(theme.colors.base);
    
    // Update options to reflect current theme
    themeSelect.options = themes.map((themeName: ThemeName) => ({
        name: themeName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: themeName === theme.name ? '(current)' : '',
        value: themeName,
    }));
    themeSelect.selectedIndex = currentIndex >= 0 ? currentIndex : 0;
}

function showThemeMenu() {
    if (!menuVisible) {
        renderer.root.add(themeMenuBox);
        themeSelect.focus();
        menuVisible = true;
        renderer.requestRender();
    }
}

function hideThemeMenu() {
    if (menuVisible) {
        renderer.root.remove('theme-menu');
        themeSelect.blur();
        menuVisible = false;
        renderer.requestRender();
    }
}

function updateTheme() {
    const theme = themeManager.getTheme();

    // Update root box background
    rootBox.backgroundColor = RGBA.fromHex(theme.colors.base);

    // Update content box
    contentBox.backgroundColor = RGBA.fromHex(theme.colors.surface0);
    contentBox.borderColor = RGBA.fromHex(theme.colors.mauve);

    // Update ASCII font color
    asciiFont.color = RGBA.fromHex(theme.colors.mauve);

    // Update subtitle text
    subtitleText.fg = RGBA.fromHex(theme.colors.subtext0);

    // Update theme name text
    themeText.content = `Theme: ${theme.name}`;
    themeText.fg = RGBA.fromHex(theme.colors.green);

    // Update footer
    footerBox.backgroundColor = RGBA.fromHex(theme.colors.mantle);
    shortcutText.fg = RGBA.fromHex(theme.colors.overlay0);

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

    // Handle escape to close menu
    if (menuVisible && key.name === 'escape') {
        hideThemeMenu();
    }
});
