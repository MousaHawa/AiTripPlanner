import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { auth,db } from "../services/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "HomeScreen">;
};

export default function HomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const globeFloat = useRef(new Animated.Value(0)).current;
  const [trips, setTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  const user = auth.currentUser;

  const rawName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Traveler";

  const userName = rawName
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const firstLetter = userName.charAt(0).toUpperCase();

  const hour = new Date().getHours();
  const dayGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

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

        const loadedTrips = snapshot.docs.map((tripDoc) => ({
          id: tripDoc.id,
          ...tripDoc.data(),
        }));

        setTrips(loadedTrips);
      } catch (error: any) {
        console.log("LOAD HOME TRIPS ERROR:", error);
        setTrips([]);
      } finally {
        setLoadingTrips(false);
      }
    }

    useFocusEffect(
      useCallback(() => {
        setLoadingTrips(true);
        loadTrips();
      }, [])
    );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(globeFloat, {
          toValue: -8,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(globeFloat, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

const latestTrip = trips.length > 0 ? trips[0] : null;

const latestTripData =
  latestTrip?.trip ||
  latestTrip?.data ||
  latestTrip;

const tripDestination =
  latestTrip?.destination ||
  latestTripData?.destination ||
  "Upcoming trip";

const tripStartDate =
  latestTrip?.startDate ||
  latestTrip?.dates?.startDate ||
  latestTrip?.dates?.start ||
  latestTrip?.trip?.startDate ||
  latestTrip?.trip?.dates?.startDate ||
  latestTrip?.trip?.dates?.start ||
  "";

const tripEndDate =
  latestTrip?.endDate ||
  latestTrip?.dates?.endDate ||
  latestTrip?.dates?.end ||
  latestTrip?.trip?.endDate ||
  latestTrip?.trip?.dates?.endDate ||
  latestTrip?.trip?.dates?.end ||
  "";

 return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>
                {dayGreeting}, {userName} 👋
              </Text>

              <Text style={styles.title}>
                Where should we go next?
              </Text>
            </View>

            <View style={styles.profileWrapper}>
              <View style={styles.profileGlow} />

              <Pressable
                style={styles.profileButton}
                onPress={() =>
                  navigation.navigate("ProfileScreen")
                }
              >
                <Text style={styles.profileText}>
                  {firstLetter}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <Animated.View
                style={[
                  styles.globeWrapper,
                  {
                    transform: [
                      {
                        translateY: globeFloat,
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.globeGlow} />

                <Text style={styles.heroIcon}>🌍</Text>
              </Animated.View>

              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>
                  AI Powered
                </Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>
              Plan your dream trip
            </Text>

            <Text style={styles.heroText}>
              Choose your destination, dates, budget, and travel
              style. Your AI assistant will build a complete
              itinerary with hotels, restaurants, activities, and
              reservation links.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startButtonPressed,
              ]}
              onPress={() =>
                navigation.navigate("CreateTripScreen")
              }
            >
              <View>
                <Text style={styles.startButtonText}>
                  Start Planning
                </Text>

                <Text style={styles.startButtonSubtext}>
                  Create your AI trip
                </Text>
              </View>

              <View style={styles.startButtonIcon}>
                <Ionicons
                  name="arrow-forward"
                  size={22}
                  color="#111827"
                />
              </View>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <View style={styles.row}>
            <Pressable
              style={[styles.smallCard, styles.focusCard]}
              onPress={() =>
                navigation.navigate("MainTabs", {
                  screen: "TripsTab",
                })
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="briefcase"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.smallTitle}>
                My Trips
              </Text>

              <Text style={styles.smallText}>
                View saved plans
              </Text>
            </Pressable>

            <Pressable
              style={[styles.smallCard, styles.orangeCard]}
              onPress={() =>
                navigation.navigate("CreateTripScreen")
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="sparkles"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.smallTitle}>
                New Trip
              </Text>

              <Text style={styles.smallText}>
                Generate a plan
              </Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Pressable
              style={[styles.smallCard, styles.greenCard]}
              onPress={() =>
                navigation.navigate("ExploreScreen")
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="location"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.smallTitle}>
                Explore
              </Text>

              <Text style={styles.smallText}>
                Find destinations
              </Text>
            </Pressable>

            <Pressable
              style={[styles.smallCard, styles.focusCard]}
              onPress={() =>
                navigation.navigate("MainTabs", {
                  screen: "ProfileTab",
                })
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="person"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.smallTitle}>
                Profile
              </Text>

              <Text style={styles.smallText}>
                Manage account
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>
            Travel Tip
          </Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>
                Book smart
              </Text>

              <Text style={styles.tipText}>
                Choose your dates first, then compare flights before
                generating the final trip plan.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Your Next Step
          </Text>

          {loadingTrips ? (
            <View style={styles.nextStepCard}>
              <ActivityIndicator
                size="large"
                color="#FDE68A"
              />

              <Text style={styles.loadingTripText}>
                Loading your trips...
              </Text>
            </View>
          ) : trips.length > 0 ? (
            <View style={styles.activeTripCard}>
              <View style={styles.activeTripIconCircle}>
                <Ionicons
                  name="airplane"
                  size={26}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.activeTripContent}>
                <Text style={styles.activeTripLabel}>
                  Your next trip
                </Text>

                <Text style={styles.activeTripDestination}>
                  {trips[0]?.destination ||
                    trips[0]?.trip?.destination ||
                    "Upcoming trip"}
                </Text>

                <Text style={styles.activeTripDates}>
                  {tripStartDate || "Date not selected"}
                  {"  →  "}
                  {tripEndDate || "Date not selected"}
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.viewTripButton,
                  pressed && styles.viewTripButtonPressed,
                ]}
                onPress={() =>
                  navigation.navigate("TripDetailsScreen", {
                    tripId: latestTrip?.id,
                    trip: latestTrip,
                  })
                }
              >
                <Text style={styles.viewTripButtonText}>
                  View Trip
                </Text>

                <View style={styles.viewTripIconCircle}>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#111827"
                  />
                </View>
              </Pressable>
            </View>
          ) : (
            <View style={styles.nextStepCard}>
              <View style={styles.nextStepIconCircle}>
                <Ionicons
                  name="airplane-outline"
                  size={28}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.nextStepTitle}>
                No active trip yet
              </Text>

              <Text style={styles.nextStepText}>
                Start by creating your first AI travel plan. It only
                takes a minute.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.createTripButton,
                  pressed && styles.createTripButtonPressed,
                ]}
                onPress={() =>
                  navigation.navigate("CreateTripScreen")
                }
              >
                <Text style={styles.createTripButtonText}>
                  Create Trip
                </Text>

                <View style={styles.createTripIconCircle}>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#111827"
                  />
                </View>
              </Pressable>
            </View>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
            }

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 22,
  paddingTop: 62,
},

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 14,
  },

  greeting: {
    fontSize: 15,
    color: "#FDE68A",
    marginBottom: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 40,
    letterSpacing: -1.2,
  },

  profileWrapper: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  profileGlow: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(251, 191, 36, 0.28)",
  },

  profileButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
  },

  profileText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 20,
  },

  heroCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    padding: 26,
    borderRadius: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  globeWrapper: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  globeGlow: {
    position: "absolute",
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(96, 165, 250, 0.35)",
    shadowColor: "#60A5FA",
    shadowOpacity: 0.9,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },

  heroIcon: {
    fontSize: 58,
  },

  aiBadge: {
    backgroundColor: "#FDE68A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  aiBadgeText: {
    color: "#92400E",
    fontWeight: "900",
    fontSize: 12,
  },

  heroTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  heroText: {
    color: "#DDD6FE",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#C4B5FD",
    marginBottom: 14,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },

  row: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
    blueCard: {
    backgroundColor: "rgba(37, 99, 235, 0.32)",
    borderColor: "#60A5FA",
  },

  orangeCard: {
    backgroundColor: "rgba(37, 99, 235, 0.32)",
    borderColor: "#60A5FA",
  },

  greenCard: {
    backgroundColor: "rgba(37, 99, 235, 0.32)",
    borderColor: "#60A5FA",
  },

  pinkCard: {
    backgroundColor: "rgba(37, 99, 235, 0.32)",
    borderColor: "#60A5FA",
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  smallIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  smallTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 5,
    letterSpacing: -0.3,
  },

  smallText: {
    fontSize: 13,
    color: "#DDD6FE",
    lineHeight: 18,
    fontWeight: "600",
  },

  tipCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#FEF3C7",
    padding: 17,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FBBF24",
    marginBottom: 22,
  },

  tipIcon: {
    fontSize: 30,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#92400E",
    marginBottom: 4,
  },

  tipText: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
    fontWeight: "700",
  },

  nextCard: {
    backgroundColor: "#ECFDF5",
    padding: 20,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#34D399",
    marginBottom: 20,
  },

  nextTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#065F46",
    marginBottom: 6,
  },

  nextText: {
    fontSize: 14,
    color: "#047857",
    lineHeight: 21,
    marginBottom: 14,
    fontWeight: "700",
  },

  outlineButton: {
    borderWidth: 0,
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#10B981",
  },

  outlineButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  startButton: {
    minHeight: 68,
    backgroundColor: "#FDE68A",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 7,
  },

  startButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },

  startButtonText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
  },

  startButtonSubtext: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "700",
    marginTop: 3,
  },

  startButtonIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  focusCard: {
    backgroundColor: "rgba(37, 99, 235, 0.32)",
    borderColor: "#60A5FA",
  },

  loadingTripText: {
  color: "#047857",
  fontSize: 15,
  fontWeight: "700",
  marginTop: 12,
},

