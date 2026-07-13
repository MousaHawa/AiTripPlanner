    import { useEffect, useRef, useState } from "react";
    import {
      View,
      Text,
      StyleSheet,
      Pressable,
      ScrollView,
      Alert,
      Animated,
      ActivityIndicator,
      Linking,
    } from "react-native";
    import { StackNavigationProp } from "@react-navigation/stack";
    import { RootStackParamList } from "../types/navigation";
    import AppButton from "../components/ui/AppButton";
    import AppInput from "../components/ui/AppInput";
    import { LinearGradient } from "expo-linear-gradient";
    import { Ionicons } from "@expo/vector-icons";

    type Props = {
      navigation: StackNavigationProp<RootStackParamList, "CreateTripScreen">;
    };

    const API_URL = "http://10.22.143.89:8000/api/trips/generate";

    const tabs = ["Destination", "Dates", "Budget", "Travelers", "Trip Type"];

    const travelerOptions = [
      { label: "Solo", icon: "🧍", desc: "Just me" },
      { label: "Couple", icon: "💑", desc: "Two travelers" },
      { label: "Family", icon: "👨‍👩‍👧", desc: "Family trip" },
      { label: "Friends", icon: "👥", desc: "Group fun" },
    ];

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

    const stepInfo = [
      {
        title: "Where do you want to go?",
        subtitle: "Choose your destination city or country.",
      },
      {
        title: "When are you traveling?",
        subtitle: "Pick your dates, then search flights easily.",
      },
      {
        title: "What is your budget?",
        subtitle: "Add your total trip budget.",
      },
      {
        title: "Who is traveling?",
        subtitle: "This helps AI choose better activities.",
      },
      {
        title: "What is your trip style?",
        subtitle: "Pick the mood of your travel experience.",
      },
    ];

    export default function CreateTripScreen({ navigation }: Props) {
      const [activeTab, setActiveTab] = useState(0);

      const [destination, setDestination] = useState("");
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");
      const [budget, setBudget] = useState("");
      const [travelers, setTravelers] = useState("");
      const [tripTypesSelected, setTripTypesSelected] = useState<string[]>([]);

      const [selectingDate, setSelectingDate] = useState<"start" | "end">("start");
      const [calendarMonth, setCalendarMonth] = useState(new Date());

      const [loading, setLoading] = useState(false);

      const fadeAnim = useRef(new Animated.Value(1)).current;
      const slideAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(18);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }),
        ]).start();
      }, [activeTab]);
      function toggleTripType(type: string) {
  setTripTypesSelected((currentTypes) => {
    const alreadySelected = currentTypes.includes(type);

    if (alreadySelected) {
      return currentTypes.filter(
        (selectedType) => selectedType !== type
      );
    }

    if (currentTypes.length >= 3) {
      Alert.alert(
        "Maximum reached",
        "You can choose up to 3 trip types."
      );

      return currentTypes;
    }

    return [...currentTypes, type];
  });
}

      function formatDate(date: Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
    function getToday() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }

    function parseDate(dateString: string) {
      const [year, month, day] = dateString.split("-").map(Number);

      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      return date;
    }
      function getCalendarDays() {
      const year = calendarMonth.getFullYear();
      const month = calendarMonth.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const days: (Date | null)[] = [];

      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
      }

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);

        days.push(date);
      }

      return days;
    }

    function changeMonth(direction: "prev" | "next") {
      const today = getToday();

      const currentMonthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      setCalendarMonth((current) => {
        const nextMonth = new Date(
          current.getFullYear(),
          current.getMonth() + (direction === "next" ? 1 : -1),
          1
        );

        if (nextMonth < currentMonthStart) {
          return current;
        }

        return nextMonth;
      });
    }

      function selectDate(date: Date) {
      const today = getToday();

      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        Alert.alert(
          "Invalid date",
          "You cannot select a date in the past."
        );
        return;
      }

      const value = formatDate(selectedDate);

      if (selectingDate === "start") {
        setStartDate(value);

        if (endDate && parseDate(endDate) < selectedDate) {
          setEndDate("");
        }

        setSelectingDate("end");
        return;
      }

      if (startDate && selectedDate < parseDate(startDate)) {
        Alert.alert(
          "Invalid end date",
          "The end date cannot be before the start date."
        );
        return;
      }

      setEndDate(value);
    }

      function openSkyscanner() {
        if (!destination.trim() || !startDate.trim() || !endDate.trim()) {
          Alert.alert(
            "Missing details",
            "Please choose destination, start date, and end date first."
          );
          return;
        }

        const query = encodeURIComponent(`${destination} ${startDate} ${endDate}`);
        const url = `https://www.skyscanner.net/transport/flights/?q=${query}`;

        Linking.openURL(url).catch(() => {
          Alert.alert("Error", "Could not open Skyscanner.");
        });
      }

      const generateTrip = async () => {
        try {
          setLoading(true);

          console.log("🚀 Sending to backend...");

          const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              destination,
              startDate,
              endDate,
              budget,
              travelers,
              tripType: tripTypesSelected.join(", "),
              tripTypes: tripTypesSelected,
            }),
          });

          const data = await res.json();

          console.log("📦 Response:", data);

          setLoading(false);

          if (data.success) {
            navigation.navigate("ReviewTripScreen", {
              trip: {
                ...data.data,
                destination,
                startDate,
                endDate,
                budget,
                travelers,
                tripType,
              },
            });
          } else {
            Alert.alert("Error", data.error || "Failed to generate trip");
          }
        } catch (err: any) {
          setLoading(false);
          Alert.alert("Network Error", err.message);
        }
      };

      function handleNext() {
        if (activeTab === 0 && !destination.trim()) {
          return Alert.alert("Missing destination", "Please enter your destination.");
        }

        if (activeTab === 1 && (!startDate.trim() || !endDate.trim())) {
          return Alert.alert("Missing dates", "Please choose start and end dates.");
        }

        if (activeTab === 2 && !budget.trim()) {
          return Alert.alert("Missing budget", "Please enter your budget.");
        }

        if (activeTab === 3 && !travelers) {
          return Alert.alert("Missing travelers", "Please choose who is traveling.");
        }

        if (
  activeTab === 4 &&
  tripTypesSelected.length === 0
) {
  return Alert.alert(
    "Missing trip type",
    "Please choose at least one trip type."
  );
}

        if (activeTab === tabs.length - 1) {
          generateTrip();
          return;
        }

        setActiveTab(activeTab + 1);
      }

      function handleBack() {
        if (activeTab > 0) setActiveTab(activeTab - 1);
        else navigation.goBack();
      }

      const progress = ((activeTab + 1) / tabs.length) * 100;
      const calendarDays = getCalendarDays();

    const today = getToday();

    const isPreviousMonthDisabled =
      calendarMonth.getFullYear() === today.getFullYear() &&
      calendarMonth.getMonth() === today.getMonth();

      return (
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#1E1B4B", "#312E81", "#7C3AED"]}
            style={styles.container}
          >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.badge}>AI Trip Planner</Text>
            <Text style={styles.title}>Build your AI Trip ✈️</Text>
            <Text style={styles.subtitle}>
              Answer a few simple questions and we’ll create a smart itinerary for you.
            </Text>

            <View style={styles.progressWrapper}>
              <Text style={styles.progressText}>
                Step {activeTab + 1} of {tabs.length} • {tabs[activeTab]}
              </Text>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
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

            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.cardTitle}>{stepInfo[activeTab].title}</Text>
              <Text style={styles.cardSubtitle}>{stepInfo[activeTab].subtitle}</Text>

              {activeTab === 0 && (
                <>
                  <Text style={styles.inputLabel}>Destination</Text>

                  <AppInput
                    placeholder="Example: Milan, Italy"
                    value={destination}
                    onChangeText={setDestination}
                  />

                  <View style={styles.chipsContainer}>
                    {["Milan", "Paris", "Istanbul", "Dubai"].map((city) => {
                      const selected = destination === city;

                      return (
                        <Pressable
                          key={city}
                          style={[styles.chip, selected && styles.selectedChip]}
                          onPress={() => setDestination(city)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.selectedChipText,
                            ]}
                          >
                            {city}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <View style={styles.dateSelectionRow}>
                    <Pressable
                      style={[
                        styles.dateBox,
                        selectingDate === "start" && styles.activeDateBox,
                      ]}
                      onPress={() => setSelectingDate("start")}
                    >
                      <Text style={styles.dateLabel}>Start Date</Text>
                      <Text style={styles.dateValue}>
                        {startDate || "Choose start"}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.dateBox,
                        selectingDate === "end" && styles.activeDateBox,
                      ]}
                      onPress={() => setSelectingDate("end")}
                    >
                      <Text style={styles.dateLabel}>End Date</Text>
                      <Text style={styles.dateValue}>{endDate || "Choose end"}</Text>
                    </Pressable>
                  </View>

                  <View style={styles.calendarCard}>
                    <View style={styles.calendarHeader}>
                      <Pressable
      style={[
        styles.monthButton,
        isPreviousMonthDisabled && styles.disabledMonthButton,
      ]}
      onPress={() => changeMonth("prev")}
      disabled={isPreviousMonthDisabled}
    >
      <Text
        style={[
          styles.monthButtonText,
          isPreviousMonthDisabled && styles.disabledMonthButtonText,
        ]}
      >
        ‹
      </Text>
    </Pressable>

                      <Text style={styles.calendarTitle}>
                        {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
                        {calendarMonth.getFullYear()}
                      </Text>

                      <Pressable
                        style={styles.monthButton}
                        onPress={() => changeMonth("next")}
                      >
                        <Text style={styles.monthButtonText}>›</Text>
                      </Pressable>
                    </View>

                    <View style={styles.weekRow}>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <Text key={d} style={styles.weekDay}>
                          {d}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.daysGrid}>
                      {calendarDays.map((date, index) => {
  if (!date) {
    return (
      <View
        key={`empty-${index}`}
        style={styles.dayCell}
      />
    );
  }

  const value = formatDate(date);

  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  const isPastDate = normalizedDate < today;

  const isBeforeStartDate =
    selectingDate === "end" &&
    Boolean(startDate) &&
    normalizedDate < parseDate(startDate);

  const isDisabled =
    isPastDate || isBeforeStartDate;

  const selected =
    value === startDate || value === endDate;

  const isStart = value === startDate;
  const isEnd = value === endDate;

  return (
    <Pressable
      key={value}
      disabled={isDisabled}
      style={[
        styles.dayCell,
        selected && styles.selectedDay,
        isDisabled && styles.disabledDay,
      ]}
      onPress={() => selectDate(date)}
    >
      <Text
        style={[
          styles.dayText,
          selected && styles.selectedDayText,
          isDisabled && styles.disabledDayText,
        ]}
      >
        {date.getDate()}
      </Text>

      {isStart && (
        <Text style={styles.dayBadge}>
          Start
        </Text>
      )}

      {isEnd && (
        <Text style={styles.dayBadge}>
          End
        </Text>
      )}
    </Pressable>
  );
})}
                    </View>
                  </View>

                  <Pressable style={styles.flightButton} onPress={openSkyscanner}>
                    <Text style={styles.flightButtonText}>
                      Search Flights on Skyscanner ✈️
                    </Text>
                  </Pressable>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <AppInput
                    label="Budget"
                  placeholder="Example: 1200$"
                    value={budget}
                    onChangeText={setBudget}
                    keyboardType="numeric"
                  />

                  <View style={styles.chipsContainer}>
                    {["Cheap", "Moderate", "Luxury"].map((level) => {
                      const selected = budget === level;

                      return (
                        <Pressable
                          key={level}
                          style={[styles.chip, selected && styles.selectedChip]}
                          onPress={() => setBudget(level)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.selectedChipText,
                            ]}
                          >
                            {level}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}

              {activeTab === 3 && (
                <View style={styles.optionsGrid}>
                  {travelerOptions.map((option) => {
                    const selected = travelers === option.label;

                    return (
                      <Pressable
                        key={option.label}
                        onPress={() => setTravelers(option.label)}
                        style={[styles.optionCard, selected && styles.selectedOption]}
                      >
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text
                          style={[
                            styles.optionTitle,
                            selected && styles.selectedOptionText,
                          ]}
                        >
                          {option.label}
                        </Text>
                        <Text
                          style={[
                            styles.optionDesc,
                            selected && styles.selectedOptionDesc,
                          ]}
                        >
                          {option.desc}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

             {activeTab === 4 && (
  <>
    <Text style={styles.selectionCounter}>
      Choose up to 3 types • {tripTypesSelected.length}/3
    </Text>

    <View style={styles.chipsContainer}>
      {tripTypes.map((type) => {
        const selected =
          tripTypesSelected.includes(type);

        const reachedLimit =
          tripTypesSelected.length >= 3 &&
          !selected;

        return (
          <Pressable
            key={type}
            disabled={reachedLimit}
            onPress={() => toggleTripType(type)}
            style={[
              styles.chip,
              selected && styles.selectedChip,
              reachedLimit && styles.disabledChip,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                selected && styles.selectedChipText,
                reachedLimit && styles.disabledChipText,
              ]}
            >
              {selected ? "✓ " : ""}
              {type}
            </Text>
          </Pressable>
        );
      })}
    </View>

    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>
        Trip Summary
      </Text>

      <Text style={styles.summaryItem}>
        📍 {destination || "-"}
      </Text>

      <Text style={styles.summaryItem}>
        📅 {startDate || "-"} → {endDate || "-"}
      </Text>

      <Text style={styles.summaryItem}>
        💰 {budget || "-"}
      </Text>

      <Text style={styles.summaryItem}>
        👥 {travelers || "-"}
      </Text>

      <Text style={styles.summaryItem}>
        ✨{" "}
        {tripTypesSelected.length > 0
          ? tripTypesSelected.join(", ")
          : "-"}
      </Text>
    </View>
  </>
)}
            </Animated.View>

            <View style={{ height: 120 }} />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.nextButtonPressed,
              ]}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {loading
                  ? "Creating..."
                  : activeTab === tabs.length - 1
                  ? "Generate Trip ✨"
                  : "Next"}
              </Text>

              <View style={styles.nextIconCircle}>
                <Ionicons name="arrow-forward" size={21} color="#111827" />
              </View>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={handleBack}>
              <Text style={styles.cancelButtonText}>
                {activeTab === 0 ? "Cancel" : "Previous"}
              </Text>
            </Pressable>
          </View>
        </LinearGradient>

          {loading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingCard}>
                <View style={styles.loadingIconRow}>
                  <View style={styles.loadingSmallIcon}>
                    <Ionicons name="sparkles" size={18} color="#7C3AED" />
                  </View>

                  <View style={styles.loadingMainIcon}>
                    <Ionicons name="airplane" size={34} color="#111827" />
                  </View>

                  <View style={styles.loadingSmallIcon}>
                    <Ionicons name="location" size={18} color="#7C3AED" />
                  </View>
                </View>

                <ActivityIndicator
                  size="large"
                  color="#7C3AED"
                  style={{ marginBottom: 18 }}
                />

                <Text style={styles.loadingTitle}>
                  Creating your trip ✨
                </Text>

                <Text style={styles.loadingSubtitle}>
                  AI is building your hotels, restaurants, and daily plan.
                </Text>

                <View style={styles.loadingSteps}>
                  <View style={styles.loadingStep}>
                    <Ionicons name="bed-outline" size={16} color="#111827" />
                    <Text style={styles.loadingStepText}>Hotels</Text>
                  </View>

                  <View style={styles.loadingStep}>
                    <Ionicons name="restaurant-outline" size={16} color="#111827" />
                    <Text style={styles.loadingStepText}>Restaurants</Text>
                  </View>

                  <View style={styles.loadingStep}>
                    <Ionicons name="calendar-outline" size={16} color="#111827" />
                    <Text style={styles.loadingStepText}>Daily Plan</Text>
                  </View>
                </View>

                <Text style={styles.loadingFooterText}>
                  This will only take a few seconds...
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 22,
        paddingTop: 58,
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
        fontSize: 34,
        fontWeight: "900",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: -1.2,
        lineHeight: 40,
      },
      subtitle: {
        fontSize: 15,
        color: "#DDD6FE",
        lineHeight: 22,
        marginBottom: 22,
        fontWeight: "600",
      },
      progressWrapper: {
        marginBottom: 18,
      },
      progressText: {
        fontSize: 13,
        color: "#C4B5FD",
        fontWeight: "900",
        marginBottom: 8,
      },
      progressBar: {
        height: 10,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 999,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
      },
      progressFill: {
        height: "100%",
        backgroundColor: "#FDE68A",
        borderRadius: 999,
      },
      tabsContainer: {
        gap: 10,
        paddingBottom: 18,
      },
      tab: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.20)",
      },
      activeTab: {
        backgroundColor: "#FDE68A",
        borderColor: "#FDE68A",
      },
      tabText: {
        color: "#DDD6FE",
        fontWeight: "900",
        fontSize: 13,
      },
      activeTabText: {
        color: "#111827",
      },
      card: {
        backgroundColor: "rgba(255,255,255,0.14)",
        borderRadius: 30,
        padding: 22,
        minHeight: 320,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.28)",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      },
      cardTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: -0.6,
      },
      cardSubtitle: {
        fontSize: 14,
        color: "#DDD6FE",
        lineHeight: 21,
        marginBottom: 22,
        fontWeight: "600",
      },
      chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
      },
      chip: {
        paddingHorizontal: 15,
        paddingVertical: 11,
        borderRadius: 999,
        backgroundColor: "#EEF2FF",
        borderWidth: 1,
        borderColor: "#E0E7FF",
      },
      selectedChip: {
        backgroundColor: "#F97316",
        borderColor: "#F97316",
      },
      chipText: {
        color: "#4F46E5",
        fontWeight: "900",
        fontSize: 13,
      },
      selectedChipText: {
        color: "#FFFFFF",
      },
      dateSelectionRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
      },
      dateBox: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 18,
        padding: 14,
      },
      activeDateBox: {
        borderColor: "#6366F1",
        backgroundColor: "#EEF2FF",
      },
      dateLabel: {
        fontSize: 12,
        color: "#64748B",
        fontWeight: "800",
        marginBottom: 6,
      },
      dateValue: {
        fontSize: 14,
        color: "#0F172A",
        fontWeight: "900",
      },
      calendarCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 22,
        padding: 14,
      },
      calendarHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      },
      calendarTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#0F172A",
        textAlign: "center",
      },
      monthButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#EEF2FF",
        alignItems: "center",
        justifyContent: "center",
      },
      monthButtonText: {
        color: "#4F46E5",
        fontSize: 26,
        fontWeight: "900",
      },
      weekRow: {
        flexDirection: "row",
        marginBottom: 8,
      },
      weekDay: {
        flex: 1,
        textAlign: "center",
        fontSize: 11,
        color: "#94A3B8",
        fontWeight: "900",
      },
      daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
      dayCell: {
        width: "14.28%",
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        marginBottom: 6,
      },
      selectedDay: {
        backgroundColor: "#6366F1",
      },
      dayText: {
        fontSize: 14,
        fontWeight: "900",
        color: "#0F172A",
      },
      selectedDayText: {
        color: "#FFFFFF",
      },
      dayBadge: {
        fontSize: 9,
        color: "#FFFFFF",
        fontWeight: "800",
        marginTop: 2,
      },
      flightButton: {
        marginTop: 16,
        backgroundColor: "#0EA5E9",
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
      },
      flightButtonText: {
        color: "#FFFFFF",
        fontWeight: "900",
        fontSize: 14,
      },
      optionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
      },
      optionCard: {
        width: "47%",
        padding: 18,
        borderRadius: 22,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        alignItems: "center",
      },
      selectedOption: {
        backgroundColor: "#6366F1",
        borderColor: "#6366F1",
      },
      optionIcon: {
        fontSize: 31,
        marginBottom: 10,
      },
      optionTitle: {
        color: "#0F172A",
        fontWeight: "900",
        fontSize: 16,
        marginBottom: 4,
      },
      optionDesc: {
        color: "#64748B",
        fontSize: 12,
        fontWeight: "700",
      },
      selectedOptionText: {
        color: "#FFFFFF",
      },
      selectedOptionDesc: {
        color: "#E0E7FF",
      },
      summaryCard: {
        marginTop: 22,
        backgroundColor: "#F8FAFC",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
      },
      summaryTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#0F172A",
        marginBottom: 10,
      },
      summaryItem: {
        fontSize: 14,
        color: "#334155",
        marginBottom: 7,
        fontWeight: "700",
      },
      footer: {
        marginTop: 18,
        paddingTop: 0,
        paddingBottom: 10,
        backgroundColor: "transparent",
      },
      loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      },
      loadingCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        padding: 26,
        alignItems: "center",
      },
      loadingTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: "900",
        color: "#0F172A",
      },
      loadingText: {
        marginTop: 8,
        textAlign: "center",
        color: "#64748B",
        lineHeight: 21,
      },

      cancelButton: {
      marginTop: 14,
      alignItems: "center",
      paddingVertical: 12,
    },

    cancelButtonText: {
      color: "#DDD6FE",
      fontSize: 16,
      fontWeight: "900",
    },

    nextButton: {
      minHeight: 68,
      backgroundColor: "#FDE68A",
      borderRadius: 24,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "#FEF3C7",
      shadowColor: "#FBBF24",
      shadowOpacity: 0.4,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    },

    nextButtonPressed: {
      transform: [{ scale: 0.97 }],
      opacity: 0.9,
    },

    nextButtonText: {
      color: "#111827",
      fontSize: 17,
      fontWeight: "900",
    },

    nextIconCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },

    inputLabel: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
      marginBottom: 8,
    },
    disabledMonthButton: {
  opacity: 0.4,
},

