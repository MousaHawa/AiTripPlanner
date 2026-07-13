import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { logoutUser } from "../services/authService";

export default function ProfileScreen({ navigation }: any) {
  const user = auth.currentUser;

  const rawName = user?.displayName || user?.email?.split("@")[0] || "Traveler";

  const userName = rawName
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const email = user?.email || "No email";
  const firstLetter = userName.charAt(0).toUpperCase();

  async function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutUser();

          navigation.reset({
            index: 0,
            routes: [{ name: "WelcomeScreen" }],
          });
        },
      },
    ]);
  }

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarGlow} />

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        </View>

        <Text style={styles.title}>{userName}</Text>
        <Text style={styles.subtitle}>{email}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>

          <View style={styles.rowItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={20} color="#111827" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>AI Travel Planner</Text>
              <Text style={styles.itemText}>Personal smart itineraries</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="briefcase" size={20} color="#111827" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Saved Trips</Text>
              <Text style={styles.itemText}>Trips saved to your account</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={20} color="#111827" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Firebase Auth</Text>
              <Text style={styles.itemText}>Logged in securely</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.mainButton}
          onPress={() => navigation.navigate("TripsScreen")}
        >
          <Ionicons name="airplane" size={22} color="#111827" />
          <Text style={styles.mainButtonText}>My Trips</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FDE68A" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 82,
    alignItems: "center",
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(253, 230, 138, 0.20)",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
  },
  avatarText: {
    color: "#111827",
    fontSize: 36,
    fontWeight: "900",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    marginTop: 6,
    marginBottom: 28,
    fontWeight: "700",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 22,
    borderRadius: 28,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  rowItem: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  itemText: {
    fontSize: 13,
    color: "#DDD6FE",
    marginTop: 3,
    fontWeight: "600",
  },
  mainButton: {
    width: "100%",
    minHeight: 62,
    borderRadius: 22,
    backgroundColor: "#FDE68A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 14,
  },
  mainButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  logoutButton: {
    width: "100%",
    minHeight: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.45)",
    backgroundColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#FDE68A",
    fontSize: 16,
    fontWeight: "900",
  },
});