// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'quote-props': ['error', 'consistent-as-needed'],
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    eslintConfigPrettier,
);
