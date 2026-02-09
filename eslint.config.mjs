// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            'quote-props': ['error', 'consistent-as-needed'],
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
