export interface Theme {
    name: string;
    colors: {
        // Backgrounds
        background: string;           // Main background
        backgroundAlt: string;        // Alternative background (darker/lighter)
        surface: string;              // Surface elements (cards, panels)
        surfaceAlt: string;           // Alternate surface (hover states)
        
        // Borders
        border: string;               // Default borders
        borderFocused: string;        // Focused element borders
        
        // Text
        text: string;                 // Primary text
        textMuted: string;            // Secondary/muted text
        textSubtle: string;           // Tertiary/subtle text
        
        // Interactive states
        accent: string;               // Primary accent (titles, highlights, selections)
        accentAlt: string;            // Alternative accent
        hover: string;                // Hover states
        
        // Semantic colors
        success: string;              // Success states
        warning: string;              // Warning states
        error: string;                // Error states
        info: string;                 // Info states
    };
}

export type ThemeName = 'opencode' | 'catppuccin-mocha' | 'catppuccin-latte' | 'catppuccin-frappe' | 'catppuccin-macchiato';
