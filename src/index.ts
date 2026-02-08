import { createCliRenderer } from '@opentui/core';
import { MainContent } from './main-content';
import { ThemeMenu } from './theme-menu';
import { KeyboardHandler } from './keyboard-handler';

const renderer = await createCliRenderer({
    exitOnCtrlC: false,
});

// Initialize UI components
const mainContent = new MainContent(renderer);
const themeMenu = new ThemeMenu(renderer);

// Set up theme change callback
themeMenu.setOnThemeChange(() => {
    mainContent.updateTheme();
});

// Add UI to renderer
renderer.root.add(mainContent.getRootBox());
renderer.root.add(mainContent.getFooterBox());

// Set up keyboard shortcuts
new KeyboardHandler(renderer, themeMenu);
