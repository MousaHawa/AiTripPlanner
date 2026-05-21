import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "SignupScreen">;
};

export default function SignupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup() {
    if (!fullName || !email || !password) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    navigation.replace("MainTabs");
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Join AI Trip Planner and start building your next trip.
        </Text>
      </View>

      <View style={styles.form}>
        <AppInput
          label="Full Name"
          placeholder="Enter your name"
          value={fullName}
          onChangeText={setFullName}
        />

        <AppInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <AppInput
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <AppButton title="Create Account" onPress={handleSignup} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.footerLink}> Login</Text>
          </Pressable>
        </View>
      </View>
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
    marginTop: 54,
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