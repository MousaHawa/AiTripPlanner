import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: any;
};

const popularDestinations = ["Milan", "Paris", "Istanbul", "Dubai"];

export default function ExploreScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hello Mousa 👋</Text>
      <Text style={styles.title}>Explore your next trip</Text>
      <Text style={styles.subtitle}>
        Discover destinations and let AI create a personalized plan for your budget.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroIcon}>🌍</Text>
        <Text style={styles.heroTitle}>Create your AI trip</Text>
        <Text style={styles.heroText}>
          Choose destination, dates, budget, and interests. We will build the trip for you.
        </Text>

        <AppButton
          title="Start Planning"
          onPress={() => navigation.navigate("CreateTripScreen")}
        />
      </View>

      <Text style={styles.sectionTitle}>Popular Destinations</Text>

      <View style={styles.grid}>
        {popularDestinations.map((city) => (
          <Pressable
            key={city}
            style={styles.destinationCard}
            onPress={() => navigation.navigate("DestinationScreen")}
          >
            <Text style={styles.destinationIcon}>✈️</Text>
            <Text style={styles.destinationName}>{city}</Text>
            <Text style={styles.destinationText}>Explore trip ideas</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 120,
  },
  greeting: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 24,
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 28,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroIcon: {
    fontSize: 44,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  heroText: {
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  destinationCard: {
    width: "47%",
    backgroundColor: Colors.card,
    padding: 18,
    borderRadius: 22,
  },
  destinationIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 6,
  },
  destinationText: {
    fontSize: 13,
    color: Colors.muted,
  },
});