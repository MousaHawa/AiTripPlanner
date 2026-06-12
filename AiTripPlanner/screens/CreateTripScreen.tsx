import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "CreateTripScreen">;
};

const tabs = ["Destination", "Dates", "Budget", "Travelers", "Trip Type"];

const travelerOptions = ["Solo", "Couple", "Family", "Friends"];

const tripTypes = [
  "Relaxation",
  "Adventure",
  "Culture",
  "Food",
  "Shopping",
  "Nature",
  "Nightlife",
  "Luxury",
];

export default function CreateTripScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("");
  const [tripType, setTripType] = useState("");

  function handleNext() {
    if (activeTab === 0 && !destination.trim()) {
      Alert.alert("Missing destination", "Please enter your destination.");
      return;
    }

    if (activeTab === 1 && (!startDate.trim() || !endDate.trim())) {
      Alert.alert("Missing dates", "Please enter your start and end dates.");
      return;
    }

    if (activeTab === 2 && !budget.trim()) {
      Alert.alert("Missing budget", "Please enter your trip budget.");
      return;
    }

    if (activeTab === 3 && !travelers) {
      Alert.alert("Missing travelers", "Please choose who you are traveling with.");
      return;
    }

    if (activeTab === 4 && !tripType) {
      Alert.alert("Missing trip type", "Please choose your trip type.");
      return;
    }

    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
      return;
    }

    navigation.navigate("ReviewTripScreen");
  }

  function handleBack() {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
      return;
    }

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Create Trip</Text>
      <Text style={styles.title}>Build your AI trip</Text>
      <Text style={styles.subtitle}>
        Answer a few quick questions and we will generate a smart plan for you.
      </Text>

      <View style={styles.progressWrapper}>
        <Text style={styles.progressText}>
          Step {activeTab + 1} of {tabs.length}
        </Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((activeTab + 1) / tabs.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab, index) => {
          const selected = activeTab === index;

          return (
            <Pressable
              key={tab}
              style={[styles.tab, selected && styles.activeTab]}
              onPress={() => setActiveTab(index)}
            >
              <Text style={[styles.tabText, selected && styles.activeTabText]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.card}>
        {activeTab === 0 && (
          <View>
            <Text style={styles.cardTitle}>Where do you want to go?</Text>
            <Text style={styles.cardSubtitle}>
              Choose the city or country you want to visit.
            </Text>

            <AppInput
              label="Destination"
              placeholder="Example: Milan, Italy"
              value={destination}
              onChangeText={setDestination}
            />

            <View style={styles.chipsContainer}>
              {["Milan", "Paris", "Istanbul", "Dubai"].map((city) => (
                <Pressable
                  key={city}
                  style={[
                    styles.chip,
                    destination === city && styles.selectedChip,
                  ]}
                  onPress={() => setDestination(city)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      destination === city && styles.selectedChipText,
                    ]}
                  >
                    {city}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === 1 && (
          <View>
            <Text style={styles.cardTitle}>When are you traveling?</Text>
            <Text style={styles.cardSubtitle}>
              Add your start date and end date.
            </Text>

            <AppInput
              label="Start Date"
              placeholder="Example: 14/06/2026"
              value={startDate}
              onChangeText={setStartDate}
            />

            <AppInput
              label="End Date"
              placeholder="Example: 20/06/2026"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
        )}

        {activeTab === 2 && (
          <View>
            <Text style={styles.cardTitle}>What is your budget?</Text>
            <Text style={styles.cardSubtitle}>
              Add your total budget for the trip.
            </Text>

            <AppInput
              label="Total Budget"
              placeholder="Example: 1200"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
            />

            <View style={styles.chipsContainer}>
              {["Cheap", "Moderate", "Luxury"].map((level) => (
                <Pressable
                  key={level}
                  style={styles.chip}
                  onPress={() => setBudget(level)}
                >
                  <Text style={styles.chipText}>{level}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === 3 && (
          <View>
            <Text style={styles.cardTitle}>Who are you traveling with?</Text>
            <Text style={styles.cardSubtitle}>
              This helps us choose better activities and hotels.
            </Text>

            <View style={styles.optionsGrid}>
              {travelerOptions.map((option) => {
                const selected = travelers === option;

                return (
                  <Pressable
                    key={option}
                    style={[styles.optionCard, selected && styles.selectedOption]}
                    onPress={() => setTravelers(option)}
                  >
                    <Text style={styles.optionIcon}>
                      {option === "Solo"
                        ? "🧍"
                        : option === "Couple"
                        ? "💑"
                        : option === "Family"
                        ? "👨‍👩‍👧"
                        : "👥"}
                    </Text>

                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 4 && (
          <View>
            <Text style={styles.cardTitle}>What type of trip do you want?</Text>
            <Text style={styles.cardSubtitle}>
              Pick the style that matches your travel mood.
            </Text>

            <View style={styles.chipsContainer}>
              {tripTypes.map((type) => {
                const selected = tripType === type;

                return (
                  <Pressable
                    key={type}
                    style={[styles.chip, selected && styles.selectedChip]}
                    onPress={() => setTripType(type)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.selectedChipText,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Trip Summary</Text>
              <Text style={styles.summaryItem}>📍 Destination: {destination || "-"}</Text>
              <Text style={styles.summaryItem}>
                📅 Dates: {startDate || "-"} to {endDate || "-"}
              </Text>
              <Text style={styles.summaryItem}>💰 Budget: {budget || "-"}</Text>
              <Text style={styles.summaryItem}>👥 Travelers: {travelers || "-"}</Text>
              <Text style={styles.summaryItem}>✨ Type: {tripType || "-"}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <AppButton
          title={activeTab === tabs.length - 1 ? "Review Trip" : "Next"}
          onPress={handleNext}
        />

        <AppButton
          title={activeTab === 0 ? "Back" : "Previous"}
          variant="ghost"
          onPress={handleBack}
          style={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: Colors.background,
  },
  step: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: "800",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  progressWrapper: {
    marginBottom: 18,
  },
  progressText: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  tabsContainer: {
    gap: 10,
    paddingBottom: 18,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    color: Colors.muted,
    fontWeight: "800",
    fontSize: 13,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 22,
    minHeight: 360,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    marginBottom: 24,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.primary,
    fontWeight: "800",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  optionCard: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionIcon: {
    fontSize: 34,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "900",
  },
  selectedOptionText: {
    color: "#FFFFFF",
  },
  summaryCard: {
    marginTop: 24,
    backgroundColor: "#F8FAFC",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 18,
  },
});