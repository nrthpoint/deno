# AGENTS.md - Coding Guidelines for Deno React Native App

## Build/Test Commands

- `pnpm test` - Run all Jest tests (utils/ directory only)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test -- path/to/file.test.ts` - Run single test file
- `pnpm lint` - Run ESLint checks
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm format` - Format code with Prettier

## Code Style & Conventions

- Use `@/` imports instead of relative imports that go up directories (`@/utils/file` not `../utils/file`)
- Import order: builtin → external → internal (@/) → parent → sibling, alphabetized with spacing
- TypeScript strict mode enabled - include proper types for all functions and exports
- React Native components use `StyleSheet.create()` for styles
- No unused variables/styles (enforced by linting)
- Component props should have TypeScript interface definitions in separate `.types.ts` files
- Use named exports, not default exports for utility functions
- Error handling: throw descriptive Error objects with clear messages
- Function naming: camelCase, descriptive names (e.g., `convertDistanceToUnit`, `formatDistance`)
- File naming: PascalCase for components, camelCase for utilities
- JSDoc comments for public utility functions with @param and @returns
- Prettier config: single quotes, trailing commas, 100 char width, 2 spaces, semicolons
