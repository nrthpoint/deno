# Deno

Fitness milestone tracker

## 🚀 Development Workflow

This project uses EAS (Expo Application Services) for building and updating the app. The workflow is optimized for rapid iteration with EAS Update, allowing you to push code changes instantly without rebuilding the entire app.

### 📱 Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start development server**

   ```bash
   pnpm start
   ```

3. **Run on iOS simulator**

   ```bash
   pnpm sim
   ```

4. **Run on physical device**

   ```bash
   pnpm device
   ```

## 🔄 EAS Update Workflow

### Initial Setup (One-time)

1. **Build and install the preview app** (for testing updates)

   ```bash
   pnpm build:preview
   ```

   Install the resulting build on your device via Expo dashboard or TestFlight.

### Daily Development (Fast Updates)

Once you have the preview build installed, you can push instant updates:

```bash
# Push update to preview channel (default for rapid testing)
pnpm update

# Or be explicit about the message
eas update --branch preview --message "Fix navigation bug"
```

### Available Update Commands

- **`pnpm update`** - Quick update to preview channel
- **`pnpm update:dev`** - Update development channel
- **`pnpm update:preview`** - Update preview channel (same as `pnpm update`)
- **`pnpm update:production`** - Update production channel

### Build Commands

- **`pnpm build`** - Development build (with dev client)
- **`pnpm build:preview`** - Preview build for testing
- **`pnpm build:production`** - Production build for app store
- **`pnpm build:local`** - Local development build

## 🌟 Update Channels

| Channel         | Purpose                                | When to Use                     |
| --------------- | -------------------------------------- | ------------------------------- |
| **development** | Active development with debug features | Local development and debugging |
| **preview**     | Testing and QA                         | **Default for rapid iteration** |
| **production**  | Live app users                         | App store releases only         |

## ⚡ Recommended Workflow

### For Feature Development

1. Make code changes
2. Test locally: `pnpm start`
3. Push to preview for device testing: `pnpm update`
4. Iterate quickly with more updates as needed
5. When ready, build for production: `pnpm build:production`

### For Hotfixes

1. Make the fix
2. Test locally
3. Push directly to production: `pnpm update:production`

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🎨 Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm check-format
```

## 📋 Key Benefits of This Setup

- **⚡ Instant Updates**: Push code changes in seconds, not minutes
- **🚫 No App Store**: Test immediately without TestFlight approval
- **🔄 Easy Rollback**: Revert problematic updates instantly
- **🎯 Multiple Environments**: Separate channels for different stages
- **📱 Over-the-Air**: Updates download automatically when app starts

## 🔧 Configuration Files

- **`eas.json`** - EAS build and update configuration
- **`app.config.js`** - Expo app configuration with update settings
- **`package.json`** - npm scripts for common workflows

## 📚 Learn More

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
