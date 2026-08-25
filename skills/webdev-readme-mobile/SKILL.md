---
name: webdev-readme-mobile
description: Manus webdev mobile-app (Expo) projects — the complete development guide for the Expo template that mobile-app projects are built on. Covers what ships out of the box, Expo conventions, design and branding rules, file layout, and where the backend guide lives. The same guide arrives auto-injected in webdev_init_project / webdev_add_feature results.
---

# Expo Mobile Template

React Native mobile app with **Expo SDK 54**, **TypeScript**, and **React 19**.

**Tech Stack:** React Native 0.81 | Expo Router 6 | NativeWind 4 (Tailwind CSS) | TypeScript 5.9 | react-native-reanimated 4.x

---

## Quick Start

1. **Edit the home screen** — `app/(tabs)/index.tsx` is your app's main entry point
2. **Customize theme** — Update tokens in `theme.config.js` (used by Tailwind + runtime) and app details in `app.config.ts`
3. **Add new screens** — Use `ScreenContainer` component for proper SafeArea handling
4. **Add tab icons** — Map icons in `icon-symbol.tsx` BEFORE using in tabs

---

## Project Structure

```
app/
  _layout.tsx        ← Root layout with providers
  (tabs)/
    _layout.tsx      ← Tab bar configuration
    index.tsx        ← Home screen (EDIT THIS FIRST)
  oauth/             ← Auth callback (don't modify)
components/
  screen-container.tsx ← SafeArea wrapper (USE FOR ALL SCREENS)
  themed-view.tsx    ← View with auto theme background
  ui/
    icon-symbol.tsx  ← Tab bar icon mapping (ADD ICONS HERE FIRST)
constants/
  theme.ts           ← Runtime palette re-export (implemented in lib/_core/theme.ts)
theme.config.js      ← Single palette config (edit tokens here first)
theme.config.d.ts    ← Palette typings (update when adding new keys)
lib/_core/theme.ts   ← Runtime palette builder (shared by Tailwind + useColors)
lib/theme-provider.tsx ← Global theme context (light/dark switch)
lib/_core/nativewind-pressable.ts ← Disables Pressable className to avoid NativeWind pitfalls
hooks/
  use-auth.ts        ← Auth state hook
  use-colors.ts      ← Theme colors hook
  use-color-scheme.ts ← Dark/light mode detection
lib/
  trpc.ts            ← API client
  utils.ts           ← Utility functions (cn)
global.css           ← Tailwind directives
tailwind.config.js   ← Tailwind theme configuration
assets/images/       ← App icons and splash
```

---

## Styling with NativeWind (Tailwind CSS)

This template uses **NativeWind v4** for Tailwind CSS support in React Native.

### Basic Usage

```tsx
import { Text, View } from "react-native";

export function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold text-foreground">
        Hello World
      </Text>
      <Text className="mt-2 text-muted">
        Subtitle text
      </Text>
    </View>
  );
}
```

### Available Colors (from `theme.config.js`)

Tokens are defined once in `theme.config.js` and shared by Tailwind + runtime (`useColors()`):

| Token | Usage |
|-------|-------|
| `background` | Screen/page background |
| `foreground` | Primary text |
| `muted` | Secondary text |
| `primary` | Accent/tint color |
| `surface` | Cards/elevated surfaces |
| `border` | Borders/dividers |
| `success` | Success states |
| `warning` | Warning states |
| `error` | Error states |

**Dark mode:** Use color tokens directly (e.g., `text-foreground`, `bg-background`); ThemeProvider + CSS variables switch schemes automatically, no `dark:` prefix needed.

### Layout Tips
- If content may overflow, wrap the whole page in a `ScrollView`; short lists inside can use `.map()`.
- When multiple texts/icons must be inline, set parent `flex-row` (Pressable/TouchableOpacity default to column).
- Pressable className is globally disabled; pass interaction styles via `style`.
- For text inputs that submit on keyboard, set `returnKeyType="done"` (and handle submit) to avoid “Enter does nothing” issues on mobile.

### Combining Classes

Use the `cn()` utility from `@/lib/utils`:

```tsx
import { cn } from "@/lib/utils";

<View className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary",
  disabled && "opacity-50"
)} />
```

---

## State Management Guidance

