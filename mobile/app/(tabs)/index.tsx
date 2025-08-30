import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


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

        {/* Search History */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <FlatList
            data={history}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 6 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.historyCard} activeOpacity={0.7}>
                <Ionicons name="time-outline" size={18} color="#555" />
                <Text style={styles.historyCardText}>{item.title}</Text>
              </TouchableOpacity>
            )}
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
          <Ionicons name="ticket" size={22} color="#fff" />
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

  // History Cards
  historyCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardText: { marginLeft: 8, color: '#333', fontSize: 14 },

  // Balance Card
  balanceCard: {
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
});
