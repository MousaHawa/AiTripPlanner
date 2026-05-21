import { View, Text, StyleSheet, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "HomeScreen">;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello Mousa 👋</Text>
          <Text style={styles.title}>Where do you want to go?</Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Text style={styles.profileText}>M</Text>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroIcon}>🌍</Text>
        <Text style={styles.heroTitle}>Create your AI trip</Text>
        <Text style={styles.heroText}>
          Tell us your destination, dates, budget, and interests. AI will build
          a smart itinerary for you.
        </Text>

        <AppButton
          title="Start Planning"
          onPress={() => navigation.navigate("CreateTripScreen")}
        />
      </View>

      <View style={styles.row}>
        <Pressable
          style={styles.smallCard}
          onPress={() => navigation.navigate("TripsScreen")}
        >
          <Text style={styles.smallIcon}>🧳</Text>
          <Text style={styles.smallTitle}>My Trips</Text>
          <Text style={styles.smallText}>View saved plans</Text>
        </Pressable>

        <Pressable
          style={styles.smallCard}
          onPress={() => navigation.navigate("DestinationScreen")}
        >
          <Text style={styles.smallIcon}>✨</Text>
          <Text style={styles.smallTitle}>New Trip</Text>
          <Text style={styles.smallText}>Generate plan</Text>
        </Pressable>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.text,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 18,
  },
  heroCard: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  heroText: {
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  smallCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 22,
  },
  smallIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 5,
  },
  smallText: {
    fontSize: 13,
    color: Colors.muted,
  },
});