import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "TripDetailsScreen">;
  route: RouteProp<RootStackParamList, "TripDetailsScreen">;
};

export default function TripDetailsScreen({ navigation, route }: Props) {
  const { tripId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Milan Trip Plan</Text>
      <Text style={styles.subtitle}>Trip ID: {tripId}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget Breakdown</Text>
        <Text style={styles.item}>🏨 Hotel: $600</Text>
        <Text style={styles.item}>🍝 Food: $250</Text>
        <Text style={styles.item}>🚇 Transport: $100</Text>
        <Text style={styles.item}>🎟 Activities: $250</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Day 1</Text>
        <Text style={styles.item}>Morning: Arrive and check in</Text>
        <Text style={styles.item}>Afternoon: Visit Duomo di Milano</Text>
        <Text style={styles.item}>Evening: Dinner at local restaurant</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Day 2</Text>
        <Text style={styles.item}>Morning: Brera district</Text>
        <Text style={styles.item}>Afternoon: Shopping at Galleria Vittorio Emanuele II</Text>
        <Text style={styles.item}>Evening: Navigli canals</Text>
      </View>

      <AppButton
        title="Back Home"
        onPress={() => navigation.navigate("HomeScreen")}
      />
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
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 22,
    borderRadius: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 14,
  },
  item: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
});