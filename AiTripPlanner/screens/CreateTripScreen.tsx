import { View, Text, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CreateTripScreen">;
};

export default function CreateTripScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.step}>Trip Setup</Text>
      <Text style={styles.title}>Let's build your perfect trip</Text>
      <Text style={styles.subtitle}>
        We will ask a few simple questions, then generate a personalized AI trip
        plan based on your budget and preferences.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Questions we will ask</Text>
        <Text style={styles.item}>📍 Destination</Text>
        <Text style={styles.item}>📅 Dates</Text>
        <Text style={styles.item}>💰 Budget</Text>
        <Text style={styles.item}>🎯 Interests</Text>
      </View>

      <AppButton
        title="Continue"
        onPress={() => navigation.navigate("DestinationScreen")}
      />

      <AppButton
        title="Back Home"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 12 }}
      />
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
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 22,
    borderRadius: 24,
    marginBottom: 32,
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
});