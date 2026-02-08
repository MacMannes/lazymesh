export interface Theme {
    name: string;
    colors: {
        // Base colors
        base: string;
        mantle: string;
        crust: string;
        
        // Text colors
        text: string;
        subtext0: string;
        subtext1: string;
        
        // Surface colors
        surface0: string;
        surface1: string;
        surface2: string;
        
        // Overlay colors
        overlay0: string;
        overlay1: string;
        overlay2: string;
        
        // Accent colors
        blue: string;
        lavender: string;
        sapphire: string;
        sky: string;
        teal: string;
        green: string;
        yellow: string;
        peach: string;
        maroon: string;
        red: string;
        mauve: string;
        pink: string;
        flamingo: string;
        rosewater: string;
    };
}

export type ThemeName = 'catppuccin-mocha' | 'catppuccin-latte' | 'catppuccin-frappe' | 'catppuccin-macchiato';
