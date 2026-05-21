import { View, Text, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "WelcomeScreen">;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>✈️</Text>
        </View>

        <Text style={styles.appName}>AI Trip Planner</Text>

        <Text style={styles.title}>Plan your next trip smarter</Text>

        <Text style={styles.subtitle}>
          Build personalized trips based on your budget, destination, dates,
          travel style, and interests.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Start your journey</Text>
        <Text style={styles.cardText}>
          Create an account or login to save your trips and get AI suggestions.
        </Text>

        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate("SignupScreen")}
          style={{ marginBottom: 12 }}
        />

        <AppButton
          title="Login"
          variant="outline"
          onPress={() => navigation.navigate("LoginScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "space-between",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 44,
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 22,
    borderRadius: 28,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 21,
    marginBottom: 22,
  },
});