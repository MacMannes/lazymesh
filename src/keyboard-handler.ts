import { CliRenderer } from '@opentui/core';
import type { ThemeMenu } from './theme-menu';

/**
 * Handles keyboard shortcuts for the application
 */
export class KeyboardHandler {
    constructor(
        private renderer: CliRenderer,
        private themeMenu: ThemeMenu,
    ) {
        this.setupKeyboardListeners();
    }

    private setupKeyboardListeners() {
        this.renderer.keyInput.on('keypress', (key) => {
            // Handle ctrl+c to exit
            if (key.ctrl && key.name === 'c') {
                this.renderer.destroy();
                process.exit(0);
            }

            // Handle ctrl+p to toggle theme menu
            if (key.ctrl && key.name === 'p') {
                this.themeMenu.toggle();
            }

            // Handle escape to close menu (restore original theme)
            if (this.themeMenu.isVisible() && key.name === 'escape') {
                this.themeMenu.hide(true); // true = restore original theme
            }
        });
    }
}