activeTripTitle: {
  color: "#065F46",
  fontSize: 23,
  fontWeight: "900",
  marginBottom: 14,
},

activeTripDestination: {
  color: "#047857",
  fontSize: 18,
  fontWeight: "900",
  marginBottom: 10,
},

activeTripDates: {
  color: "#047857",
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 20,
},

viewTripButton: {
  minHeight: 56,
  borderRadius: 18,
  backgroundColor: "#10B981",
  justifyContent: "center",
  alignItems: "center",
},

viewTripButtonText: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "900",
},

activeTripCard: {
  backgroundColor: "rgba(37,99,235,0.32)",
  borderRadius: 28,
  padding: 20,
  borderWidth: 1.5,
  borderColor: "#60A5FA",
  marginBottom: 20,
},

activeTripIconCircle: {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: "rgba(255,255,255,0.18)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.3)",
},

activeTripContent: {
  marginBottom: 20,
},

activeTripLabel: {
  color: "#C4B5FD",
  fontSize: 13,
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: 1.3,
  marginBottom: 8,
},

activeTripDestination: {
  color: "#FFFFFF",
  fontSize: 25,
  fontWeight: "900",
  marginBottom: 9,
},

activeTripDates: {
  color: "#DDD6FE",
  fontSize: 14,
  lineHeight: 21,
  fontWeight: "700",
},

