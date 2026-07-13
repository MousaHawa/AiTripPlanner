import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import AppButton from "../components/ui/AppButton";
import { auth, db } from "../services/firebase";
import { LinearGradient } from "expo-linear-gradient";

export default function ReviewTripScreen({
  navigation,
  route,
}: any) {
  const trip = route?.params?.trip;

  const [selectedDayIndex, setSelectedDayIndex] =
    useState(0);

  const [isAtBottom, setIsAtBottom] =
    useState(false);

  const dailyPlan = useMemo(
    () =>
      Array.isArray(trip?.dailyPlan)
        ? trip.dailyPlan
        : [],
    [trip]
  );

  const hotels = useMemo(() => {
    if (Array.isArray(trip?.hotels)) {
      return trip.hotels;
    }

    if (Array.isArray(trip?.hotelSuggestions)) {
      return trip.hotelSuggestions;
    }

    return [];
  }, [trip]);

  const restaurants = useMemo(
    () =>
      Array.isArray(trip?.restaurants)
        ? trip.restaurants
        : [],
    [trip]
  );

  const tips = useMemo(
    () =>
      Array.isArray(trip?.tips)
        ? trip.tips
        : [],
    [trip]
  );

  if (!trip) {
    return (
      <LinearGradient
        colors={[
          "#1E1B4B",
          "#312E81",
          "#7C3AED",
        ]}
        style={styles.container}
      >
        <View style={styles.missingTripContainer}>
          <Text style={styles.title}>
            No trip found
          </Text>

          <Text style={styles.subtitle}>
            Please go back and generate a trip.
          </Text>

          <AppButton
            title="Back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </LinearGradient>
    );
  }

  const selectedDay =
    dailyPlan[selectedDayIndex];

  function getActivityTitle(activity: any) {
    if (typeof activity === "string") {
      return activity;
    }

    return (
      activity?.title ||
      activity?.place ||
      activity?.activity ||
      "Planned activity"
    );
  }

  function getActivityLink(activity: any) {
    if (typeof activity === "string") {
      return "";
    }

    return (
      activity?.bookingUrl ||
      activity?.reservationLink ||
      activity?.url ||
      ""
    );
  }

  function getHotelLink(hotel: any) {
    return (
      hotel?.bookingUrl ||
      hotel?.reservationLink ||
      hotel?.url ||
      ""
    );
  }

  function getRestaurantLink(
    restaurant: any
  ) {
    return (
      restaurant?.bookingUrl ||
      restaurant?.reservationLink ||
      restaurant?.url ||
      ""
    );
  }

  async function openLink(url?: string) {
    if (!url) {
      Alert.alert(
        "No link",
        "No reservation link is available."
      );
      return;
    }

    try {
      const supported =
        await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "Invalid link",
          "This reservation link cannot be opened."
        );
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Error",
        "Could not open this link."
      );
    }
  }

  function openSkyscanner() {
    const query = encodeURIComponent(
      `${trip.destination || ""} flights`
    );

    const url =
      `https://www.skyscanner.net/transport/flights/?q=${query}`;

    openLink(url);
  }

  async function saveTripToFirebase() {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(
          "Not logged in",
          "Please log in before saving a trip."
        );
        return;
      }

      await addDoc(
        collection(
          db,
          "users",
          user.uid,
          "trips"
        ),
        {
          ...trip,
          userId: user.uid,
          createdAt: serverTimestamp(),
        }
      );

      Alert.alert(
        "Saved",
        "Your trip was saved successfully."
      );

      navigation.navigate("MainTabs", {
        screen: "TripsTab",
      });
    } catch (error: any) {
      console.log("SAVE ERROR:", error);

      Alert.alert(
        "Save Failed",
        error.message ||
          "Could not save trip."
      );
    }
  }

  function askSaveTrip() {
    Alert.alert(
      "Save Trip?",
      "Do you want to save this trip to your trips list?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () =>
            navigation.navigate("MainTabs"),
        },
        {
          text: "Yes, Save",
          onPress: saveTripToFirebase,
        },
      ]
    );
  }

  return (
    <LinearGradient
      colors={[
        "#1E1B4B",
        "#312E81",
        "#7C3AED",
      ]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={({ nativeEvent }) => {
          const {
            layoutMeasurement,
            contentOffset,
            contentSize,
          } = nativeEvent;

          const reachedBottom =
            layoutMeasurement.height +
              contentOffset.y >=
            contentSize.height - 40;

          setIsAtBottom(reachedBottom);
        }}
      >
        <Text style={styles.badge}>
          AI Trip Plan
        </Text>

        <Text style={styles.title}>
          Your Trip to{" "}
          {trip.destination ||
            "Your Destination"}{" "}
          ✨
        </Text>

        <Text style={styles.subtitle}>
          {trip.summary ||
            "Your personalized AI travel plan."}
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Destination
            </Text>

            <Text style={styles.infoValue}>
              📍{" "}
              {trip.destination ||
                "Unknown destination"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Estimated Cost
            </Text>

            <Text style={styles.infoValue}>
              💰{" "}
              {trip.estimatedCost ||
                trip.budget ||
                "Not available"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Total Days
            </Text>

            <Text style={styles.infoValue}>
              📅{" "}
              {trip.totalDays ||
                dailyPlan.length ||
                "-"}{" "}
              days
            </Text>
          </View>

          {trip.startDate ||
          trip.endDate ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>
                Travel Dates
              </Text>

              <Text style={styles.infoValue}>
                🗓 {trip.startDate || "-"} →{" "}
                {trip.endDate || "-"}
              </Text>
            </View>
          ) : null}

          <Pressable
            style={styles.flightButton}
            onPress={openSkyscanner}
          >
            <Text
              style={styles.flightButtonText}
            >
              Search Flights ✈️
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          🗓 Daily Plan
        </Text>

        {dailyPlan.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.dayTabs
              }
            >
              {dailyPlan.map(
                (day: any, index: number) => {
                  const selected =
                    selectedDayIndex === index;

                  return (
                    <Pressable
                      key={`${day.day}-${index}`}
                      style={[
                        styles.dayTab,
                        selected &&
                          styles.activeDayTab,
                      ]}
                      onPress={() =>
                        setSelectedDayIndex(index)
                      }
                    >
                      <Text
                        style={[
                          styles.dayTabText,
                          selected &&
                            styles.activeDayTabText,
                        ]}
                      >
                        Day {day.day || index + 1}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </ScrollView>

            {selectedDay && (
              <View style={styles.dayCard}>
                <Text style={styles.dayTitle}>
                  Day{" "}
                  {selectedDay.day ||
                    selectedDayIndex + 1}
                  {selectedDay.title
                    ? ` • ${selectedDay.title}`
                    : ""}
                </Text>

                {Array.isArray(
                  selectedDay.activities
                ) &&
                selectedDay.activities.length >
                  0 ? (
                  selectedDay.activities.map(
                    (
                      activity: any,
                      index: number
                    ) => {
                      const activityTitle =
                        getActivityTitle(
                          activity
                        );

                      const activityLink =
                        getActivityLink(
                          activity
                        );

                      const isStringActivity =
                        typeof activity ===
                        "string";

                      return (
                        <View
                          key={`${activityTitle}-${index}`}
                          style={
                            styles.activityCard
                          }
                        >
                          <Text
                            style={
                              styles.timeBadge
                            }
                          >
                            {isStringActivity
                              ? "Plan"
                              : activity.time ||
                                "Plan"}
                          </Text>

                          <Text
                            style={
                              styles.activityPlace
                            }
                          >
                            {activityTitle}
                          </Text>

                          {!isStringActivity &&
                          activity.description ? (
                            <Text
                              style={
                                styles.cardText
                              }
                            >
                              {
                                activity.description
                              }
                            </Text>
                          ) : null}

                          {!isStringActivity &&
                          activity.location ? (
                            <Text
                              style={
                                styles.activityMeta
                              }
                            >
                              📍{" "}
                              {activity.location}
                            </Text>
                          ) : null}

                          {activityLink ? (
                            <Pressable
                              style={
                                styles.planButton
                              }
                              onPress={() =>
                                openLink(
                                  activityLink
                                )
                              }
                            >
                              <Text
                                style={
                                  styles.planButtonText
                                }
                              >
                                Book / View
                                Details
                              </Text>
                            </Pressable>
                          ) : (
                            <View
                              style={
                                styles.noLinkBox
                              }
                            >
                              <Text
                                style={
                                  styles.noLinkText
                                }
                              >
                                No booking required
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    }
                  )
                ) : (
                  <Text style={styles.emptyText}>
                    No activities are available
                    for this day.
                  </Text>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptySectionCard}>
            <Text style={styles.emptyText}>
              No daily plan is available.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          🏨 Hotels
        </Text>

        {hotels.length > 0 ? (
          hotels.map(
            (hotel: any, index: number) => {
              const hotelLink =
                getHotelLink(hotel);

              return (
                <View
                  key={`${hotel.name}-${index}`}
                  style={styles.card}
                >
                  <Text style={styles.cardTitle}>
                    {hotel.name ||
                      "Hotel suggestion"}
                  </Text>

                  {hotel.price ||
                  hotel.priceRange ? (
                    <Text
                      style={styles.hotelText}
                    >
                      Price:{" "}
                      {hotel.price ||
                        hotel.priceRange}
                    </Text>
                  ) : null}

                  {hotel.rating ? (
                    <Text
                      style={styles.hotelText}
                    >
                      Rating: {hotel.rating}
                    </Text>
                  ) : null}

                  {hotel.description ? (
                    <Text
                      style={styles.hotelText}
                    >
                      {hotel.description}
                    </Text>
                  ) : null}

                  {hotelLink ? (
                    <Pressable
                      style={styles.linkButton}
                      onPress={() =>
                        openLink(hotelLink)
                      }
                    >
                      <Text
                        style={
                          styles.linkButtonText
                        }
                      >
                        Reserve Hotel
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={styles.noLinkBox}>
                      <Text
                        style={styles.noLinkText}
                      >
                        Reservation link not
                        available
                      </Text>
                    </View>
                  )}
                </View>
              );
            }
          )
        ) : (
          <View style={styles.emptySectionCard}>
            <Text style={styles.emptyText}>
              No hotel suggestions are
              available.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          🍽 Restaurants
        </Text>

        {restaurants.length > 0 ? (
          restaurants.map(
            (
              restaurant: any,
              index: number
            ) => {
              const restaurantLink =
                getRestaurantLink(
                  restaurant
                );

              return (
                <View
                  key={`${restaurant.name}-${index}`}
                  style={styles.card}
                >
                  <Text style={styles.cardTitle}>
                    {restaurant.name ||
                      "Restaurant suggestion"}
                  </Text>

                  {restaurant.type ||
                  restaurant.cuisine ? (
                    <Text
                      style={
                        styles.restaurantText
                      }
                    >
                      Cuisine:{" "}
                      {restaurant.type ||
                        restaurant.cuisine}
                    </Text>
                  ) : null}

                  {restaurant.description ? (
                    <Text
                      style={
                        styles.restaurantText
                      }
                    >
                      {
                        restaurant.description
                      }
                    </Text>
                  ) : null}

                  {restaurantLink ? (
                    <Pressable
                      style={styles.linkButton}
                      onPress={() =>
                        openLink(
                          restaurantLink
                        )
                      }
                    >
                      <Text
                        style={
                          styles.linkButtonText
                        }
                      >
                        Reserve Table
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={styles.noLinkBox}>
                      <Text
                        style={styles.noLinkText}
                      >
                        Reservation link not
                        available
                      </Text>
                    </View>
                  )}
                </View>
              );
            }
          )
        ) : (
          <View style={styles.emptySectionCard}>
            <Text style={styles.emptyText}>
              No restaurant suggestions are
              available.
            </Text>
          </View>
        )}

        {tips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              💡 Tips
            </Text>

            {tips.map(
              (tip: string, index: number) => (
                <View
                  key={`${tip}-${index}`}
                  style={styles.tipCard}
                >
                  <Text style={styles.tipText}>
                    • {tip}
                  </Text>
                </View>
              )
            )}
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          isAtBottom
            ? styles.footerBottom
            : styles.footerFloating,
        ]}
      >
        <Pressable
          style={[
            styles.finishButton,
            isAtBottom
              ? styles.finishButtonLarge
              : styles.finishButtonSmall,
          ]}
          onPress={askSaveTrip}
        >
          <Text style={styles.finishButtonText}>
            {isAtBottom
              ? "Finish Trip ✨"
              : "✓"}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 60,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(253, 230, 138, 0.18)",
    color: "#FDE68A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(253, 230, 138, 0.35)",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 10,
    letterSpacing: -1,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    lineHeight: 22,
    marginBottom: 22,
    fontWeight: "600",
  },
    heroCard: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 30,
    padding: 22,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  infoBox: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.20)",
  },
  infoLabel: {
    fontSize: 12,
    color: "#C4B5FD",
    fontWeight: "900",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  flightButton: {
    marginTop: 16,
    minHeight: 62,
    backgroundColor: "#FDE68A",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  flightButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 12,
    marginTop: 10,
  },
  dayTabs: {
    gap: 10,
    paddingBottom: 14,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    marginRight: 10,
  },
  activeDayTab: {
    backgroundColor: "#FDE68A",
    borderColor: "#FDE68A",
  },
  dayTabText: {
    color: "#DDD6FE",
    fontSize: 14,
    fontWeight: "900",
  },
  activeDayTabText: {
    color: "#111827",
  },
  dayCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  activityCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  timeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    marginBottom: 8,
  },
  activityPlace: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },
  planButton: {
    marginTop: 12,
    backgroundColor: "#EEF2FF",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  planButtonText: {
    color: "#4F46E5",
    fontWeight: "900",
    fontSize: 13,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 7,
  },
  cardText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
    marginTop: 4,
    fontWeight: "700",
  },
  linkButton: {
    marginTop: 14,
    backgroundColor: "#FDE68A",
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 14,
  },
  tipCard: {
    backgroundColor: "rgba(253,230,138,0.14)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
  },
  tipText: {
    color: "#FEF3C7",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },

  finishButton: {
  minHeight: 62,
  backgroundColor: "#FDE68A",
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
},

finishButtonText: {
  color: "#111827",
  fontSize: 17,
  fontWeight: "900",
},

hotelText: {
  fontSize: 14,
  color: "#EDE9FE",
  lineHeight: 22,
  marginTop: 5,
  fontWeight: "700",
},

restaurantText: {
  fontSize: 14,
  color: "#EDE9FE",
  lineHeight: 22,
  marginTop: 5,
  fontWeight: "700",
},

footerFloating: {
  position: "absolute",
  right: 22,
  bottom: 28,
  left: undefined,
},

footerBottom: {
  position: "absolute",
  left: 22,
  right: 22,
  bottom: 24,
},

finishButton: {
  backgroundColor: "#FDE68A",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "#FEF3C7",
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
},

finishButtonSmall: {
  width: 58,
  height: 58,
  borderRadius: 29,
},

finishButtonLarge: {
  width: "100%",
  minHeight: 66,
  borderRadius: 24,
},

finishButtonText: {
  color: "#111827",
  fontSize: 18,
  fontWeight: "900",
},

missingTripContainer: {
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 22,
},

activityMeta: {
  color: "#64748B",
  fontSize: 13,
  fontWeight: "700",
  marginTop: 8,
},

noLinkBox: {
  marginTop: 14,
  minHeight: 48,
  borderRadius: 16,
  backgroundColor: "#EEF2FF",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 14,
},

noLinkText: {
  color: "#6366F1",
  fontSize: 13,
  fontWeight: "800",
  textAlign: "center",
},

emptySectionCard: {
  backgroundColor: "rgba(255,255,255,0.14)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.28)",
  borderRadius: 22,
  padding: 20,
  marginBottom: 16,
},

emptyText: {
  color: "#DDD6FE",
  fontSize: 14,
  lineHeight: 21,
  fontWeight: "700",
  textAlign: "center",
},

});