import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
          marginTop: 6,   // moves icons down
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="house.fill"
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />

      {/* Payment */}
      <Tabs.Screen
        name="payment"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="creditcard.fill"
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />

      {/* Search (center floating) */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.searchButton}>
              <IconSymbol
                size={28}
                name="magnifyingglass"
                color="#fff"
              />
            </View>
          ),
        }}
      />

      {/* Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="bell.fill"
              color={focused ? '#FF6A3D' : '#aaa'}
            />
          ),
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name="person.fill"
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
