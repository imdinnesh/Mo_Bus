import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// For icons, we will use a set that is a good modern alternative to Lucide,
// which is used in the web version. Feather is a great choice.
import Feather from 'react-native-vector-icons/Feather';

// A placeholder bus icon for the header. You can replace this with your own logo.
const busIcon = require('@/assets/images/bus_icon.png');

// A reusable component for the quick action buttons
const QuickActionButton = ({ iconName, title, onPress }: {
  iconName: string;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
    <ThemedView style={styles.iconContainer}>
      <Feather name={iconName} size={20} color="#3B82F6" />
    </ThemedView>
    <ThemedText style={styles.quickActionText}>{title}</ThemedText>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#FFFFFF', dark: '#1F2937' }}
        headerImage={
          <View style={styles.headerImageContainer}>
            {/* The image component requires a source object with dimensions */}
            <Image
              source={busIcon}
              contentFit="contain"
              style={styles.busLogo}
            />
          </View>
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome to Mo Bus!</ThemedText>
        </ThemedView>
        
        {/* Search Bar Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Find Your Trip</ThemedText>
          <TouchableOpacity style={styles.searchBar}>
            <Feather name="search" size={20} color="#9CA3AF" />
            <ThemedText style={styles.searchBarText}>
              Search routes and stops...
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Quick Actions Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Quick Actions</ThemedText>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton iconName="map" title="Live Map" onPress={() => { /* Navigate to map screen */ }} />
            <QuickActionButton iconName="credit-card" title="Recharge Card" onPress={() => { /* Navigate to recharge screen */ }} />
            <QuickActionButton iconName="pocket" title="View Balance" onPress={() => { /* Navigate to wallet screen */ }} />
            <QuickActionButton iconName="info" title="Route Details" onPress={() => { /* Navigate to route info screen */ }} />
          </View>
        </ThemedView>

        {/* Active Tickets Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle">Active Tickets</ThemedText>
          <View style={styles.noTicketsCard}>
            <Feather name="tag" size={48} color="#E5E7EB" />
            <ThemedText style={styles.noTicketsText}>No active tickets found.</ThemedText>
            <TouchableOpacity style={styles.bookTicketButton}>
              <ThemedText style={styles.bookTicketButtonText}>Book a Ticket</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerImageContainer: {
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  busLogo: {
    height: 150,
    width: 150,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchBarText: {
    marginLeft: 10,
    color: '#9CA3AF',
    fontSize: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#EBF5FF',
    borderRadius: 9999,
    padding: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  noTicketsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noTicketsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  bookTicketButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookTicketButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
