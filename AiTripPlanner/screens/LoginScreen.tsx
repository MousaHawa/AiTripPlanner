import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Colors } from "../constants/colors";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "LoginScreen">;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
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
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.forgotButton}
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <AppButton title="Login" onPress={handleLogin} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => navigation.navigate("SignupScreen")}>
            <Text style={styles.footerLink}> Sign up</Text>
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
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: Colors.primary,
    fontWeight: "700",
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
  form: {
    width: "100%",
  },
});