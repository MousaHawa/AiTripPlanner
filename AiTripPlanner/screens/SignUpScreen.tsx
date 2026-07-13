import { useEffect, useRef, useState } from "react";
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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { signupWithEmail } from "../services/authService";

type Props = {
  navigation: any;
};

type PasswordRequirementProps = {
  valid: boolean;
  text: string;
};

function PasswordRequirement({
  valid,
  text,
}: PasswordRequirementProps) {
  return (
    <View style={styles.requirementRow}>
      <Ionicons
        name={valid ? "checkmark-circle" : "ellipse-outline"}
        size={17}
        color={valid ? "#86EFAC" : "#C4B5FD"}
      />

      <Text
        style={[
          styles.requirementText,
          valid && styles.validRequirementText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

export default function SignupScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(35)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const loadingScale = useRef(new Animated.Value(1)).current;

  const hasMinimumLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  const passwordsMatch =
    rePassword.length > 0 && password === rePassword;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, logoScale]);

  useEffect(() => {
    if (!loading) {
      loadingScale.stopAnimation();
      loadingScale.setValue(1);
      return;
    }

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingScale, {
          toValue: 0.97,
          duration: 550,
          useNativeDriver: true,
        }),

        Animated.timing(loadingScale, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [loading, loadingScale]);

  function isStrongPassword(value: string) {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    return strongPasswordRegex.test(value);
  }

  async function handleSignup() {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !rePassword
    ) {
      Alert.alert(
        "Missing fields",
        "Please fill all fields."
      );
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (password !== rePassword) {
      Alert.alert(
        "Password mismatch",
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await signupWithEmail(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password
      );

      navigation.replace("MainTabs");
    } catch (error: any) {
      console.log("Signup error:", error);

      let message =
        "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      }

      if (error.code === "auth/invalid-email") {
        message = "The email address is not valid.";
      }

      if (error.code === "auth/weak-password") {
        message =
          "Password is too weak. Please choose a stronger password.";
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
      <LinearGradient
        colors={["#1E1B4B", "#312E81", "#7C3AED"]}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Animated.View
            style={[
              styles.hero,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoCircle,
                {
                  transform: [
                    {
                      scale: logoScale,
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="airplane"
                size={36}
                color="#111827"
              />
            </Animated.View>

            <Text style={styles.badge}>
              Join AI Trip Planner
            </Text>

            <Text style={styles.title}>
              Create your travel account
            </Text>

            <Text style={styles.subtitle}>
              Start planning smarter trips with AI and save all
              your favorite destinations in one place.
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.nameRow}>
              <View style={styles.nameInput}>
                <Text style={styles.inputLabel}>
                  First Name
                </Text>

                <AppInput
                  placeholder="Mousa"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.nameInput}>
                <Text style={styles.inputLabel}>
                  Last Name
                </Text>

                <AppInput
                  placeholder="Hawa"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Email</Text>

            <AppInput
              placeholder="example@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.passwordWrapper}>
              <Text style={styles.inputLabel}>
                Password
              </Text>

              <AppInput
                placeholder="Create password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && styles.eyeButtonPressed,
                ]}
                onPress={() =>
                  setShowPassword((previous) => !previous)
                }
                disabled={loading}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#64748B"
                />
              </Pressable>
            </View>

            <View style={styles.passwordRequirements}>
              <PasswordRequirement
                valid={hasMinimumLength}
                text="At least 8 characters"
              />

              <PasswordRequirement
                valid={hasUppercase}
                text="One uppercase letter"
              />

              <PasswordRequirement
                valid={hasLowercase}
                text="One lowercase letter"
              />

              <PasswordRequirement
                valid={hasNumber}
                text="One number"
              />

              <PasswordRequirement
                valid={hasSpecialCharacter}
                text="One special character"
              />
            </View>

            <View style={styles.passwordWrapper}>
              <Text style={styles.inputLabel}>
                Confirm Password
              </Text>

              <AppInput
                placeholder="Confirm password"
                secureTextEntry={!showRePassword}
                value={rePassword}
                onChangeText={setRePassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && styles.eyeButtonPressed,
                ]}
                onPress={() =>
                  setShowRePassword((previous) => !previous)
                }
                disabled={loading}
              >
                <Ionicons
                  name={
                    showRePassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#64748B"
                />
              </Pressable>
            </View>

            {rePassword.length > 0 && (
              <View style={styles.matchRow}>
                <Ionicons
                  name={
                    passwordsMatch
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={17}
                  color={
                    passwordsMatch
                      ? "#86EFAC"
                      : "#FCA5A5"
                  }
                />

                <Text
                  style={[
                    styles.matchText,
                    passwordsMatch
                      ? styles.matchSuccessText
                      : styles.matchErrorText,
                  ]}
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </Text>
              </View>
            )}

            {loading ? (
              <Animated.View
                style={[
                  styles.loadingButton,
                  {
                    transform: [
                      {
                        scale: loadingScale,
                      },
                    ],
                  },
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color="#111827"
                />

                <Text style={styles.loadingText}>
                  Creating account...
                </Text>
              </Animated.View>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.createAccountButton,
                  pressed && styles.createAccountButtonPressed,
                ]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.createAccountButtonText}>
                  Create Account
                </Text>

                <View style={styles.createAccountIconCircle}>
                  <Ionicons
                    name="person-add-outline"
                    size={21}
                    color="#111827"
                  />
                </View>
              </Pressable>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate("LoginScreen")
                }
                disabled={loading}
                style={({ pressed }) => [
                  pressed && styles.footerLinkPressed,
                ]}
              >
                <Text style={styles.footerLink}>
                  {" "}
                  Login
                </Text>
              </Pressable>
            </View>
          </Animated.View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    marginBottom: 26,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  hero: {
    alignItems: "center",
    marginBottom: 26,
  },

  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 8,
  },

  badge: {
    backgroundColor: "rgba(253,230,138,0.18)",
    color: "#FDE68A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
    overflow: "hidden",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 38,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    textAlign: "center",
    lineHeight: 23,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },

  nameRow: {
    flexDirection: "row",
    gap: 12,
  },

  nameInput: {
    flex: 1,
  },

  inputLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  passwordWrapper: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 54,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  eyeButtonPressed: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
  },

  passwordRequirements: {
    marginTop: -2,
    marginBottom: 20,
    gap: 6,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  requirementText: {
    color: "#DDD6FE",
    fontSize: 13,
    fontWeight: "600",
  },

  validRequirementText: {
    color: "#86EFAC",
  },

  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: -2,
    marginBottom: 20,
  },

  matchText: {
    fontSize: 13,
    fontWeight: "700",
  },

  matchSuccessText: {
    color: "#86EFAC",
  },

  matchErrorText: {
    color: "#FCA5A5",
  },

  loadingButton: {
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },

  loadingText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },

  footer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    color: "#DDD6FE",
    fontSize: 15,
    fontWeight: "600",
  },

  footerLink: {
    color: "#FDE68A",
    fontSize: 15,
    fontWeight: "900",
  },

  footerLinkPressed: {
    opacity: 0.6,
  },

  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  bottomSpace: {
    height: 50,
  },
  createAccountButton: {
  minHeight: 62,
  borderRadius: 20,
  paddingHorizontal: 20,
  backgroundColor: "#FDE68A",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: "#FEF3C7",
  shadowColor: "#FBBF24",
  shadowOpacity: 0.35,
  shadowRadius: 14,
  shadowOffset: {
    width: 0,
    height: 0,
  },
  elevation: 6,
},

createAccountButtonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.97 }],
},

createAccountButtonText: {
  color: "#111827",
  fontSize: 17,
  fontWeight: "900",
},

createAccountIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
},

});