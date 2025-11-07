import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';


const actions = [
  { id: '1', icon: 'swap-horizontal', label: 'One Way Ticket' },
  { id: '2', icon: 'bus', label: 'Bus Pass' },
  { id: '3', icon: 'card', label: 'Recharge Card' },
  { id: '4', icon: 'time', label: 'History' },
];

const history = [
  { id: '1', title: "Downtown Station" },
  { id: '2', title: "Airport Express" },
  { id: '3', title: "Route 45" },
  { id: '4', title: "Central Park" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello Jay,</Text>
            <Text style={styles.welcome}>Welcome</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Destination or route number"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>$2,347.87</Text>
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Active Tickets */}
        <TouchableOpacity style={styles.ticketCard} activeOpacity={0.7}>
          <View style={{ position: 'relative' }}>
            <Ionicons name="ticket" size={22} color="#fff" />
            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.ticketTitle}>Your Active Tickets</Text>
            <Text style={styles.ticketSubtitle}>See your current journeys</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>


        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {actions.map((item) => (
            <TouchableOpacity key={item.id} style={styles.actionItem} activeOpacity={0.7}>
              <View style={styles.actionCircle}>
                <Ionicons name={item.icon as any} size={22} color="#fff" />
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Buses */}
        <TouchableOpacity style={[styles.ticketCard, { backgroundColor: '#FDF7E3', }]} activeOpacity={0.7}>
          <Ionicons name="bus" size={22} color="#000" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[styles.ticketTitle, { color: '#000' }]}>Nearby Buses</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1A12', padding: 20 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: '#aaa', fontSize: 16 },
  welcome: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: 2 },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: Platform.OS === 'ios' ? 15 : 5,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 15,
    // marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#000',
  },

  historyCardText: { marginLeft: 8, color: '#333', fontSize: 14 },

  // Balance Card
  balanceCard: {
    marginTop: 20,
    backgroundColor: '#FDF7E3',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  balanceLabel: { color: '#333', fontSize: 14 },
  balanceValue: { color: '#000', fontSize: 26, fontWeight: '700', marginTop: 4 },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Ticket Card
  ticketCard: {
    backgroundColor: '#FF6A3D',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FF6A3D',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  ticketTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  ticketSubtitle: { color: '#eee', fontSize: 13, marginTop: 2 },

  // Quick Actions
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 28, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionItem: { alignItems: 'center', flex: 1 },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1D2B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: { color: '#ccc', fontSize: 12, textAlign: 'center' },
  // History Cards
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  historyIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0E1A12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  historySubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
  position: 'absolute',
  top: -20,
  right: 10,
  backgroundColor: '#FF3B30',
  borderRadius: 12,
  minWidth: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 5,
},
badgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '700',
},

});
