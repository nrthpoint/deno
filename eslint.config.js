// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
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
              message:
                'Use @/ imports instead of relative imports that go up directories (e.g., @/utils/file instead of ../utils/file).',
            },
          ],
        },
      ],
      // Prevent unnecessary path segments (if import plugin is available)
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    },
  },
]);
