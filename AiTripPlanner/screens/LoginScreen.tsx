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
import { loginWithEmail } from "../services/authService";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
      navigation.replace("MainTabs");
    } catch (error: any) {
      console.log("Login error:", error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/invalid-email") {
        message = "The email address is not valid.";
      }

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        message = "Wrong email or password.";
      }

      Alert.alert("Login failed", message);
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Login to continue planning your trips.</Text>
      </View>

      <View style={styles.form}>
        <AppInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <Pressable
          style={styles.forgotButton}
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
          disabled={loading}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        {loading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : (
          <AppButton title="Login" onPress={handleLogin} />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable
            onPress={() => navigation.navigate("SignupScreen")}
            disabled={loading}
          >
            <Text style={styles.footerLink}> Sign up</Text>
          </Pressable>
        </View>
      </View>
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
    marginTop: 70,
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
  form: {
    width: "100%",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: Colors.primary,
    fontWeight: "700",
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
    marginTop: 24,
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