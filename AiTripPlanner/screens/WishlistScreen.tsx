import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  navigation: any;
};

type WishlistItem = {
  id: string;
  destination?: string;
  city?: string;
  country?: string;
  reason?: string;
  emoji?: string;
};

function normalizeCity(city: string) {
  return city.trim().toLowerCase();
}

export default function WishlistScreen({ navigation }: Props) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] =
    useState<string | null>(null);

  async function loadWishlist() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setWishlist([]);
        return;
      }

      const wishlistRef = collection(
        db,
        "users",
        user.uid,
        "wishlist"
      );

      const wishlistQuery = query(
        wishlistRef,
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(wishlistQuery);

      const loadedWishlist: WishlistItem[] =
        snapshot.docs.map((wishlistDoc) => ({
          id: wishlistDoc.id,
          ...wishlistDoc.data(),
        }));

      // Remove duplicate cities if duplicate documents already exist.
      const uniqueWishlist = loadedWishlist.filter(
        (item, index, currentWishlist) => {
          const itemCity =
            item.city ||
            item.destination?.split(",")[0] ||
            item.id;

          return (
            currentWishlist.findIndex((currentItem) => {
              const currentCity =
                currentItem.city ||
                currentItem.destination?.split(",")[0] ||
                currentItem.id;

              return (
                normalizeCity(currentCity) ===
                normalizeCity(itemCity)
              );
            }) === index
          );
        }
      );

      setWishlist(uniqueWishlist);
    } catch (error: any) {
      console.log("LOAD WISHLIST ERROR:", error);

      Alert.alert(
        "Error",
        error.message || "Could not load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(item: WishlistItem) {
    try {
      const user = auth.currentUser;

      if (!user || removingItemId !== null) {
        return;
      }

      setRemovingItemId(item.id);

      await deleteDoc(
        doc(db, "users", user.uid, "wishlist", item.id)
      );

      setWishlist((currentWishlist) =>
        currentWishlist.filter(
          (wishlistItem) => wishlistItem.id !== item.id
        )
      );
    } catch (error: any) {
      console.log("DELETE WISHLIST ERROR:", error);

      Alert.alert(
        "Error",
        error.message || "Could not remove destination."
      );
    } finally {
      setRemovingItemId(null);
    }
  }

  function confirmRemove(item: WishlistItem) {
    const destinationName =
      item.destination ||
      [item.city, item.country].filter(Boolean).join(", ") ||
      "this destination";

    Alert.alert(
      "Remove destination",
      `Are you sure you want to remove ${destinationName} from your wishlist?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromWishlist(item),
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadWishlist();
    }, [])
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["#1E1B4B", "#312E81", "#7C3AED"]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#FDE68A"
          />

          <Text style={styles.loadingText}>
            Loading your wishlist...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={styles.container}
    >
      <Text style={styles.badge}>Favorites</Text>

      <Text style={styles.title}>My Wishlist ❤️</Text>

      <Text style={styles.subtitle}>
        Save destinations you dream of visiting.
      </Text>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isRemoving = removingItemId === item.id;

          const destinationName =
            item.destination ||
            [item.city, item.country]
              .filter(Boolean)
              .join(", ") ||
            "Unknown destination";

          return (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
                isRemoving && styles.cardDisabled,
              ]}
              disabled={isRemoving}
              onPress={() =>
                navigation.navigate("CreateTripScreen", {
                  initialDestination: item.city,
                })
              }
            >
              <View style={styles.locationIcon}>
                {item.emoji ? (
                  <Text style={styles.emoji}>
                    {item.emoji}
                  </Text>
                ) : (
                  <Ionicons
                    name="location"
                    size={22}
                    color="#111827"
                  />
                )}
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.destination}>
                  {destinationName}
                </Text>

                <Text style={styles.reason}>
                  {item.reason || "Saved destination"}
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed &&
                    !isRemoving &&
                    styles.removeButtonPressed,
                  isRemoving &&
                    styles.removeButtonDisabled,
                ]}
                onPress={(event) => {
                  event.stopPropagation();
                  confirmRemove(item);
                }}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <ActivityIndicator
                    size="small"
                    color="#FDE68A"
                  />
                ) : (
                  <Ionicons
                    name="heart"
                    size={26}
                    color="#FDE68A"
                  />
                )}
              </Pressable>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.heartCircle}>
              <Ionicons
                name="heart-outline"
                size={42}
                color="#FDE68A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Your wishlist is empty
            </Text>

            <Text style={styles.emptyText}>
              Explore destinations and save the places you want
              to visit later.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.exploreButton,
                pressed && styles.exploreButtonPressed,
              ]}
              onPress={() => navigation.navigate("ExploreScreen")}
            >
              <Ionicons
                name="compass"
                size={22}
                color="#111827"
              />

              <Text style={styles.exploreButtonText}>
                Explore Destinations
              </Text>
            </Pressable>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#DDD6FE",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
  },

  badge: {
    alignSelf: "flex-start",
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
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: "600",
  },

  list: {
    flexGrow: 1,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 18,
    borderRadius: 24,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  cardDisabled: {
    opacity: 0.65,
  },

  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 24,
  },

  cardContent: {
    flex: 1,
  },

  destination: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 5,
  },

  reason: {
    fontSize: 13,
    color: "#DDD6FE",
    lineHeight: 19,
    fontWeight: "600",
  },

  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(253,230,138,0.12)",
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.25)",
  },

  removeButtonPressed: {
    transform: [{ scale: 0.9 }],
    backgroundColor: "rgba(253,230,138,0.22)",
  },

  removeButtonDisabled: {
    opacity: 0.6,
  },

  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 28,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  heartCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(253,230,138,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: "#DDD6FE",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: "600",
  },

  exploreButton: {
    minHeight: 58,
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#FDE68A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  exploreButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  exploreButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
});