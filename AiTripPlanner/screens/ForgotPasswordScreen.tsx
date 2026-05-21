import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";
import { resetPassword } from "../services/authService";

type Props = {
  navigation: any;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert("Reset link sent", "Check your email for reset instructions.");
      navigation.goBack();
    } catch (error: any) {
      console.log("Reset password error:", error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/invalid-email") {
        message = "The email address is not valid.";
      }

      Alert.alert("Reset failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable onPress={() => navigation.goBack()} disabled={loading}>
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
        editable={!loading}
      />

      {loading ? (
        <View style={styles.loadingButton}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : (
        <AppButton title="Send Reset Link" onPress={handleReset} />
      )}
    </KeyboardAvoidingView>
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
  loadingButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
});