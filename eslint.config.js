import ESLint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import ESLintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import pluginCypress from 'eslint-plugin-cypress';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  ESLint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ...pluginCypress.configs.recommended,
    rules: {
      ...pluginCypress.configs.recommended.rules,
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
  ESLintConfigPrettier,
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
