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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";
import { signupWithEmail } from "../services/authService";

type Props = {
  navigation: any;
};

export default function SignupScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !rePassword
    ) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    if (password !== rePassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
  setLoading(true);

  await signupWithEmail(
    firstName,
    lastName,
    email,
    password
  );

  navigation.replace("MainTabs");
}catch (error: any) {
      console.log("Signup error:", error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      }

      if (error.code === "auth/invalid-email") {
        message = "The email address is not valid.";
      }

      if (error.code === "auth/weak-password") {
        message = "Password is too weak.";
      }

      Alert.alert("Signup failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logo}>✈️</Text>
          </View>

          <Text style={styles.title}>Create your travel account</Text>

          <Text style={styles.subtitle}>
            Start planning smarter trips with AI. Save your destinations,
            budgets, and personalized travel plans in one place.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <AppInput
                label="First Name"
                placeholder="Mousa"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
            </View>

            <View style={styles.nameInput}>
              <AppInput
                label="Last Name"
                placeholder="Hawa"
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
              />
            </View>
          </View>

          <AppInput
            label="Email"
            placeholder="example@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <View style={styles.passwordWrapper}>
            <AppInput
              label="Password"
              placeholder="Create password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              disabled={loading}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={Colors.muted}
              />
            </Pressable>
          </View>

          <View style={styles.passwordWrapper}>
            <AppInput
              label="Re-password"
              placeholder="Confirm password"
              secureTextEntry={!showRePassword}
              value={rePassword}
              onChangeText={setRePassword}
              editable={!loading}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowRePassword((prev) => !prev)}
              disabled={loading}
            >
              <Ionicons
                name={showRePassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={Colors.muted}
              />
            </Pressable>
          </View>

          <Text style={styles.passwordHint}>
            Password must be at least 6 characters.
          </Text>

          {loading ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : (
            <AppButton title="Create Account" onPress={handleSignup} />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>

            <Pressable
              onPress={() => navigation.navigate("LoginScreen")}
              disabled={loading}
            >
              <Text style={styles.footerLink}> Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  back: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "700",
    marginBottom: 28,
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    fontSize: 34,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 23,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 42,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordHint: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: -4,
    marginBottom: 18,
  },
  loadingButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  footer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: Colors.muted,
    fontSize: 15,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
});