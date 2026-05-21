import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "TripsScreen">;
};

const trips = [
  {
    id: "1",
    destination: "Milan, Italy",
    date: "14 Jun - 20 Jun",
    budget: "$1200",
  },
  {
    id: "2",
    destination: "Istanbul, Turkey",
    date: "3 Jul - 8 Jul",
    budget: "$800",
  },
];

export default function TripsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      <Text style={styles.subtitle}>Your saved AI trips will appear here.</Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("TripDetailsScreen", { tripId: item.id })
            }
          >
            <Text style={styles.destination}>{item.destination}</Text>
            <Text style={styles.info}>{item.date}</Text>
            <Text style={styles.info}>Budget: {item.budget}</Text>
          </Pressable>
        )}
      />

      <AppButton
        title="Create New Trip"
        onPress={() => navigation.navigate("CreateTripScreen")}
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
    flex: 1,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 22,
    marginBottom: 14,
  },
  destination: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 4,
  },
});