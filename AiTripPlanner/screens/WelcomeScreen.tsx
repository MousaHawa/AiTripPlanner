import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../types/navigation";
import AppButton from "../components/ui/AppButton";

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    "WelcomeScreen"
  >;
};

export default function WelcomeScreen({
  navigation,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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

      Animated.spring(cardTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    fadeAnim,
    slideAnim,
    logoScale,
    cardTranslateY,
  ]);

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.top,
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
              size={42}
              color="#111827"
            />
          </Animated.View>

          <Text style={styles.badge}>
            AI Trip Planner
          </Text>

          <Text style={styles.title}>
            Plan your next trip smarter
          </Text>

          <Text style={styles.subtitle}>
            Build personalized trips based on your budget,
            destination, dates, travel style, and interests.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="sparkles"
                  size={18}
                  color="#111827"
                />
              </View>

              <Text style={styles.featureText}>
                AI-powered travel plans
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="location"
                  size={18}
                  color="#111827"
                />
              </View>

              <Text style={styles.featureText}>
                Personalized destinations
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="heart"
                  size={18}
                  color="#111827"
                />
              </View>

              <Text style={styles.featureText}>
                Save your favorite trips
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: cardTranslateY,
                },
              ],
            },
          ]}
        >
          <View style={styles.cardIconCircle}>
            <Ionicons
              name="compass"
              size={28}
              color="#FDE68A"
            />
          </View>

          <Text style={styles.cardTitle}>
            Start your journey
          </Text>

          <Text style={styles.cardText}>
            Create an account or log in to save your trips and
            receive personalized AI travel suggestions.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.createAccountButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              navigation.navigate("SignupScreen")
            }
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

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              navigation.navigate("LoginScreen")
            }
          >
            <Ionicons
              name="log-in-outline"
              size={21}
              color="#FDE68A"
            />

            <Text style={styles.loginButtonText}>
              Login
            </Text>
          </Pressable>

          <Text style={styles.termsText}>
            By continuing, you agree to use AI Trip Planner
            responsibly.
          </Text>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 30,
  },

  top: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FDE68A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
  },

  badge: {
    backgroundColor: "rgba(253,230,138,0.18)",
    color: "#FDE68A",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
    overflow: "hidden",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 40,
    letterSpacing: -1.2,
    paddingHorizontal: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    textAlign: "center",
    lineHeight: 23,
    fontWeight: "600",
    paddingHorizontal: 8,
  },

  featuresContainer: {
    width: "100%",
    marginTop: 24,
    gap: 10,
  },

  featureItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },

  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  featureText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },

  card: {
    width: "100%",
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

  cardIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(253,230,138,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
  },

  cardTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: "#DDD6FE",
    lineHeight: 21,
    fontWeight: "600",
    marginBottom: 22,
  },

  loginButton: {
    minHeight: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.45)",
    backgroundColor: "rgba(253,230,138,0.12)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  loginButtonText: {
    color: "#FDE68A",
    fontSize: 16,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  termsText: {
    color: "#C4B5FD",
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
    marginTop: 16,
    paddingHorizontal: 8,
  },

  bottomSpace: {
    height: 20,
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
  marginBottom: 12,
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