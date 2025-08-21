const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', '*env.d.ts'],
  },
  {
    rules: {
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
