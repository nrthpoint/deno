const eslintTypescript = require('@typescript-eslint/eslint-plugin');
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', '*env.d.ts', '.vscode/exponentIndex.js'],
  },
  {
    plugins: {
      'react-native': reactNativePlugin,
      '@typescript-eslint': eslintTypescript,
    },
  },
  {
    rules: {
      'no-unused-vars': [
        'off',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^(_)',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'react-native/no-unused-styles': 'error',

      // Enforce using @/ imports instead of relative imports that go up directories
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../**/*'],
              message:
                'Use @/ imports instead of relative imports that go up directories (e.g., @/utils/file instead of ../utils/file).',
            },
          ],
        },
      ],

      // Prevent unnecessary path segments
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

      // Enforce import order
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js builtins
            'external', // npm packages
            'internal', // @/ aliases
            'parent', // ../foo
            'sibling', // ./foo
            'index', // ./ or ./index
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // 'array-bracket-spacing': ['error', 'always'],
    },
  },
]);
