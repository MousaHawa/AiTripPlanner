import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "BudgetScreen">;
};

const budgetTypes = ["Cheap", "Moderate", "Luxury"];

export default function BudgetScreen({ navigation }: Props) {
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("Moderate");

  return (
    <View style={styles.container}>
      <Text style={styles.step}>Step 3 of 4</Text>
      <Text style={styles.title}>What is your budget?</Text>
      <Text style={styles.subtitle}>
        This helps AI choose hotels, activities, and transportation.
      </Text>

      <AppInput
        label="Total Budget"
        placeholder="Example: 1200"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      <Text style={styles.label}>Budget Style</Text>

      <View style={styles.options}>
        {budgetTypes.map((type) => {
          const selected = budgetType === type;

          return (
            <Pressable
              key={type}
              style={[styles.option, selected && styles.selectedOption]}
              onPress={() => setBudgetType(type)}
            >
              <Text style={[styles.optionText, selected && styles.selectedText]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Next"
          onPress={() => navigation.navigate("InterestsScreen")}
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
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 12,
  },
  options: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.card,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.text,
    fontWeight: "700",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  footer: {
    marginTop: "auto",
  },
});