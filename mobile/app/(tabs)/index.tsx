import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', icon: 'swap-horizontal', label: 'Money transfer' },
  { id: '2', icon: 'cart', label: 'Online shopping' },
  { id: '3', icon: 'film', label: 'Movie booking' },
  { id: '4', icon: 'fast-food', label: 'Food order' },
  { id: '5', icon: 'car', label: 'Cab booking' },
  { id: '6', icon: 'bus', label: 'Bus booking' },
  { id: '7', icon: 'train', label: 'Train booking' },
  { id: '8', icon: 'airplane', label: 'Flight booking' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Jay,</Text>
        <Text style={styles.welcome}>Welcome</Text>
        <Ionicons name="menu" size={28} color="#fff" style={{ position: 'absolute', right: 0, top: 10 }} />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceValue}>$2347.87</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Next Payment */}
      <View style={styles.paymentCard}>
        <Ionicons name="calendar" size={20} color="#fff" />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Next bill payment</Text>
          <Text style={{ color: '#fff' }}>Due date: 27 Jun</Text>
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Most popular categories</Text>
      <FlatList
        data={categories}
        numColumns={4}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <View style={styles.categoryCircle}>
              <Ionicons name={item.icon as any} size={22} color="#fff" />
            </View>
            <Text style={styles.categoryLabel}>{item.label}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E1A12', padding: 20 },
  header: { marginBottom: 20 },
  greeting: { color: '#aaa', fontSize: 16 },
  welcome: { color: '#fff', fontSize: 28, fontWeight: '700' },
  balanceCard: {
    backgroundColor: '#FDF7E3',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: { color: '#333', fontSize: 14 },
  balanceValue: { color: '#000', fontSize: 26, fontWeight: '700' },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentCard: {
    backgroundColor: '#FF6A3D',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 24 },
  categoryItem: { flex: 1, alignItems: 'center', marginBottom: 20 },
  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1D2B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: { color: '#ccc', fontSize: 12, textAlign: 'center' },
});
