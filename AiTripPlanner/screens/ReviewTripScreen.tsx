import { View, Text, StyleSheet, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ReviewTripScreen">;
};

export default function ReviewTripScreen({ navigation }: Props) {
  function handleGenerateTrip() {
    Alert.alert("AI Trip Generated", "Your trip plan is ready.");
    navigation.replace("TripDetailsScreen", { tripId: "new-trip" });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Review</Text>
      <Text style={styles.title}>Ready to generate your trip?</Text>
      <Text style={styles.subtitle}>
        AI will create a daily itinerary, budget breakdown, hotel suggestions,
        transport options, and activities.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trip Summary</Text>
        <Text style={styles.item}>📍 Destination: Milan</Text>
        <Text style={styles.item}>📅 Dates: 14 Jun - 20 Jun</Text>
        <Text style={styles.item}>💰 Budget: Moderate</Text>
        <Text style={styles.item}>🎯 Interests: Food, Shopping, Culture</Text>
      </View>

      <View style={styles.footer}>
        <AppButton title="Generate AI Trip" onPress={handleGenerateTrip} />
        <AppButton
          title="Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: Colors.background,
  },
  step: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: "800",
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 24,
    marginBottom: 30,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 22,
    borderRadius: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
  },
});