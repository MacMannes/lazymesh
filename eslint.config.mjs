// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import noRelativeImportPaths from './.eslint-plugins/no-relative-import-paths.js';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        plugins: {
            prettier,
            // @ts-expect-error - Local plugin has type incompatibility but works correctly
            'no-relative-import-paths': noRelativeImportPaths,
        },
        rules: {
            'prettier/prettier': 'error',
            'quote-props': ['error', 'consistent-as-needed'],
            '@typescript-eslint/no-explicit-any': 'off',
            'no-relative-import-paths/no-relative-import-paths': [
                'error',
                { allowSameFolder: true, rootDir: 'src', prefix: '~' },
            ],
        },
    },
    eslintConfigPrettier,
);
