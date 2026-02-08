# Lazymesh Theme System

This project uses a theme-based UI system with Catppuccin color schemes.

## Available Themes

- `catppuccin-mocha` (default) - Dark theme with warm purple tones
- `catppuccin-latte` - Light theme with pastel colors
- `catppuccin-frappe` - Dark theme with cool blue tones
- `catppuccin-macchiato` - Dark theme with balanced colors

## Usage

### Accessing the Current Theme

```typescript
import { themeManager } from './theme';

const theme = themeManager.getTheme();

// Use theme colors
const color = RGBA.fromHex(theme.colors.mauve);
```

### Switching Themes

```typescript
import { themeManager } from './theme';

themeManager.setTheme('catppuccin-latte'); // Switch to light theme
```

### Available Colors

Each theme includes:

**Base Colors:**
- `base`, `mantle`, `crust`

**Text Colors:**
- `text`, `subtext0`, `subtext1`

**Surface Colors:**
- `surface0`, `surface1`, `surface2`

**Overlay Colors:**
- `overlay0`, `overlay1`, `overlay2`

**Accent Colors:**
- `rosewater`, `flamingo`, `pink`, `mauve`
- `red`, `maroon`, `peach`, `yellow`
- `green`, `teal`, `sky`, `sapphire`
- `blue`, `lavender`

## Example

```typescript
import { Box, Text, RGBA } from '@opentui/core';
import { themeManager } from './theme';

const theme = themeManager.getTheme();

Box({
    backgroundColor: RGBA.fromHex(theme.colors.surface0),
    borderColor: RGBA.fromHex(theme.colors.blue),
},
    Text({
        content: 'Themed text',
        fg: RGBA.fromHex(theme.colors.text),
    })
)
```
