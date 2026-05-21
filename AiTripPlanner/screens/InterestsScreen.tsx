import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "InterestsScreen">;
};

const interests = [
  "Food",
  "Museums",
  "Shopping",
  "Nature",
  "Nightlife",
  "History",
  "Photography",
  "Beaches",
  "Adventure",
  "Relaxation",
  "Local Culture",
  "Family Friendly",
];

export default function InterestsScreen({ navigation }: Props) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  function toggleInterest(interest: string) {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 4 of 4</Text>
      <Text style={styles.title}>What do you enjoy?</Text>
      <Text style={styles.subtitle}>
        Pick a few interests so AI can personalize your itinerary.
      </Text>

      <ScrollView contentContainerStyle={styles.chipsContainer}>
        {interests.map((interest) => {
          const selected = selectedInterests.includes(interest);

          return (
            <Pressable
              key={interest}
              style={[styles.chip, selected && styles.selectedChip]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[styles.chipText, selected && styles.selectedChipText]}>
                {interest}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Review Trip"
          onPress={() => navigation.navigate("ReviewTripScreen")}
        />
        <AppButton
          title="Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12 }}
        />
      </View>
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
    marginBottom: 26,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
    fontWeight: "700",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  footer: {
    marginTop: "auto",
  },
});