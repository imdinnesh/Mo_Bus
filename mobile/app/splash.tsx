import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "@/store/auth.store";
import { isTokenValid } from "@/utils/token";

// Prevent the splash screen from auto-hiding before we finish checks
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [message, setMessage] = useState("Initializing...");

  useEffect(() => {
    const run = async () => {
      try {
        // 1️⃣ Allow Zustand to rehydrate persisted store
        await new Promise((resolve) => setTimeout(resolve, 300));

        setMessage("Checking authentication...");

        // 2️⃣ Check if token exists and is valid
        const valid = isTokenValid(accessToken);
        if (!valid) {
          setMessage("Redirecting to login...");
          await SplashScreen.hideAsync();
          router.replace("/login");
          return;
        }

        // 3️⃣ Optional: Biometric check
        setMessage("Verifying biometrics...");
        
        // 4️⃣ Everything OK — go to home
        setMessage("Welcome back!");
        await SplashScreen.hideAsync();
        router.replace("/(auths)/login");
      } catch (error) {
        console.error("Error during splash checks:", error);
        await SplashScreen.hideAsync();
        router.replace("/home");
      }
    };
    run();
  }, [accessToken]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MyApp</Text>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // change to your brand color
  },
  logo: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  message: {
    color: "#ccc",
    marginTop: 12,
  },
});
