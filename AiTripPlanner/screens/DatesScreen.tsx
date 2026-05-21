import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "DatesScreen">;
};

export default function DatesScreen({ navigation }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 2 of 4</Text>
      <Text style={styles.title}>When are you traveling?</Text>
      <Text style={styles.subtitle}>
        Add your travel dates and number of travelers.
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

      <AppInput
        label="Number of Travelers"
        placeholder="Example: 2"
        keyboardType="numeric"
        value={travelers}
        onChangeText={setTravelers}
      />

      <View style={styles.footer}>
        <AppButton
          title="Next"
          onPress={() => navigation.navigate("BudgetScreen")}
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
    marginBottom: 30,
  },
  footer: {
    marginTop: "auto",
  },
});