import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function TripDetailsScreen({ navigation, route }: any) {
  const trip = route?.params?.trip;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!trip) {
    return (
      <LinearGradient
        colors={["#1E1B4B", "#312E81", "#7C3AED"]}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Trip not found</Text>
          <Text style={styles.subtitle}>Please go back to your saved trips.</Text>

          <Pressable
            style={styles.mainButton}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.mainButtonText}>Back Home</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const selectedDay = trip.dailyPlan?.[selectedDayIndex];

  function openLink(url?: string) {
    if (!url) {
      Alert.alert("No link", "No reservation link available.");
      return;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open this link.");
    });
  }

  function openSkyscanner() {
    const query = encodeURIComponent(`${trip.destination} flights`);
    openLink(`https://www.skyscanner.net/transport/flights/?q=${query}`);
  }

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.badge}>Saved Trip</Text>
          <Text style={styles.title}>{trip.destination} ✨</Text>
          <Text style={styles.subtitle}>{trip.summary}</Text>

          <View style={styles.heroCard}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Destination</Text>
              <Text style={styles.infoValue}>📍 {trip.destination}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Estimated Cost</Text>
              <Text style={styles.infoValue}>💰 {trip.estimatedCost}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Total Days</Text>
              <Text style={styles.infoValue}>📅 {trip.totalDays} days</Text>
            </View>

            <Pressable style={styles.flightButton} onPress={openSkyscanner}>
              <Text style={styles.flightButtonText}>Search Flights ✈️</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>🗓 Daily Plan</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabs}
          >
            {trip.dailyPlan?.map((day: any, index: number) => {
              const selected = selectedDayIndex === index;

              return (
                <Pressable
                  key={index}
                  style={[styles.dayTab, selected && styles.activeDayTab]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  <Text
                    style={[
                      styles.dayTabText,
                      selected && styles.activeDayTabText,
                    ]}
                  >
                    Day {day.day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {selectedDay && (
            <View style={styles.dayCard}>
              <Text style={styles.dayTitle}>
                Day {selectedDay.day}
                {selectedDay.title ? ` • ${selectedDay.title}` : ""}
              </Text>

              {selectedDay.activities?.map((activity: any, index: number) => (
                <View key={index} style={styles.activityCard}>
                  <Text style={styles.timeBadge}>{activity.time || "Plan"}</Text>

                  <Text style={styles.activityPlace}>
                    {activity.place || activity.activity}
                  </Text>

                  {activity.description && (
                    <Text style={styles.activityText}>
                      {activity.description}
                    </Text>
                  )}

                  <Pressable
                    style={styles.planButton}
                    onPress={() => openLink(activity.reservationLink)}
                  >
                    <Text style={styles.planButtonText}>
                      Book / View Details
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>🏨 Hotels</Text>
          {trip.hotels?.map((hotel: any, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{hotel.name}</Text>

              {hotel.price && (
                <Text style={styles.cardText}>Price: {hotel.price}</Text>
              )}

              {hotel.rating && (
                <Text style={styles.cardText}>Rating: {hotel.rating}</Text>
              )}

              {hotel.description && (
                <Text style={styles.cardText}>{hotel.description}</Text>
              )}

              <Pressable
                style={styles.linkButton}
                onPress={() => openLink(hotel.reservationLink)}
              >
                <Text style={styles.linkButtonText}>Reserve Hotel</Text>
              </Pressable>
            </View>
          ))}

          <Text style={styles.sectionTitle}>🍽 Restaurants</Text>
          {trip.restaurants?.map((restaurant: any, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{restaurant.name}</Text>

              {restaurant.type && (
                <Text style={styles.cardText}>Type: {restaurant.type}</Text>
              )}

              {restaurant.description && (
                <Text style={styles.cardText}>{restaurant.description}</Text>
              )}

              <Pressable
                style={styles.linkButton}
                onPress={() => openLink(restaurant.reservationLink)}
              >
                <Text style={styles.linkButtonText}>Reserve Table</Text>
              </Pressable>
            </View>
          ))}

          <Text style={styles.sectionTitle}>💡 Tips</Text>
          {trip.tips?.map((tip: string, index: number) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipText}>• {tip}</Text>
            </View>
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Ionicons name="home" size={22} color="#111827" />
          <Text style={styles.backButtonText}>Back Home</Text>
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEF3C7",
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
    color: "#FDE68A",
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
  activityText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
    marginTop: 4,
    fontWeight: "700",
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 7,
  },
  cardText: {
    fontSize: 14,
    color: "#EDE9FE",
    lineHeight: 22,
    marginTop: 5,
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
  backButton: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 24,
    minHeight: 62,
    borderRadius: 22,
    backgroundColor: "#FDE68A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  backButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  mainButton: {
    marginTop: 20,
    minHeight: 62,
    borderRadius: 22,
    backgroundColor: "#FDE68A",
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
});