- Default: React Context + `useReducer`/`useState` (simpler, fewer pitfalls). Persist with `AsyncStorage`/`MMKV` if needed.
- If you choose Zustand:
  - Selectors must return stable references (no new objects/arrays inside selectors).
  - Subscribe to data, not functions: `useStore((s) => s.state.entries)`; derive with `useMemo`.
  - Why: unstable selectors cause stale renders or render loops.
- For server data, prefer TanStack Query (already included).
- Expo FileSystem (SDK 54+): default to `import * as FileSystem from "expo-file-system/legacy"` to avoid deprecation warnings. If you need the new API, use `import { File } from "expo-file-system/next"` and `await new File(uri).base64()`.
- Provider wiring checklist: whenever you create a new context/provider, import it in `app/_layout.tsx` and wrap the app (outermost or alongside ThemeProvider) before calling any `useXxx` hook.

## Data & API Guidance

- Keep data flow consistent: define shared types/schemas and ensure sender/receiver param names match (e.g., route params, API payloads).
- No mock/placeholder numbers in UI; if data is unavailable, show loading/unknown, not hardcoded values.
- Platform-specific file handling: on iOS, `MediaLibrary.getAssetsAsync()` URIs (ph://) are not readable—use `MediaLibrary.getAssetInfoAsync()` to get `localUri` before reading/uploading.
- Validate end-to-end: API → data transform → navigation params → UI render. Avoid stopping halfway. 

## Screen Layout

### The Problem

React Native screens need to handle:
- Status bar area (notch on iPhone X+)
- Home indicator area (bottom of iPhone X+)
- Tab bar overlap

### The Solution: ScreenContainer

**Always use `ScreenContainer` for screen content:**

```tsx
import { Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function MyScreen() {
  return (
    <ScreenContainer className="p-4">
      <Text className="text-2xl font-bold text-foreground">
        Welcome
      </Text>
    </ScreenContainer>
  );
}
```

`ScreenContainer` handles:
- Background color extends behind status bar
- Content stays within safe bounds
- Tab bar area handled correctly

### ScreenContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | - | Tailwind classes for content area |
| `edges` | Edge[] | `["top", "left", "right"]` | SafeArea edges to apply |
| `containerClassName` | string | - | Classes for outer background container |

```tsx
// Full-screen modal (needs all edges)
<ScreenContainer edges={["top", "bottom", "left", "right"]}>

// Screen with custom bottom handling
<ScreenContainer edges={["top", "left", "right"]}>
```

---

## Interaction Design

### Priority Order

Build in this order — don't skip to polish before functionality works:

1. **Functionality** — All buttons work, all flows complete, no dead ends
2. **Feedback** — User knows their action was received (press states, loading indicators)
3. **Polish** — Animations and transitions (only if time permits)

### Press Feedback

| Element | Feedback | Implementation |
|---------|----------|----------------|
| Primary buttons | Scale + haptic | `scale: 0.97` + `Haptics.impactAsync(Light)` |
| List items / cards | Opacity | `opacity: 0.7` on press |
| Icons / minor actions | Opacity only | `opacity: 0.6` on press |

```tsx
<Pressable
  onPress={handlePress}
  style={({ pressed }) => [
    styles.button,
    pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }
  ]}
>
```

### Haptics

Use `expo-haptics` sparingly — overuse diminishes impact:

| Context | Type |
|---------|------|
| Button tap (primary actions) | `impactAsync(ImpactFeedbackStyle.Light)` |
| Toggle / switch | `impactAsync(ImpactFeedbackStyle.Medium)` |
| Success / completion | `notificationAsync(NotificationFeedbackType.Success)` |
| Error / failure | `notificationAsync(NotificationFeedbackType.Error)` |

### Animation (Optional Polish)

Only add animations after core functionality works. Keep them subtle:

```tsx
// ✅ Good: Subtle fade in
withTiming(1, { duration: 250 })

// ✅ Good: Gentle press feedback
withTiming(0.97, { duration: 80 })

// ❌ Bad: Bouncy spring
withSpring(1, { damping: 5 })  // Too bouncy

// ❌ Bad: Dramatic scale
withTiming(0.8, { duration: 200 })  // Too much
```

**Guidelines:**
- Duration: 80-300ms for interactions, up to 400ms for transitions
- Scale changes: 0.95-0.98 range (never below 0.9)
- Prefer `withTiming` with easing over `withSpring`
- Don't animate on mount unless it adds meaning

---

## Native Features

### Audio (expo-audio)

```tsx
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";

// IMPORTANT: Enable playback in iOS silent mode
await setAudioModeAsync({ playsInSilentModeIOS: true });

// Always release player on cleanup
useEffect(() => {
  return () => player.release();
}, []);

// Use real audio sources (no mock/generated placeholders). Track playback state internally for reliable UI:
// type Track = { player: AudioPlayer; volume: number; loop: boolean; isPlaying: boolean };
// track.player.play(); track.isPlaying = true; emit();
// track.player.pause(); track.isPlaying = false; emit();
// const isPlaying = track.isPlaying; // use for UI instead of player.playing (may lag on native)
```

**Getting Free Audio:** Use browser console on [pixabay.com/sound-effects](https://pixabay.com/sound-effects/):
```javascript
// 1) Open a sound page (or search results) on pixabay.com/sound-effects
// 2) Paste this in browser DevTools console to list direct mp3 links
const urls = document.documentElement.innerHTML.match(/https?:\/\/[^"'\s]+\.mp3[^"'\s]*/g) || [];
console.log(urls);
```

### Keep Screen Awake (expo-keep-awake)

```tsx
import { useKeepAwake } from "expo-keep-awake";

// Screen stays on while component is mounted
// Use for: meditation, workout, reading screens
useKeepAwake();
```

### Platform Detection

Disable native-only features on web:

```tsx
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  Haptics.impactAsync(ImpactFeedbackStyle.Light);
}
```

---

## Project Conventions

### Tab Icons
Add mapping in `icon-symbol.tsx` BEFORE using in tabs — otherwise app crashes.

### Data Storage
Prefer `AsyncStorage` for local persistence. Only add backend for cross-device sync.

### Lists
Always use `FlatList` — never `ScrollView` with `.map()`.

### Styles
Use `StyleSheet.create()` outside component, or Tailwind classes. Never inline style objects.

---

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Broken user flows / dead ends | Verify all flows end-to-end before delivery. Every `onPress` must work. |
| Missing icon mapping | Add to `icon-symbol.tsx` BEFORE using in tabs |
| Text clipped at top/bottom | Ensure `lineHeight > fontSize` (1.2-1.5×) |
| Background gap in dark mode | Use `ScreenContainer` |
| Content under notch | Use `ScreenContainer` |
| Slow list scrolling | Use `FlatList`, never `ScrollView` with `.map()` |
| Styles recreated every render | Use `StyleSheet.create()` outside component |
| iOS crash in gesture callbacks | Gesture handlers run as worklets. Use `.runOnJS(true)` on the gesture, or wrap JS calls with `runOnJS()` |
| Web crash with AnimatedSvg | Don't use `Animated.createAnimatedComponent(Svg)`. Wrap `<Svg>` with `<Animated.View>` instead |
| Gesture not responding | Ensure `GestureHandlerRootView` wraps the app |
| State changes not persisted | Call `saveSettings()` or `AsyncStorage.setItem()` after `setState()` |
| Bottom elements hidden by Tab Bar | Use `useSafeAreaInsets().bottom` or increase `bottom` value |
| **Pressable onPress not firing** | **Never use `className` on Pressable** — always use `style` prop |

### Common Crash Patterns

- **iOS crash on gesture**: Check worklet/JS thread issues (see Common Pitfalls)
- **Web white screen**: Check browser console for errors
- **Android ANR**: Check for blocking operations on main thread

---

## Backend Capabilities

The server provides these **built-in** capabilities (no external API keys required):

| Feature | What It Provides | When To Use |
|---------|------------------|-------------|
| **LLM/AI** | Multimodal AI (text, image, audio) | Image recognition, chat, content generation |
| **User Auth** | OAuth login, session management | User accounts |
| **Database** | PostgreSQL + Drizzle ORM | Cross-device data sync |
| **File Storage** | S3-compatible storage | User-uploaded files |
| **Push Notifications** | Server-side delivery | Notify users of events |

> **Important**: For AI features, use the server's built-in LLM — do NOT ask users for API keys.

See the webdev-readme-mobile-backend skill (`/home/ubuntu/skills/webdev-readme-mobile-backend/SKILL.md`) for implementation details.

---

## Delivery Checklist

Before delivering:

- [ ] All buttons and links work (no empty `onPress` handlers)
- [ ] Core user flows tested end-to-end
- [ ] `app/(tabs)/index.tsx` customized
- [ ] `tailwind.config.js` colors match brand
- [ ] `app.config.ts` app name updated
- [ ] Icon mappings added in `icon-symbol.tsx`
- [ ] No console errors on iOS, Android, and Web

---

## Core File References

Note: All TODO comments are remarks for the agent (you), not for the user.

`components/screen-container.tsx`
```tsx
import { View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
}

/**
 * A container component that properly handles SafeArea and background colors.
 *
 * The outer View extends to full screen (including status bar area) with the background color,
 * while the inner SafeAreaView ensures content is within safe bounds.
 *
 * Usage:
 * ```tsx
 * <ScreenContainer className="p-4">
 *   <Text className="text-2xl font-bold text-foreground">
 *     Welcome
 *   </Text>
 * </ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  ...props
}: ScreenContainerProps) {
  return (
    <View
      className={cn(
        "flex-1",
        "bg-background",
        containerClassName
      )}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={style}
      >
        <View className={cn("flex-1", className)}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
```

`app/(tabs)/_layout.tsx`
```tsx
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

`app/(tabs)/index.tsx`
```tsx
import { ScrollView, Text, View, TouchableOpacity } from "react-native";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - NativeWind Example
 *
 * This template uses NativeWind (Tailwind CSS for React Native).
 * You can use familiar Tailwind classes directly in className props.
 *
 * Key patterns:
 * - Use `className` instead of `style` for most styling
 * - Theme colors: use tokens directly (bg-background, text-foreground, bg-primary, etc.); no dark: prefix needed
 * - Responsive: standard Tailwind breakpoints work on web
 * - Custom colors defined in tailwind.config.js
 */
export default function HomeScreen() {
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">Welcome</Text>
            <Text className="text-base text-muted text-center">
              Edit app/(tabs)/index.tsx to get started
            </Text>
          </View>

          {/* Example Card */}
          <View className="w-full max-w-sm self-center bg-surface rounded-2xl p-6 shadow-sm border border-border">
            <Text className="text-lg font-semibold text-foreground mb-2">NativeWind Ready</Text>
            <Text className="text-sm text-muted leading-relaxed">
              Use Tailwind CSS classes directly in your React Native components.
            </Text>
          </View>

          {/* Example Button */}
          <View className="items-center">
            <TouchableOpacity className="bg-primary px-6 py-3 rounded-full active:opacity-80">
              <Text className="text-background font-semibold">Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
```

`lib/utils.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 * This ensures Tailwind classes are properly merged without conflicts.
 *
 * Usage:
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`hooks/use-colors.ts`
```tsx
import { Colors, type ColorScheme, type ThemeColorPalette } from "@/constants/theme";
import { useColorScheme } from "./use-color-scheme";

/**
 * Returns the current theme's color palette.
 * Usage: const colors = useColors(); then colors.text, colors.background, etc.
 */
export function useColors(colorSchemeOverride?: ColorScheme): ThemeColorPalette {
  const colorSchema = useColorScheme();
  const scheme = (colorSchemeOverride ?? colorSchema ?? "light") as ColorScheme;
  return Colors[scheme];
}
```

`components/ui/icon-symbol.tsx`
```tsx
// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
```

`tailwind.config.js`
```js
const { themeColors } = require("./theme.config");
const plugin = require("tailwindcss/plugin");

const tailwindColors = Object.fromEntries(
  Object.entries(themeColors).map(([name, swatch]) => [
    name,
    {
      DEFAULT: `var(--color-${name})`,
      light: swatch.light,
      dark: swatch.dark,
    },
  ]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // Scan all component and app files for Tailwind classes
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}", "./lib/**/*.{js,ts,tsx}", "./hooks/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ':root:not([data-theme="dark"]) &');
      addVariant("dark", ':root[data-theme="dark"] &');
    }),
  ],
};
```

`theme.config.js`
```js
/** @type {const} */
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  surface: { light: '#f5f5f5', dark: '#1e2022' },
  foreground: { light: '#11181C', dark: '#ECEDEE' },
  muted: { light: '#687076', dark: '#9BA1A6' },
  border: { light: '#E5E7EB', dark: '#334155' },
  success: { light: '#22C55E', dark: '#4ADE80' },
  warning: { light: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#EF4444', dark: '#F87171' },
};

