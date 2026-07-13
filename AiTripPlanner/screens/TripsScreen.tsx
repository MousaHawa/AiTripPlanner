import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function TripsScreen({ navigation }: any) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingTripId, setDeletingTripId] =
    useState<string | null>(null);

  async function loadTrips() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setTrips([]);
        return;
      }

      const tripsRef = collection(
        db,
        "users",
        user.uid,
        "trips"
      );

      const tripsQuery = query(
        tripsRef,
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(tripsQuery);

      const loadedTrips = snapshot.docs.map((tripDocument) => ({
        ...tripDocument.data(),

        // Keep the real Firestore document ID last.
        id: tripDocument.id,
      }));

      setTrips(loadedTrips);
    } catch (error: any) {
      console.log("LOAD TRIPS ERROR:", error);

      Alert.alert(
        "Error",
        error.message || "Could not load trips."
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeTrip(tripId: string) {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(
          "Login required",
          "Please log in again."
        );
        return;
      }

      if (!tripId) {
        Alert.alert(
          "Delete failed",
          "This trip does not have a valid document ID."
        );
        return;
      }

      if (deletingTripId !== null) {
        return;
      }

      setDeletingTripId(tripId);

      await deleteDoc(
        doc(db, "users", user.uid, "trips", tripId)
      );

      setTrips((currentTrips) =>
        currentTrips.filter(
          (trip) => trip.id !== tripId
        )
      );

      Alert.alert(
        "Trip deleted",
        "The trip was removed successfully."
      );
    } catch (error: any) {
      console.log("DELETE TRIP ERROR:", error);

      Alert.alert(
        "Delete failed",
        error.message || "Could not delete this trip."
      );
    } finally {
      setDeletingTripId(null);
    }
  }

  function confirmRemoveTrip(item: any) {
    Alert.alert(
      "Delete trip",
      `Are you sure you want to delete ${
        item.destination || "this trip"
      }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeTrip(item.id),
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadTrips();
    }, [])
  );

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.badge}>Saved Trips</Text>

        <Text style={styles.title}>My Trips 🧳</Text>

        <Text style={styles.subtitle}>
          Your saved AI travel plans appear here.
        </Text>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator
              size="large"
              color="#FDE68A"
            />

            <Text style={styles.loadingText}>
              Loading your trips...
            </Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="airplane"
                size={36}
                color="#FDE68A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No saved trips yet
            </Text>

            <Text style={styles.emptyText}>
              Generate your first AI trip and save it here.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.createButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() =>
                navigation.navigate("CreateTripScreen")
              }
            >
              <Text style={styles.createButtonText}>
                Create New Trip
              </Text>

              <View style={styles.buttonIconCircle}>
                <Ionicons
                  name="add"
                  size={22}
                  color="#111827"
                />
              </View>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isDeleting =
                deletingTripId === item.id;

              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.card,
                    pressed && styles.cardPressed,
                    isDeleting && styles.cardDisabled,
                  ]}
                  disabled={isDeleting}
                  onPress={() =>
                    navigation.navigate(
                      "TripDetailsScreen",
                      {
                        tripId: item.id,
                        trip: item,
                      }
                    )
                  }
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed &&
                        !isDeleting &&
                        styles.deleteButtonPressed,
                    ]}
                    disabled={isDeleting}
                    onPress={(event) => {
                      event.stopPropagation();
                      confirmRemoveTrip(item);
                    }}
                  >
                    {isDeleting ? (
                      <ActivityIndicator
                        size="small"
                        color="#FDE68A"
                      />
                    ) : (
                      <Ionicons
                        name="trash-outline"
                        size={21}
                        color="#FDE68A"
                      />
                    )}
                  </Pressable>

                  <View style={styles.cardTop}>
                    <View style={styles.iconCircle}>
                      <Ionicons
                        name="location"
                        size={22}
                        color="#111827"
                      />
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.destination}>
                        {item.destination ||
                          "Unknown destination"}
                      </Text>

                      <Text
                        style={styles.summary}
                        numberOfLines={2}
                      >
                        {item.summary ||
                          "AI generated travel plan"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaText}>
                        📅 {item.totalDays || "-"} days
                      </Text>
                    </View>

                    <View style={styles.metaPill}>
                      <Text style={styles.metaText}>
                        💰{" "}
                        {item.estimatedCost ||
                          item.totalCost ||
                          item.finalPrice ||
                          "Budget"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.openText}>
                    Tap to view details →
                  </Text>
                </Pressable>
              );
            }}
            ListFooterComponent={
              <Pressable
                style={({ pressed }) => [
                  styles.newTripButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() =>
                  navigation.navigate("CreateTripScreen")
                }
              >
                <Text style={styles.newTripButtonText}>
                  New Trip
                </Text>

                <View style={styles.buttonIconCircle}>
                  <Ionicons
                    name="add"
                    size={22}
                    color="#111827"
                  />
                </View>
              </Pressable>
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(253,230,138,0.18)",
    color: "#FDE68A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
    overflow: "hidden",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: "600",
  },

  listContent: {
    paddingBottom: 180,
  },

  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },

  loadingText: {
    color: "#DDD6FE",
    marginTop: 12,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 30,
    padding: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    marginTop: 40,
  },

  emptyIconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(253,230,138,0.14)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 8,
  },

  emptyText: {
    color: "#DDD6FE",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
    fontWeight: "600",
  },

  createButton: {
    width: "100%",
    minHeight: 60,
    borderRadius: 20,
    paddingHorizontal: 18,
    backgroundColor: "#FDE68A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },

  createButtonText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 16,
  },

  card: {
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  cardDisabled: {
    opacity: 0.6,
  },

  cardTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  cardContent: {
    flex: 1,
    paddingRight: 48,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },

  destination: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  summary: {
    fontSize: 13,
    color: "#DDD6FE",
    lineHeight: 18,
    fontWeight: "600",
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  metaPill: {
    backgroundColor: "rgba(253,230,138,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.30)",
  },

  metaText: {
    color: "#FDE68A",
    fontSize: 12,
    fontWeight: "900",
  },

  openText: {
    color: "#FDE68A",
    fontWeight: "900",
    fontSize: 13,
  },

  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(253,230,138,0.14)",
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
    zIndex: 10,
  },

  deleteButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },

  newTripButton: {
    minHeight: 62,
    borderRadius: 22,
    paddingHorizontal: 20,
    backgroundColor: "#FDE68A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    marginTop: 8,
    marginBottom: 24,
  },

  newTripButtonText: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },

  buttonIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },  
});