viewTripButton: {
  minHeight: 60,
  borderRadius: 20,
  paddingHorizontal: 18,
  backgroundColor: "#FDE68A",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#FEF3C7",
},

viewTripButtonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.98 }],
},

viewTripButtonText: {
  color: "#111827",
  fontSize: 17,
  fontWeight: "900",
},

viewTripIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
},

nextStepCard: {
  backgroundColor: "rgba(37,99,235,0.28)",
  borderRadius: 28,
  padding: 22,
  borderWidth: 1.5,
  borderColor: "#60A5FA",
  marginBottom: 24,
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 10,
  },
  elevation: 6,
},

nextStepIconCircle: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: "rgba(255,255,255,0.16)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.28)",
},

nextStepTitle: {
  color: "#FFFFFF",
  fontSize: 24,
  fontWeight: "900",
  marginBottom: 10,
},

nextStepText: {
  color: "#DDD6FE",
  fontSize: 15,
  lineHeight: 23,
  fontWeight: "700",
  marginBottom: 20,
},

createTripButton: {
  minHeight: 60,
  borderRadius: 20,
  paddingHorizontal: 18,
  backgroundColor: "#FDE68A",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#FEF3C7",
},

createTripButtonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.98 }],
},

createTripButtonText: {
  color: "#111827",
  fontSize: 17,
  fontWeight: "900",
},

createTripIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
},

loadingTripText: {
  color: "#DDD6FE",
  fontSize: 15,
  fontWeight: "700",
  marginTop: 12,
  textAlign: "center",
},

scrollContent: {
  paddingBottom: 60,
},

bottomSpace: {
  height: 30,
},

});