module.exports = { themeColors };
```

`app.config.ts`
```ts
// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle ID format: space.manus.<project_name_dots>.<timestamp>
// e.g., "my-app" created at 2024-01-15 10:30:45 -> "space.manus.my.app.t20240115103045"
// Bundle ID can only contain letters, numbers, and dots
// Android requires each dot-separated segment to start with a letter
const rawBundleId = "{{bundle_id}}";
const bundleId =
  rawBundleId
    .replace(/[-_]/g, ".") // Replace hyphens/underscores with dots
    .replace(/[^a-zA-Z0-9.]/g, "") // Remove invalid chars
    .replace(/\.+/g, ".") // Collapse consecutive dots
    .replace(/^\.+|\.+$/g, "") // Trim leading/trailing dots
    .toLowerCase()
    .split(".")
    .map((segment) => {
      // Android requires each segment to start with a letter
      // Prefix with 'x' if segment starts with a digit
      return /^[a-zA-Z]/.test(segment) ? segment : "x" + segment;
    })
    .join(".") || "space.manus.app";
// Extract timestamp from bundle ID and prefix with "manus" for deep link scheme
// e.g., "space.manus.my.app.t20240115103045" -> "manus20240115103045"
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "{{project_title}}",
  appSlug: "{{project_name}}",
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: "",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
```

`package.json`
```json
{
  "name": "app-template",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "dev": "concurrently -k \"pnpm dev:server\" \"pnpm dev:metro\"",
    "dev:server": "cross-env NODE_ENV=development tsx watch server/_core/index.ts",
    "dev:metro": "cross-env EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo start --web --port ${EXPO_PORT:-8081}",
    "build": "esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc --noEmit",
    "lint": "expo lint",
    "format": "prettier --write .",
    "test": "vitest run",
    "db:push": "drizzle-kit generate && drizzle-kit migrate",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "qr": "node scripts/generate_qr.mjs"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.8.12",
    "@react-navigation/elements": "^2.9.2",
    "@react-navigation/native": "^7.1.25",
    "@tanstack/react-query": "^5.90.12",
    "@trpc/client": "11.7.2",
    "@trpc/react-query": "11.7.2",
    "@trpc/server": "11.7.2",
    "axios": "^1.13.2",
    "clsx": "^2.1.1",
    "cookie": "^1.1.1",
    "dotenv": "^16.6.1",
    "drizzle-orm": "^0.44.7",
    "expo": "~54.0.29",
    "expo-audio": "~1.1.0",
    "expo-build-properties": "^1.0.10",
    "expo-constants": "~18.0.12",
    "expo-font": "~14.0.10",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-keep-awake": "~15.0.8",
    "expo-linking": "~8.0.10",
    "expo-notifications": "~0.32.15",
    "expo-router": "~6.0.19",
    "expo-secure-store": "~15.0.8",
    "expo-splash-screen": "~31.0.12",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-video": "~3.0.15",
    "expo-web-browser": "~15.0.10",
    "express": "^4.22.1",
    "jose": "6.1.0",
    "mysql2": "^3.16.0",
    "nativewind": "^4.2.1",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.6",
    "react-native-safe-area-context": "~5.6.2",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "~0.21.2",
    "react-native-worklets": "0.5.1",
    "superjson": "^1.13.3",
    "tailwind-merge": "^2.6.0",
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "@expo/ngrok": "^4.1.3",
    "@types/cookie": "^0.6.0",
    "@types/express": "^4.17.25",
    "@types/node": "^22.19.3",
    "@types/qrcode": "^1.5.6",
    "@types/react": "~19.1.17",
    "concurrently": "^9.2.1",
    "cross-env": "^7.0.3",
    "drizzle-kit": "^0.31.8",
    "esbuild": "^0.25.12",
    "eslint": "^9.39.2",
    "eslint-config-expo": "~10.0.0",
    "prettier": "^3.7.4",
    "qrcode": "^1.5.4",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.21.0",
    "typescript": "~5.9.3",
    "vitest": "^2.1.9"
  },
  "packageManager": "pnpm@9.12.0"
}
```
