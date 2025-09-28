import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0E1A12',
          borderTopWidth: 0,
          height: 80,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />

      {/* Payment */}
      <Tabs.Screen
        name="payment"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'card' : 'card-outline'}
              size={26}
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />

      {/* Search (center floating) */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: () => (
            <View style={styles.searchButton}>
              <Ionicons name="search" size={28} color="#fff" />
            </View>
          ),
        }}
      />

      {/* Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={26}
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={26}
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6A3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 10, // floating effect
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
});
