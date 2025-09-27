import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Toaster } from 'sonner-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null; // Don't render until fonts are loaded
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(auths)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
          <Toaster
            position="top-center"
            // offset={100}
            duration={3000}
            swipeToDismissDirection="up"
            visibleToasts={4}
            closeButton
            autoWiggleOnUpdate="toast-change"
            theme="system"
            toastOptions={{
              actionButtonStyle: {
                paddingHorizontal: 20,
              },
            }}
            // ToastWrapper={ToastWrapper}
            pauseWhenPageIsHidden
          />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
