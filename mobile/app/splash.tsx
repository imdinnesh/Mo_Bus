import { useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";



export default function SplashPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      // Simulate some loading delay (like checking tokens)
      await new Promise((res) => setTimeout(res, 20000));

      // Navigate based on token
      if (accessToken) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auths)/login");
      }
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Awesome App</Text>
      <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
});