disabledMonthButtonText: {
  color: "#94A3B8",
},

disabledDay: {
  opacity: 0.3,
  backgroundColor: "#F1F5F9",
},

disabledDayText: {
  color: "#94A3B8",
},
selectionCounter: {
  color: "#DDD6FE",
  fontSize: 13,
  fontWeight: "800",
  marginBottom: 14,
},

disabledChip: {
  opacity: 0.4,
  backgroundColor: "#E2E8F0",
  borderColor: "#CBD5E1",
},

disabledChipText: {
  color: "#94A3B8",
},

loadingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
  zIndex: 999,
},

loadingCard: {
  width: "100%",
  backgroundColor: "#F8FAFC",
  borderRadius: 30,
  paddingVertical: 30,
  paddingHorizontal: 24,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 12 },
  elevation: 10,
},

loadingIconRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  marginBottom: 18,
},

loadingMainIcon: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "#FDE68A",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#FEF3C7",
},

loadingSmallIcon: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#EDE9FE",
  justifyContent: "center",
  alignItems: "center",
},

loadingTitle: {
  fontSize: 24,
  fontWeight: "900",
  color: "#0F172A",
  marginBottom: 10,
  textAlign: "center",
},

loadingSubtitle: {
  fontSize: 16,
  color: "#64748B",
  textAlign: "center",
  lineHeight: 25,
  marginBottom: 22,
  fontWeight: "600",
},

loadingSteps: {
  width: "100%",
  gap: 10,
  marginBottom: 18,
},

loadingStep: {
  minHeight: 50,
  borderRadius: 16,
  backgroundColor: "#FDE68A",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderWidth: 1,
  borderColor: "#FEF3C7",
},

loadingStepText: {
  color: "#111827",
  fontSize: 15,
  fontWeight: "800",
},

loadingFooterText: {
  fontSize: 13,
  color: "#94A3B8",
  fontWeight: "700",
  textAlign: "center",
},

    });