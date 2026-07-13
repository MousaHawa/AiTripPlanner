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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { loginWithEmail } from "../services/authService";

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(35)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const loadingScale = useRef(new Animated.Value(1)).current;

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

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing fields",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      await loginWithEmail(email.trim(), password);

      navigation.replace("MainTabs");
    } catch (error: any) {
      console.log("Login error:", error);

      let message =
        "Something went wrong. Please try again.";

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

      if (error.code === "auth/too-many-requests") {
        message =
          "Too many login attempts. Please try again later.";
      }

      Alert.alert("Login failed", message);
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
              AI Trip Planner
            </Text>

            <Text style={styles.title}>
              Welcome back
            </Text>

            <Text style={styles.subtitle}>
              Login to continue planning smarter trips and
              exploring new destinations.
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
            <Text style={styles.inputLabel}>Email</Text>

            <AppInput
              placeholder="Enter your email"
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
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.eyeButton,
                  pressed && styles.eyeButtonPressed,
                ]}
                onPress={() =>
                  setShowPassword(
                    (previousValue) => !previousValue
                  )
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

            <Pressable
              style={({ pressed }) => [
                styles.forgotButton,
                pressed && styles.linkPressed,
              ]}
              onPress={() =>
                navigation.navigate(
                  "ForgotPasswordScreen"
                )
              }
              disabled={loading}
            >
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </Pressable>

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
                  Logging in...
                </Text>
              </Animated.View>
            ) : (
             <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.loginButtonPressed,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  Login
                </Text>

                <View style={styles.loginIconCircle}>
                  <Ionicons
                    name="log-in-outline"
                    size={21}
                    color="#111827"
                  />
                </View>
              </Pressable>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate("SignupScreen")
                }
                disabled={loading}
                style={({ pressed }) => [
                  pressed && styles.linkPressed,
                ]}
              >
                <Text style={styles.footerLink}>
                  {" "}
                  Sign up
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
    flexGrow: 1,
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
    marginBottom: 34,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
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
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    textAlign: "center",
    lineHeight: 23,
    fontWeight: "600",
    paddingHorizontal: 8,
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
  top: 50,
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: "center",
  alignItems: "center",
  
},

  eyeButtonPressed: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -2,
    marginBottom: 22,
    paddingVertical: 4,
  },

  forgotText: {
    color: "#FDE68A",
    fontSize: 14,
    fontWeight: "900",
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
    marginTop: 24,
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

  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  linkPressed: {
    opacity: 0.6,
  },

  bottomSpace: {
    height: 50,
  },

  loginButton: {
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

loginButtonPressed: {
  opacity: 0.85,
  transform: [{ scale: 0.97 }],
},

loginButtonText: {
  color: "#111827",
  fontSize: 17,
  fontWeight: "900",
},

loginIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
},

});