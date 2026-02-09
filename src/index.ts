import { createCliRenderer } from '@opentui/core';
import { MainContent } from '~/components/main-content';
import { ThemeMenu } from '~/components/theme-menu';
import { KeyboardHandler } from '~/handlers/keyboard-handler';

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
