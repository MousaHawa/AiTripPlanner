import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Colors } from "../constants/colors";
import AppButton from "../components/ui/AppButton";

type Props = {
  navigation: any;
};

const wishlist = [
  {
    id: "1",
    destination: "Rome, Italy",
    reason: "Historical places, food, and city walks",
  },
  {
    id: "2",
    destination: "Barcelona, Spain",
    reason: "Beach, architecture, and nightlife",
  },
];

export default function WishlistScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      <Text style={styles.subtitle}>
        Save places you want to visit later.
      </Text>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <View>
              <Text style={styles.destination}>{item.destination}</Text>
              <Text style={styles.reason}>{item.reason}</Text>
            </View>

            <Text style={styles.heart}>♥</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>No wishlist yet</Text>
            <Text style={styles.emptyText}>
              Explore destinations and save your favorite places.
            </Text>
          </View>
        }
      />

      <AppButton
        title="Explore Destinations"
        onPress={() => navigation.navigate("ExploreTab")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 24,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 22,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  destination: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    color: Colors.muted,
    maxWidth: 250,
    lineHeight: 20,
  },
  heart: {
    fontSize: 26,
    color: Colors.danger,
  },
  emptyCard: {
    backgroundColor: Colors.card,
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
});