import {
    ASCIIFont,
    Box,
    createCliRenderer,
    Text,
    TextAttributes,
} from '@opentui/core';

const renderer = await createCliRenderer({ exitOnCtrlC: true });

renderer.root.add(
    Box(
        { alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
        Box(
            { justifyContent: 'center', alignItems: 'flex-end' },
            ASCIIFont({ font: 'tiny', text: 'lazymesh' }),
            Text({
                content: 'A simple terminal UI for MeshCore',
                attributes: TextAttributes.DIM,
            }),
        ),
    ),
);
