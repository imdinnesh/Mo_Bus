import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding() {
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has seen onboarding
    AsyncStorage.getItem("hasSeenOnboarding").then((value) => {
      if (value === "true") {
        // AsyncStorage.setItem("hasSeenOnboarding", "false");
        router.replace("/(auths)/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  const markOnboardingSeen = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
  };

  if (loading) {
    return (
      <View style={styles.slide}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  const slides = [
    {
      id: 1,
      icon: "bus-alt",
      title: "Welcome to MoBus",
      subtitle: "Your smart public bus booking service 🚍",
    },
    {
      id: 2,
      icon: "ticket-alt",
      title: "Easy Booking",
      subtitle: "Reserve your bus seat anytime, anywhere 🎟️",
    },
    {
      id: 3,
      icon: "map-marked-alt",
      title: "Track Your Ride",
      subtitle: "Real-time tracking helps you know exactly when your bus arrives 📍",
      last: true,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={async () => {
          await markOnboardingSeen();
          router.replace("/(auths)/login");
        }}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        showsButtons={false}
        activeDotColor="#FF6B00"
        dotColor="#666"
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <FontAwesome5 name={slide.icon} size={120} color="#FF6B00" />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>

            {slide.last ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={async () => {
                    await markOnboardingSeen();
                    router.replace("/(auths)/signup");
                  }}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={async () => {
                    await markOnboardingSeen();
                    router.replace("/(auths)/login");
                  }}
                >
                  <Text style={styles.secondaryButtonText}>
                    I already have an account
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => swiperRef.current?.scrollBy(1)}
              >
                <Text style={styles.nextText}>Next →</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6B00",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FF6B00",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#FF6B00",
  },
  secondaryButtonText: {
    color: "#FF6B00",
    fontSize: 16,
  },
  skipBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtn: {
    marginTop: 40,
  },
  nextText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "600",
  },
});
