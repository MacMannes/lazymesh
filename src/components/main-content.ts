import {
    ASCIIFontRenderable,
    BoxRenderable,
    CliRenderer,
    TextRenderable,
    RGBA,
    t,
    fg,
    bold,
} from '@opentui/core';
import { themeManager } from '~/theme';

/**
 * Manages the main content area with logo, subtitle, and theme info
 */
export class MainContent {
    private rootBox!: BoxRenderable;
    private contentBox!: BoxRenderable;
    private asciiFont!: ASCIIFontRenderable;
    private subtitleText!: TextRenderable;
    private themeText!: TextRenderable;
    private footerBox!: BoxRenderable;
    private shortcutText!: TextRenderable;

    constructor(private renderer: CliRenderer) {
        this.createUI();
    }

    private createUI() {
        const theme = themeManager.getTheme();

        // Create root container
        this.rootBox = new BoxRenderable(this.renderer, {
            id: 'root',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            backgroundColor: RGBA.fromHex(theme.colors.background),
        });

        // Create content box
        this.contentBox = new BoxRenderable(this.renderer, {
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
        this.asciiFont = new ASCIIFontRenderable(this.renderer, {
            id: 'logo',
            font: 'block',
            text: 'lazymesh',
            color: RGBA.fromHex(theme.colors.accent),
        });

        // Create subtitle
        this.subtitleText = new TextRenderable(this.renderer, {
            id: 'subtitle',
            content: 'A simple terminal UI for MeshCore',
            fg: RGBA.fromHex(theme.colors.textMuted),
        });

        // Create theme info container
        const themeInfoBox = new BoxRenderable(this.renderer, {
            id: 'theme-info',
            marginTop: 1,
            gap: 1,
        });

        // Create theme text
        this.themeText = new TextRenderable(this.renderer, {
            id: 'theme-name',
            content: `Theme: ${theme.name}`,
            fg: RGBA.fromHex(theme.colors.success),
        });

        // Assemble content box
        themeInfoBox.add(this.themeText);
        this.contentBox.add(this.asciiFont);
        this.contentBox.add(this.subtitleText);
        this.contentBox.add(themeInfoBox);
        this.rootBox.add(this.contentBox);

        // Create footer with keyboard shortcuts
        this.footerBox = new BoxRenderable(this.renderer, {
            id: 'footer',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: RGBA.fromHex(theme.colors.background),
            paddingLeft: 1,
            paddingRight: 1,
        });

        this.shortcutText = new TextRenderable(this.renderer, {
            id: 'shortcuts',
            content: t`${bold(fg(theme.colors.accent)('ctrl+p'))}: Theme Menu | ${bold(fg(theme.colors.accent)('ctrl+c'))}: Exit`,
            fg: RGBA.fromHex(theme.colors.text),
        });

        this.footerBox.add(this.shortcutText);
    }

    /**
     * Updates all UI elements to match the current theme
     */
    updateTheme() {
        const theme = themeManager.getTheme();

        // Update root box background
        this.rootBox.backgroundColor = RGBA.fromHex(theme.colors.background);

        // Update content box
        this.contentBox.backgroundColor = RGBA.fromHex(theme.colors.surface);
        this.contentBox.borderColor = RGBA.fromHex(theme.colors.accent);

        // Update ASCII font color
        this.asciiFont.color = RGBA.fromHex(theme.colors.accent);

        // Update subtitle text
        this.subtitleText.fg = RGBA.fromHex(theme.colors.textMuted);

        // Update theme name text
        this.themeText.content = `Theme: ${theme.name}`;
        this.themeText.fg = RGBA.fromHex(theme.colors.success);

        // Update footer
        this.footerBox.backgroundColor = RGBA.fromHex(theme.colors.background);
        this.shortcutText.fg = RGBA.fromHex(theme.colors.text);
        this.shortcutText.content = t`${bold(fg(theme.colors.accent)('ctrl+p'))}: Theme Menu | ${bold(fg(theme.colors.accent)('ctrl+c'))}: Exit`;

        // Request a re-render
        this.renderer.requestRender();
    }

    getRootBox(): BoxRenderable {
        return this.rootBox;
    }

    getFooterBox(): BoxRenderable {
        return this.footerBox;
    }
}
