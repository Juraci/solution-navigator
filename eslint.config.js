import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import ESLint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import ESLintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default [
  ESLint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ESLintConfigPrettier,
  ...compat.config({
    extends: ['plugin:cypress/recommended'],
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  }),
  ...compat.extends('plugin:vue/vue3-recommended'),
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': ['error'],
    },
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },
];
