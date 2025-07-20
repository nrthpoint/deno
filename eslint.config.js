// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ['dist/*'],
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
              message: 'Use @/ imports instead of relative imports that go up directories (e.g., @/utils/file instead of ../utils/file).',
            },
          ],
        },
      ],
      // Prevent unnecessary path segments (if import plugin is available)
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    },
  },
]);
