import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "DestinationScreen">;
};

export default function DestinationScreen({ navigation }: Props) {
  const [destination, setDestination] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 1 of 4</Text>
      <Text style={styles.title}>Where do you want to go?</Text>
      <Text style={styles.subtitle}>
        Enter the city or country you want to visit.
      </Text>

      <AppInput
        label="Destination"
        placeholder="Example: Milan, Italy"
        value={destination}
        onChangeText={setDestination}
      />

      <View style={styles.suggestions}>
        {["Milan", "Paris", "Istanbul", "Dubai"].map((city) => (
          <Pressable
            key={city}
            style={styles.chip}
            onPress={() => setDestination(city)}
          >
            <Text style={styles.chipText}>{city}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Next"
          onPress={() => navigation.navigate("DatesScreen")}
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
    marginBottom: 30,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  chipText: {
    color: Colors.primary,
    fontWeight: "700",
  },
  footer: {
    marginTop: "auto",
  },
});