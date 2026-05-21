import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "ForgotPasswordScreen">;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");

  function handleReset() {
    if (!email) {
      Alert.alert("Missing email", "Please enter your email.");
      return;
    }

    Alert.alert("Reset link sent", "Check your email for reset instructions.");
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we will send you a password reset link.
        </Text>
      </View>

      <AppInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <AppButton title="Send Reset Link" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
  },
  back: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "700",
  },
  header: {
    marginTop: 80,
    marginBottom: 34,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 24,
  },
});