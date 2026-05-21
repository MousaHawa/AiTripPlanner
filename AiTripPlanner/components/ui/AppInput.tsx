import { TextInput, StyleSheet, TextInputProps, View, Text } from "react-native";
import { Colors } from "../../constants/colors";

type AppInputProps = TextInputProps & {
  label: string;
};

export default function AppInput({ label, ...props }: AppInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
});