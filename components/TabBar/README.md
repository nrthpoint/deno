# TabBar Component

A reusable tab bar component that matches the design shown in your activity type selector. The component provides a clean, modern interface with rounded corners and proper styling for active/inactive states.

## Features

- ✅ Fully reusable and customizable
- ✅ Supports disabled tabs
- ✅ Customizable colors for active/inactive states
- ✅ Proper accessibility support
- ✅ TypeScript support
- ✅ Matches your app's design system

## Basic Usage

```tsx
import { TabBar, TabOption } from '@/components/TabBar';

const tabs: TabOption[] = [
  { id: 'running', label: 'Running' },
  { id: 'walking', label: 'Walking', disabled: true },
  { id: 'cycling', label: 'Cycling', disabled: true },
];

const [activeTab, setActiveTab] = useState('running');

<TabBar
  tabs={tabs}
  activeTabId={activeTab}
  onTabPress={setActiveTab}
/>;
```

## Props

| Prop                | Type                      | Default         | Description                        |
| ------------------- | ------------------------- | --------------- | ---------------------------------- |
| `tabs`              | `TabOption[]`             | Required        | Array of tab options to display    |
| `activeTabId`       | `string`                  | Required        | ID of the currently active tab     |
| `onTabPress`        | `(tabId: string) => void` | Required        | Callback when a tab is pressed     |
| `style`             | `ViewStyle`               | `undefined`     | Custom style for the container     |
| `activeTabColor`    | `string`                  | `'#282E9A'`     | Background color for active tab    |
| `inactiveTabColor`  | `string`                  | `'transparent'` | Background color for inactive tabs |
| `activeTextColor`   | `string`                  | `'#FFFFFF'`     | Text color for active tab          |
| `inactiveTextColor` | `string`                  | `'#999999'`     | Text color for inactive tabs       |

## TabOption Interface

```tsx
interface TabOption {
  id: string; // Unique identifier for the tab
  label: string; // Display text for the tab
  disabled?: boolean; // Whether the tab is disabled
}
```

## Advanced Usage

### Custom Colors

```tsx
<TabBar
  tabs={tabs}
  activeTabId={activeTab}
  onTabPress={setActiveTab}
  activeTabColor="#FF6B6B"
  inactiveTabColor="#F0F0F0"
  activeTextColor="#FFFFFF"
  inactiveTextColor="#666666"
/>
```

### With Custom Styling

```tsx
<TabBar
  tabs={tabs}
  activeTabId={activeTab}
  onTabPress={setActiveTab}
  style={{
    marginHorizontal: 20,
    marginVertical: 10,
  }}
/>
```

### Integration Example (Activity Type Selector)

This is how it's used in the settings screen for activity type selection:

```tsx
import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { TabBar } from '@/components/TabBar';

const { activityType, setActivityType } = useSettings();

<TabBar
  tabs={[
    { id: String(WorkoutActivityType.running), label: 'Running' },
    { id: String(WorkoutActivityType.walking), label: 'Walking', disabled: true },
    { id: String(WorkoutActivityType.cycling), label: 'Cycling', disabled: true },
  ]}
  activeTabId={String(activityType)}
  onTabPress={(value) => setActivityType(value as unknown as WorkoutActivityType)}
  activeTabColor={colors.primary}
  inactiveTabColor="transparent"
  activeTextColor="#FFFFFF"
  inactiveTextColor="#999999"
/>;
```

## Design Notes

- The component uses rounded corners with a border
- Active tabs have a blue background (#282E9A by default) with white text
- Inactive tabs are transparent with gray text
- Disabled tabs have reduced opacity and are non-interactive
- The component follows your app's existing font and spacing patterns
- Uses Lato Bold font for consistency with your design system

## Files Created

- `/components/TabBar/TabBar.tsx` - Main component
- `/components/TabBar/index.ts` - Export file
- `/components/TabBar/ActivityTypeSelector.tsx` - Example usage component

The TabBar is already integrated into your settings screen at `/app/(tabs)/settings.tsx` replacing the previous SegmentedButtons implementation.
