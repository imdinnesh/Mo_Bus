import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("hasSeenOnboarding").then((value) => {
      if (value === "true") {
        // For Testting Purpose
        AsyncStorage.setItem("hasSeenOnboarding", "false");
        setLoading(false);
        // router.replace("/(auths)/login");
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
      <LinearGradient colors={["#000", "#1a1a1a"]} style={styles.slide}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </LinearGradient>
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
      subtitle:
        "Real-time tracking helps you know exactly when your bus arrives 📍",
      last: true,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Skip button */}
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
        activeDot={<View style={styles.activeDot} />}
        dot={<View style={styles.dot} />}
      >
        {slides.map((slide) => (
          <LinearGradient
            key={slide.id}
            colors={["#000", "#111", "#1a1a1a"]}
            style={styles.slide}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5
                name={slide.icon}
                size={120}
                color="#FF6B00"
                style={styles.icon}
              />
            </View>

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
          </LinearGradient>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
   iconContainer: {
    marginBottom: 30,
    shadowColor: "#FF6B00",
    shadowOpacity: 0.3, // reduced from 0.6 → softer
    shadowRadius: 10,   // reduced from 20 → less blur
    shadowOffset: { width: 0, height: 6 }, // smaller offset
  },
  icon: {
    textShadowColor: "#FF6B00",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6, // reduced from 15
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B00",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryButton: {
    backgroundColor: "#FF6B00",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  secondaryButton: {
    borderWidth: 1.2,
    borderColor: "#FF6B00",
    backgroundColor: "transparent",
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
    padding: 6,
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
  dot: {
    backgroundColor: "#555",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#FF6B00",
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: 3,
  },
});
