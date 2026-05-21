import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
}: AppButtonProps) {
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        variant === "primary" && styles.primaryButton,
        isOutline && styles.outlineButton,
        isGhost && styles.ghostButton,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.primaryText,
          isOutline && styles.outlineText,
          isGhost && styles.ghostText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
});