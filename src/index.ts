import {
    ASCIIFont,
    Box,
    createCliRenderer,
    Text,
    RGBA,
} from '@opentui/core';
import { themeManager } from './theme';

const renderer = await createCliRenderer({ exitOnCtrlC: true });
const theme = themeManager.getTheme();

renderer.root.add(
    Box(
        {
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            backgroundColor: RGBA.fromHex(theme.colors.base),
        },
        Box(
            {
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 1,
                padding: 2,
                backgroundColor: RGBA.fromHex(theme.colors.surface0),
                border: true,
                borderStyle: 'rounded',
                borderColor: RGBA.fromHex(theme.colors.mauve),
            },
            ASCIIFont({
                font: 'tiny',
                text: 'lazymesh',
                color: RGBA.fromHex(theme.colors.mauve),
            }),
            Text({
                content: 'A simple terminal UI for MeshCore',
                fg: RGBA.fromHex(theme.colors.subtext0),
            }),
            Box(
                {
                    marginTop: 1,
                    gap: 1,
                },
                Text({
                    content: `Theme: ${theme.name}`,
                    fg: RGBA.fromHex(theme.colors.green),
                }),
            ),
        ),
    ),
);
