import { View, Text, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";
import { logoutUser } from "../services/authService";
type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ProfileScreen">;
};

export default function ProfileScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>M</Text>
      </View>

      <Text style={styles.title}>Mousa Abu Alhawa</Text>
      <Text style={styles.subtitle}>AI Trip Planner user</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferences</Text>
        <Text style={styles.item}>💰 Budget style: Moderate</Text>
        <Text style={styles.item}>🌍 Favorite trips: City breaks</Text>
        <Text style={styles.item}>🍽 Food: Local restaurants</Text>
      </View>

      <AppButton
        title="My Trips"
        onPress={() => navigation.navigate("TripsScreen")}
        style={{ marginBottom: 12 }}
      />

      <AppButton
  title="Logout"
  variant="outline"
  onPress={async () => {
    await logoutUser();

    navigation.reset({
      index: 0,
      routes: [{ name: "WelcomeScreen" }],
    });
  }}
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
    alignItems: "center",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: Colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    marginTop: 6,
    marginBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.card,
    padding: 22,
    borderRadius: 24,
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 14,
  },
  item: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 10,
  },
});