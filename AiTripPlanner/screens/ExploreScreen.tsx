import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

type Activity = {
  title: string;
  description: string;
  time: string;
  location: string;
  bookingUrl: string;
};

type CompletedTrip = {
  city: string;
  country: string;
  emoji: string;
  tag: string;

  trip: {
    destination: string;
    summary: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    estimatedCost: string;
    budget: string;
    travelers: string;
    tripType: string;

    hotelSuggestions: {
      name: string;
      description: string;
      priceRange: string;
    }[];

    restaurants: {
      name: string;
      cuisine: string;
      description: string;
    }[];

    dailyPlan: {
      day: number;
      title: string;
      activities: Activity[];
    }[];
  };
};

const destinations: CompletedTrip[] = [
  {
    city: "Milan",
    country: "Italy",
    emoji: "🇮🇹",
    tag: "Fashion • Food • Culture",

    trip: {
      destination: "Milan, Italy",
      summary:
        "A complete three-day Milan experience featuring famous landmarks, Italian food, shopping, and local culture.",

      startDate: "2026-08-10",
      endDate: "2026-08-12",
      totalDays: 3,
      estimatedCost: "$1,000 - $1,400",
      budget: "Moderate",
      travelers: "Couple",
      tripType: "Culture, Food, Shopping",

      hotelSuggestions: [
        {
          name: "Hotel Berna",
          description:
            "A comfortable hotel near Milano Centrale with easy access to the city.",
          priceRange: "$140 - $200 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Berna+hotel",
        },
        {
          name: "NYX Hotel Milan",
          description:
            "A modern hotel with stylish rooms and a central location.",
          priceRange: "$160 - $230 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=NYX+Hotel+Milan+hotel",
        },
      ],

      restaurants: [
        {
          name: "Luini",
          cuisine: "Italian street food",
          description:
            "Popular for traditional Milanese panzerotti.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Luini+restaurant",
        },
        {
          name: "Trattoria Milanese",
          cuisine: "Milanese cuisine",
          description:
            "Traditional restaurant serving risotto and ossobuco.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Trattoria+Milanese+restaurant",
        },
      ],

      dailyPlan: [
        {
          day: 1,
          title: "Historic Milan",
          activities: [
            {
              title: "Visit Milan Cathedral",
              description:
                "Explore the famous Duomo di Milano and enjoy panoramic views from the rooftop terraces.",
              time: "09:00",
              location: "Piazza del Duomo",
              bookingUrl: "https://www.duomomilano.it",
            },
            {
              title: "Galleria Vittorio Emanuele II",
              description:
                "Walk through Milan's historic shopping gallery and admire its elegant architecture.",
              time: "11:30",
              location: "Piazza del Duomo",
              bookingUrl: "",
            },
            {
              title: "Explore Piazza della Scala",
              description:
                "Visit the famous square and see Teatro alla Scala.",
              time: "14:00",
              location: "Piazza della Scala",
              bookingUrl: "",
            },
            {
              title: "Traditional Milanese Dinner",
              description:
                "Enjoy risotto alla Milanese, ossobuco, and other traditional local dishes.",
              time: "19:30",
              location: "Central Milan",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 2,
          title: "Art and Culture",
          activities: [
            {
              title: "Visit Sforza Castle",
              description:
                "Explore the castle, its museums, historic courtyards, and the surrounding park.",
              time: "09:30",
              location: "Piazza Castello",
              bookingUrl: "",
            },
            {
              title: "See The Last Supper",
              description:
                "View Leonardo da Vinci's famous mural inside Santa Maria delle Grazie.",
              time: "12:00",
              location: "Santa Maria delle Grazie",
              bookingUrl:
                "https://cenacolovinciano.vivaticket.it",
            },
            {
              title: "Walk through Brera",
              description:
                "Explore the artistic streets, galleries, cafés, and boutiques of Brera.",
              time: "15:00",
              location: "Brera District",
              bookingUrl: "",
            },
            {
              title: "Evening Aperitivo",
              description:
                "Enjoy drinks and small dishes during a traditional Milanese aperitivo.",
              time: "19:00",
              location: "Brera or Navigli",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 3,
          title: "Shopping and Relaxation",
          activities: [
            {
              title: "Quadrilatero della Moda",
              description:
                "Explore Milan's famous luxury fashion and shopping district.",
              time: "10:00",
              location: "Via Monte Napoleone",
              bookingUrl: "",
            },
            {
              title: "Visit Navigli District",
              description:
                "Explore boutiques, restaurants, cafés, and canals in the Navigli area.",
              time: "14:00",
              location: "Navigli",
              bookingUrl: "",
            },
            {
              title: "Canal Walk",
              description:
                "Take a relaxing walk beside Naviglio Grande.",
              time: "17:00",
              location: "Naviglio Grande",
              bookingUrl: "",
            },
            {
              title: "Final Italian Dinner",
              description:
                "Finish the trip with a traditional Italian dinner beside the canals.",
              time: "20:00",
              location: "Navigli",
              bookingUrl: "",
            },
          ],
        },
      ],
    },
  },

  {
    city: "Paris",
    country: "France",
    emoji: "🇫🇷",
    tag: "Romantic • Museums • Cafés",

    trip: {
      destination: "Paris, France",
      summary:
        "A romantic four-day Paris itinerary filled with iconic landmarks, museums, cafés, and beautiful neighborhoods.",

      startDate: "2026-09-05",
      endDate: "2026-09-08",
      totalDays: 4,
      estimatedCost: "$1,500 - $2,000",
      budget: "Moderate",
      travelers: "Couple",
      tripType: "Culture, Food, Relaxation",

      hotelSuggestions: [
        {
          name: "Hôtel Le Six",
          description:
            "A stylish boutique hotel near the Luxembourg Gardens.",
          priceRange: "$180 - $260 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=H%C3%B4tel+Le+Six+hotel",
        },
        {
          name: "Hotel Malte",
          description:
            "A central hotel close to the Louvre and Palais Royal.",
          priceRange: "$200 - $280 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Malte+hotel",
        },
      ],

      restaurants: [
        {
          name: "Bouillon Chartier",
          cuisine: "French",
          description:
            "A historic and affordable Parisian restaurant.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Bouillon+Chartier+restaurant",
        },
        {
          name: "Café de Flore",
          cuisine: "French café",
          description:
            "A famous café known for its classic Paris atmosphere.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9+de+Flore+restaurant",
        },
      ],

      dailyPlan: [
        {
          day: 1,
          title: "Paris Highlights",
          activities: [
            {
              title: "Visit the Eiffel Tower",
              description:
                "Visit Paris's most famous landmark and enjoy panoramic city views.",
              time: "09:00",
              location: "Champ de Mars",
              bookingUrl: "https://www.toureiffel.paris",
            },
            {
              title: "Walk along the Seine",
              description:
                "Take a relaxing walk beside the Seine River.",
              time: "12:00",
              location: "Seine River",
              bookingUrl: "",
            },
            {
              title: "Arc de Triomphe",
              description:
                "Visit the famous monument and enjoy views over the Champs-Élysées.",
              time: "15:00",
              location: "Place Charles de Gaulle",
              bookingUrl: "",
            },
            {
              title: "Explore the Champs-Élysées",
              description:
                "Walk along the famous avenue and explore shops and cafés.",
              time: "17:00",
              location: "Champs-Élysées",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 2,
          title: "Art and History",
          activities: [
            {
              title: "Visit the Louvre Museum",
              description:
                "Explore one of the world's most famous museums and see the Mona Lisa.",
              time: "09:00",
              location: "Rue de Rivoli",
              bookingUrl: "https://www.louvre.fr",
            },
            {
              title: "Explore the Tuileries Garden",
              description:
                "Relax and walk through the gardens beside the Louvre.",
              time: "13:00",
              location: "Jardin des Tuileries",
              bookingUrl: "",
            },
            {
              title: "Visit Notre-Dame Area",
              description:
                "Explore Île de la Cité and the area surrounding Notre-Dame Cathedral.",
              time: "15:30",
              location: "Île de la Cité",
              bookingUrl: "",
            },
            {
              title: "Dinner in the Latin Quarter",
              description:
                "Enjoy French food in one of Paris's most historic neighborhoods.",
              time: "19:30",
              location: "Latin Quarter",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 3,
          title: "Montmartre",
          activities: [
            {
              title: "Visit Sacré-Cœur",
              description:
                "Visit the basilica and enjoy beautiful views over Paris.",
              time: "09:30",
              location: "Montmartre",
              bookingUrl: "",
            },
            {
              title: "Explore Montmartre Streets",
              description:
                "Walk through charming streets, cafés, and artist squares.",
              time: "11:30",
              location: "Montmartre",
              bookingUrl: "",
            },
            {
              title: "Visit Local Art Galleries",
              description:
                "Discover small galleries and local artists in the neighborhood.",
              time: "15:00",
              location: "Place du Tertre",
              bookingUrl: "",
            },
            {
              title: "Enjoy a French Café",
              description:
                "Relax with coffee and pastries in a classic Parisian café.",
              time: "17:30",
              location: "Montmartre",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 4,
          title: "Relaxed Paris",
          activities: [
            {
              title: "Luxembourg Gardens",
              description:
                "Walk through the gardens and enjoy a peaceful morning.",
              time: "09:30",
              location: "Jardin du Luxembourg",
              bookingUrl: "",
            },
            {
              title: "Explore Saint-Germain-des-Prés",
              description:
                "Visit historic cafés, bookstores, and elegant streets.",
              time: "12:00",
              location: "Saint-Germain-des-Prés",
              bookingUrl: "",
            },
            {
              title: "Shop for Souvenirs",
              description:
                "Browse local shops and purchase gifts and souvenirs.",
              time: "15:00",
              location: "Central Paris",
              bookingUrl: "",
            },
            {
              title: "Evening Seine Cruise",
              description:
                "Finish the trip with a scenic evening cruise along the Seine.",
              time: "19:00",
              location: "Seine River",
              bookingUrl: "",
            },
          ],
        },
      ],
    },
  },

  {
    city: "Istanbul",
    country: "Turkey",
    emoji: "🇹🇷",
    tag: "History • Markets • Food",

    trip: {
      destination: "Istanbul, Turkey",
      summary:
        "A complete Istanbul journey combining Ottoman history, colorful markets, Bosphorus views, and Turkish cuisine.",

      startDate: "2026-10-12",
      endDate: "2026-10-15",
      totalDays: 4,
      estimatedCost: "$800 - $1,200",
      budget: "Moderate",
      travelers: "Friends",
      tripType: "Culture, Food, Shopping",

      hotelSuggestions: [
        {
          name: "Sultanahmet Palace Hotel",
          description:
            "A traditional hotel close to Istanbul's major historical attractions.",
          priceRange: "$90 - $140 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Sultanahmet+Palace+Hotel+hotel",
        },
        {
          name: "The Marmara Taksim",
          description:
            "A modern hotel located in the heart of Taksim Square.",
          priceRange: "$150 - $220 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=The+Marmara+Taksim+hotel",
        },
      ],

      restaurants: [
        {
          name: "Hafız Mustafa",
          cuisine: "Turkish desserts",
          description:
            "Popular for baklava, Turkish delight, and traditional sweets.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Haf%C4%B1z+Mustafa+restaurant",
        },
        {
          name: "Seven Hills Restaurant",
          cuisine: "Turkish and seafood",
          description:
            "A rooftop restaurant with views of Hagia Sophia.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Seven+Hills+Restaurant+restaurant",
        },
      ],

      dailyPlan: [
        {
          day: 1,
          title: "Historic Istanbul",
          activities: [
            {
              title: "Visit Hagia Sophia",
              description:
                "Explore one of Istanbul's most important historic landmarks.",
              time: "09:00",
              location: "Sultanahmet",
              bookingUrl: "",
            },
            {
              title: "Explore the Blue Mosque",
              description:
                "Visit the famous Ottoman mosque and admire its architecture.",
              time: "11:00",
              location: "Sultanahmet Square",
              bookingUrl: "",
            },
            {
              title: "Walk through Sultanahmet Square",
              description:
                "Explore the historic square connecting Istanbul's major attractions.",
              time: "13:00",
              location: "Sultanahmet",
              bookingUrl: "",
            },
            {
              title: "Visit Basilica Cistern",
              description:
                "Explore the atmospheric underground Byzantine water reservoir.",
              time: "15:30",
              location: "Alemdar",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 2,
          title: "Markets and Food",
          activities: [
            {
              title: "Explore the Grand Bazaar",
              description:
                "Browse thousands of shops selling jewelry, textiles, ceramics, and souvenirs.",
              time: "09:30",
              location: "Beyazıt",
              bookingUrl: "",
            },
            {
              title: "Visit the Spice Bazaar",
              description:
                "Explore colorful stalls selling spices, sweets, tea, and Turkish delight.",
              time: "13:00",
              location: "Eminönü",
              bookingUrl: "",
            },
            {
              title: "Try Turkish Street Food",
              description:
                "Taste simit, döner, börek, and other popular Turkish foods.",
              time: "15:00",
              location: "Eminönü",
              bookingUrl: "",
            },
            {
              title: "Walk across Galata Bridge",
              description:
                "Enjoy views of the Golden Horn and watch local fishermen.",
              time: "17:30",
              location: "Galata Bridge",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 3,
          title: "Bosphorus Experience",
          activities: [
            {
              title: "Take a Bosphorus Cruise",
              description:
                "See Istanbul from the water and pass palaces, mosques, and waterfront homes.",
              time: "09:30",
              location: "Bosphorus",
              bookingUrl: "",
            },
            {
              title: "Visit Dolmabahçe Palace",
              description:
                "Explore the luxurious Ottoman palace beside the Bosphorus.",
              time: "13:00",
              location: "Beşiktaş",
              bookingUrl: "",
            },
            {
              title: "Explore Ortaköy",
              description:
                "Walk through the waterfront neighborhood and visit Ortaköy Mosque.",
              time: "16:00",
              location: "Ortaköy",
              bookingUrl: "",
            },
            {
              title: "Dinner beside the Bosphorus",
              description:
                "Enjoy Turkish cuisine with views of the Bosphorus.",
              time: "19:30",
              location: "Ortaköy",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 4,
          title: "Modern Istanbul",
          activities: [
            {
              title: "Visit Galata Tower",
              description:
                "Climb the historic tower for panoramic views of Istanbul.",
              time: "09:30",
              location: "Galata",
              bookingUrl: "",
            },
            {
              title: "Walk through İstiklal Avenue",
              description:
                "Explore shops, cafés, historic buildings, and local street life.",
              time: "12:00",
              location: "Beyoğlu",
              bookingUrl: "",
            },
            {
              title: "Explore Taksim Square",
              description:
                "Visit one of modern Istanbul's busiest public spaces.",
              time: "15:00",
              location: "Taksim",
              bookingUrl: "",
            },
            {
              title: "Enjoy a Turkish Hammam",
              description:
                "Relax with a traditional Turkish bath experience.",
              time: "18:00",
              location: "Central Istanbul",
              bookingUrl: "",
            },
          ],
        },
      ],
    },
  },

  {
    city: "Dubai",
    country: "UAE",
    emoji: "🇦🇪",
    tag: "Luxury • Shopping • Desert",

    trip: {
      destination: "Dubai, UAE",
      summary:
        "A luxury Dubai itinerary featuring futuristic landmarks, shopping, beaches, and an unforgettable desert experience.",

      startDate: "2026-11-20",
      endDate: "2026-11-23",
      totalDays: 4,
      estimatedCost: "$1,800 - $2,600",
      budget: "Luxury",
      travelers: "Family",
      tripType: "Luxury, Shopping, Adventure",

      hotelSuggestions: [
        {
          name: "Rove Downtown",
          description:
            "A modern hotel located close to Dubai Mall and Burj Khalifa.",
          priceRange: "$130 - $190 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Rove+Downtown+hotel",
        },
        {
          name: "Atlantis The Palm",
          description:
            "A luxury resort with beaches, restaurants, and water attractions.",
          priceRange: "$400 - $700 per night",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Atlantis+The+Palm+hotel",
        },
      ],

      restaurants: [
        {
          name: "Arabian Tea House",
          cuisine: "Emirati",
          description:
            "Traditional Emirati food in a beautiful courtyard setting.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Arabian+Tea+House+restaurant",
        },
        {
          name: "Time Out Market Dubai",
          cuisine: "International",
          description:
            "A collection of popular Dubai restaurants in one location.",

          bookingUrl: "https://www.google.com/maps/search/?api=1&query=Time+Out+Market+Dubai+restaurant",
        },
      ],

      dailyPlan: [
        {
          day: 1,
          title: "Downtown Dubai",
          activities: [
            {
              title: "Visit Burj Khalifa",
              description:
                "Visit the observation decks of the world's tallest building.",
              time: "09:00",
              location: "Downtown Dubai",
              bookingUrl: "https://www.burjkhalifa.ae",
            },
            {
              title: "Explore Dubai Mall",
              description:
                "Browse shops, restaurants, attractions, and entertainment venues.",
              time: "12:00",
              location: "Downtown Dubai",
              bookingUrl: "",
            },
            {
              title: "See Dubai Aquarium",
              description:
                "Visit the aquarium and underwater zoo inside Dubai Mall.",
              time: "15:00",
              location: "Dubai Mall",
              bookingUrl: "",
            },
            {
              title: "Watch the Dubai Fountain",
              description:
                "Enjoy the evening fountain show beside Burj Khalifa.",
              time: "19:00",
              location: "Burj Lake",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 2,
          title: "Old and New Dubai",
          activities: [
            {
              title: "Visit Al Fahidi Historical District",
              description:
                "Explore traditional architecture, museums, and narrow historic streets.",
              time: "09:30",
              location: "Bur Dubai",
              bookingUrl: "",
            },
            {
              title: "Take an Abra Ride",
              description:
                "Cross Dubai Creek aboard a traditional wooden boat.",
              time: "12:00",
              location: "Dubai Creek",
              bookingUrl: "",
            },
            {
              title: "Explore the Gold Souk",
              description:
                "Browse gold, jewelry, spices, textiles, and traditional markets.",
              time: "14:00",
              location: "Deira",
              bookingUrl: "",
            },
            {
              title: "Visit Dubai Frame",
              description:
                "See panoramic views of old and new Dubai from the landmark frame.",
              time: "17:00",
              location: "Zabeel Park",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 3,
          title: "Desert Adventure",
          activities: [
            {
              title: "Dune Bashing",
              description:
                "Experience an exciting four-wheel-drive adventure across the dunes.",
              time: "15:00",
              location: "Dubai Desert",
              bookingUrl: "",
            },
            {
              title: "Camel Riding",
              description:
                "Take a short camel ride through the desert camp.",
              time: "17:00",
              location: "Dubai Desert",
              bookingUrl: "",
            },
            {
              title: "Watch the Desert Sunset",
              description:
                "Enjoy the sunset over the sand dunes.",
              time: "18:00",
              location: "Dubai Desert",
              bookingUrl: "",
            },
            {
              title: "Traditional Desert Dinner",
              description:
                "Enjoy dinner, local entertainment, and cultural activities at a desert camp.",
              time: "19:30",
              location: "Dubai Desert Camp",
              bookingUrl: "",
            },
          ],
        },
        {
          day: 4,
          title: "Beach and Luxury",
          activities: [
            {
              title: "Visit Palm Jumeirah",
              description:
                "Explore the famous artificial island and its luxury resorts.",
              time: "09:30",
              location: "Palm Jumeirah",
              bookingUrl: "",
            },
            {
              title: "Relax at JBR Beach",
              description:
                "Spend time swimming, relaxing, and walking beside the beach.",
              time: "12:30",
              location: "JBR",
              bookingUrl: "",
            },
            {
              title: "Explore Dubai Marina",
              description:
                "Walk along the marina promenade and admire the skyline.",
              time: "16:00",
              location: "Dubai Marina",
              bookingUrl: "",
            },
            {
              title: "Marina Dinner",
              description:
                "Finish the trip with dinner overlooking Dubai Marina.",
              time: "19:30",
              location: "Dubai Marina",
              bookingUrl: "",
            },
          ],
        },
      ],
    },
  },
];

const travelStyleTrips: Record<string, CompletedTrip["trip"]> = {
  Adventure: {
    destination: "Dubai, UAE",
    summary:
      "A four-day adventure in Dubai with desert activities, modern landmarks, beaches, and exciting experiences.",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    totalDays: 4,
    estimatedCost: "$1,500 - $2,200",
    budget: "Moderate",
    travelers: "Friends",
    tripType: "Adventure",

    hotelSuggestions: [
      {
        name: "Rove Downtown",
        description:
          "A modern hotel near Dubai Mall and Burj Khalifa.",
        priceRange: "$130 - $190 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Rove+Downtown+hotel",
      },
      {
        name: "JA Ocean View Hotel",
        description:
          "A comfortable beachfront hotel near JBR and Dubai Marina.",
        priceRange: "$180 - $260 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=JA+Ocean+View+Hotel+hotel",
      },
    ],

    restaurants: [
      {
        name: "Arabian Tea House",
        cuisine: "Emirati",
        description:
          "Traditional Emirati dishes in a beautiful courtyard.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Arabian+Tea+House+restaurant",
      },
      {
        name: "Time Out Market Dubai",
        cuisine: "International",
        description:
          "A large food hall featuring popular Dubai restaurants.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Time+Out+Market+Dubai+restaurant",
      },
    ],

    dailyPlan: [
      {
        day: 1,
        title: "Downtown Adventure",
        activities: [
          {
            title: "Visit Burj Khalifa",
            description:
              "Enjoy panoramic views from the observation deck.",
            time: "09:00",
            location: "Downtown Dubai",
            bookingUrl: "https://www.burjkhalifa.ae",
          },
          {
            title: "Explore Dubai Mall",
            description:
              "Discover shops, attractions, and entertainment.",
            time: "12:00",
            location: "Dubai Mall",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 2,
        title: "Desert Safari",
        activities: [
          {
            title: "Dune Bashing",
            description:
              "Experience a thrilling drive across the desert dunes.",
            time: "15:00",
            location: "Dubai Desert",
            bookingUrl: "",
          },
          {
            title: "Camel Ride",
            description:
              "Enjoy a traditional camel ride through the desert.",
            time: "17:00",
            location: "Dubai Desert",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 3,
        title: "Water Adventure",
        activities: [
          {
            title: "Visit Aquaventure",
            description:
              "Spend the day enjoying water slides and attractions.",
            time: "10:00",
            location: "Atlantis The Palm",
            bookingUrl: "",
          },
          {
            title: "Explore Palm Jumeirah",
            description:
              "Walk around the famous artificial island.",
            time: "17:00",
            location: "Palm Jumeirah",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 4,
        title: "Marina Experience",
        activities: [
          {
            title: "Walk through Dubai Marina",
            description:
              "Enjoy the skyline and waterfront promenade.",
            time: "11:00",
            location: "Dubai Marina",
            bookingUrl: "",
          },
          {
            title: "Relax at JBR Beach",
            description:
              "Finish the trip with swimming and beach activities.",
            time: "15:00",
            location: "JBR Beach",
            bookingUrl: "",
          },
        ],
      },
    ],
  },

  Culture: {
    destination: "Istanbul, Turkey",
    summary:
      "A four-day cultural journey through Istanbul's historical landmarks, neighborhoods, markets, and local traditions.",
    startDate: "2026-10-12",
    endDate: "2026-10-15",
    totalDays: 4,
    estimatedCost: "$800 - $1,200",
    budget: "Moderate",
    travelers: "Couple",
    tripType: "Culture",

    hotelSuggestions: [
      {
        name: "Sultanahmet Palace Hotel",
        description:
          "A traditional hotel close to Istanbul's main historical attractions.",
        priceRange: "$90 - $140 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Sultanahmet+Palace+Hotel+hotel",
      },
      {
        name: "The Marmara Taksim",
        description:
          "A modern hotel located in central Taksim.",
        priceRange: "$150 - $220 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=The+Marmara+Taksim+hotel",
      },
    ],

    restaurants: [
      {
        name: "Seven Hills Restaurant",
        cuisine: "Turkish",
        description:
          "A rooftop restaurant with views of Hagia Sophia.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Seven+Hills+Restaurant+restaurant",
      },
      {
        name: "Hafız Mustafa",
        cuisine: "Turkish desserts",
        description:
          "Popular for baklava and traditional Turkish sweets.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Haf%C4%B1z+Mustafa+restaurant",
      },
    ],

    dailyPlan: [
      {
        day: 1,
        title: "Historic Istanbul",
        activities: [
          {
            title: "Visit Hagia Sophia",
            description:
              "Explore one of Istanbul's most important landmarks.",
            time: "09:00",
            location: "Sultanahmet",
            bookingUrl: "",
          },
          {
            title: "Visit the Blue Mosque",
            description:
              "Admire the architecture of the historic Ottoman mosque.",
            time: "11:00",
            location: "Sultanahmet Square",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 2,
        title: "Palaces and History",
        activities: [
          {
            title: "Visit Topkapi Palace",
            description:
              "Explore the former residence of Ottoman sultans.",
            time: "09:30",
            location: "Fatih",
            bookingUrl: "",
          },
          {
            title: "Visit Basilica Cistern",
            description:
              "Discover the atmospheric underground water reservoir.",
            time: "14:00",
            location: "Sultanahmet",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 3,
        title: "Markets and Traditions",
        activities: [
          {
            title: "Explore the Grand Bazaar",
            description:
              "Browse traditional shops selling jewelry and textiles.",
            time: "10:00",
            location: "Beyazıt",
            bookingUrl: "",
          },
          {
            title: "Visit the Spice Bazaar",
            description:
              "Explore spices, tea, sweets, and Turkish products.",
            time: "14:00",
            location: "Eminönü",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 4,
        title: "Modern Culture",
        activities: [
          {
            title: "Visit Galata Tower",
            description:
              "Enjoy panoramic views over Istanbul.",
            time: "10:00",
            location: "Galata",
            bookingUrl: "",
          },
          {
            title: "Walk through İstiklal Avenue",
            description:
              "Explore shops, cafés, and historic buildings.",
            time: "14:00",
            location: "Beyoğlu",
            bookingUrl: "",
          },
        ],
      },
    ],
  },

  Food: {
    destination: "Milan, Italy",
    summary:
      "A three-day food-focused trip through Milan featuring traditional dishes, markets, cafés, and local neighborhoods.",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    totalDays: 3,
    estimatedCost: "$900 - $1,300",
    budget: "Moderate",
    travelers: "Couple",
    tripType: "Food",

    hotelSuggestions: [
      {
        name: "Hotel Berna",
        description:
          "A comfortable hotel near Milano Centrale.",
        priceRange: "$140 - $200 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Berna+hotel",
      },
      {
        name: "NYX Hotel Milan",
        description:
          "A stylish modern hotel in a central location.",
        priceRange: "$160 - $230 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=NYX+Hotel+Milan+hotel",
      },
    ],

    restaurants: [
      {
        name: "Luini",
        cuisine: "Italian street food",
        description:
          "Famous for traditional Milanese panzerotti.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Luini+restaurant",
      },
      {
        name: "Trattoria Milanese",
        cuisine: "Milanese",
        description:
          "Traditional dishes including risotto and ossobuco.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Trattoria+Milanese+restaurant",
      },
    ],

    dailyPlan: [
      {
        day: 1,
        title: "Milanese Classics",
        activities: [
          {
            title: "Breakfast at a Local Café",
            description:
              "Start the day with Italian coffee and pastries.",
            time: "08:30",
            location: "Central Milan",
            bookingUrl: "",
          },
          {
            title: "Traditional Milanese Lunch",
            description:
              "Taste risotto alla Milanese and ossobuco.",
            time: "13:00",
            location: "Brera",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 2,
        title: "Markets and Street Food",
        activities: [
          {
            title: "Visit a Local Food Market",
            description:
              "Explore fresh produce, cheeses, and Italian ingredients.",
            time: "10:00",
            location: "Milan",
            bookingUrl: "",
          },
          {
            title: "Try Panzerotti at Luini",
            description:
              "Taste one of Milan's most famous street foods.",
            time: "13:30",
            location: "Near Duomo",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 3,
        title: "Aperitivo Experience",
        activities: [
          {
            title: "Italian Cooking Experience",
            description:
              "Learn how to prepare a traditional Italian dish.",
            time: "11:00",
            location: "Central Milan",
            bookingUrl: "",
          },
          {
            title: "Evening Aperitivo",
            description:
              "Enjoy drinks and small plates beside the canals.",
            time: "19:00",
            location: "Navigli",
            bookingUrl: "",
          },
        ],
      },
    ],
  },

  Luxury: {
    destination: "Dubai, UAE",
    summary:
      "A luxury four-day Dubai experience featuring premium hotels, fine dining, shopping, beaches, and exclusive attractions.",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    totalDays: 4,
    estimatedCost: "$3,500 - $5,000",
    budget: "Luxury",
    travelers: "Couple",
    tripType: "Luxury",

    hotelSuggestions: [
      {
        name: "Atlantis The Royal",
        description:
          "A premium beachfront resort on Palm Jumeirah.",
        priceRange: "$700 - $1,200 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Atlantis+The+Royal+hotel",
      },
      {
        name: "Burj Al Arab",
        description:
          "An iconic luxury hotel offering exclusive services.",
        priceRange: "$1,200 - $2,000 per night",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Burj+Al+Arab+hotel",
      },
    ],

    restaurants: [
      {
        name: "Ossiano",
        cuisine: "Fine dining seafood",
        description:
          "A luxury underwater dining experience.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Ossiano+restaurant",
      },
      {
        name: "Al Muntaha",
        cuisine: "European fine dining",
        description:
          "A premium restaurant inside Burj Al Arab.",

        bookingUrl: "https://www.google.com/maps/search/?api=1&query=Al+Muntaha+restaurant",
      },
    ],

    dailyPlan: [
      {
        day: 1,
        title: "Luxury Downtown",
        activities: [
          {
            title: "Private Burj Khalifa Experience",
            description:
              "Enjoy premium access and panoramic city views.",
            time: "10:00",
            location: "Downtown Dubai",
            bookingUrl: "https://www.burjkhalifa.ae",
          },
          {
            title: "Luxury Shopping",
            description:
              "Visit designer boutiques inside Dubai Mall.",
            time: "14:00",
            location: "Dubai Mall",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 2,
        title: "Palm Jumeirah",
        activities: [
          {
            title: "Luxury Beach Day",
            description:
              "Relax at a private beach club on Palm Jumeirah.",
            time: "10:00",
            location: "Palm Jumeirah",
            bookingUrl: "",
          },
          {
            title: "Fine Dining at Ossiano",
            description:
              "Enjoy a premium underwater dining experience.",
            time: "20:00",
            location: "Atlantis The Palm",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 3,
        title: "Private Desert Experience",
        activities: [
          {
            title: "Private Desert Safari",
            description:
              "Explore the desert with a private guide and luxury vehicle.",
            time: "15:00",
            location: "Dubai Desert",
            bookingUrl: "",
          },
          {
            title: "Private Desert Dinner",
            description:
              "Enjoy an exclusive dinner under the stars.",
            time: "19:00",
            location: "Dubai Desert",
            bookingUrl: "",
          },
        ],
      },
      {
        day: 4,
        title: "Marina and Yacht",
        activities: [
          {
            title: "Private Yacht Cruise",
            description:
              "Cruise around Dubai Marina and Palm Jumeirah.",
            time: "11:00",
            location: "Dubai Marina",
            bookingUrl: "",
          },
          {
            title: "Dinner at Burj Al Arab",
            description:
              "Finish the trip with an elegant fine-dining experience.",
            time: "20:00",
            location: "Burj Al Arab",
            bookingUrl: "",
          },
        ],
      },
    ],
  },
};

function openTravelStyleTrip(style: string) {
  const selectedTrip = travelStyleTrips[style];

  if (!selectedTrip) {
    Alert.alert(
      "Trip not available",
      `No completed ${style} trip is available yet.`
    );
    return;
  }

  navigation.navigate("ReviewTripScreen", {
    trip: selectedTrip,
  });
}

export default function ExploreScreen({ navigation }: any) {
  const [savingCity, setSavingCity] = useState<string | null>(null);

  function openCompletedTrip(item: CompletedTrip) {
    navigation.navigate("ReviewTripScreen", {
      trip: item.trip,
    });
  }

  async function saveToWishlist(item: any) {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(
          "Login required",
          "Please log in before saving a destination."
        );
        return;
      }

      setSavingCity(item.city);
      const wishlistRef = collection(
        db,
        "users",
        user.uid,
        "wishlist"
      );

      const cityQuery = query(
        wishlistRef,
        where("city", "==", item.city)
      );

      const existingCities = await getDocs(cityQuery);

      if (!existingCities.empty) {
        Alert.alert(
          "Already saved ❤️",
          `${item.city} is already in your wishlist.`
        );

        return;
      }
      await addDoc(
        wishlistRef,
        {
          destination: `${item.city}, ${item.country}`,
          city: item.city,
          country: item.country,
          emoji: item.emoji,
          reason: item.tag,
          createdAt: serverTimestamp(),
        }
      );

      Alert.alert(
        "Saved ❤️",
        `${item.city} was added to your wishlist.`
      );
    } catch (error: any) {
      console.log("WISHLIST SAVE ERROR:", error);

      Alert.alert(
        "Save failed",
        error.message || "Could not save this destination."
      );
    } finally {
      setSavingCity(null);
    }
  }

  function openTravelStyleTrip(style: string) {
  const selectedTrip = travelStyleTrips[style];

  if (!selectedTrip) {
    Alert.alert(
      "Trip not available",
      `No completed ${style} trip is available yet.`
    );
    return;
  }

  navigation.navigate("ReviewTripScreen", {
    trip: selectedTrip,
  });
}

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#7C3AED"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.badge}>Explore</Text>
        <Text style={styles.title}>Find your next destination 🌍</Text>
        <Text style={styles.subtitle}>
          Pick a place and let AI build the perfect trip plan for you.
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="compass" size={34} color="#111827" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Not sure where to go?</Text>
            <Text style={styles.heroText}>
              Start with a popular destination and customize the dates, budget,
              travelers, and trip style.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular Destinations</Text>

        {destinations.map((item) => (
          <Pressable
            key={item.city}
            style={styles.destinationCard}
            onPress={() => openCompletedTrip(item)}
          >
            <View style={styles.flagBox}>
              <Text style={styles.flag}>{item.emoji}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.destinationTitle}>
                {item.city}, {item.country}
              </Text>
              <Text style={styles.destinationText}>{item.tag}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <Pressable
                style={styles.heartButton}
                onPress={(event) => {
                  event.stopPropagation();
                  saveToWishlist(item);
                }}
                disabled={savingCity === item.city}
              >
                <Ionicons
                  name={savingCity === item.city ? "hourglass-outline" : "heart-outline"}
                  size={20}
                  color="#FDE68A"
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.arrowCircle,
                  pressed && styles.arrowCirclePressed,
                ]}
                onPress={(event) => {
                  event.stopPropagation();
                  openCompletedTrip(item);
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#111827"
                />
              </Pressable>
            </View>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Travel Styles</Text>

        <View style={styles.stylesGrid}>
          {["Adventure", "Culture", "Food", "Luxury"].map((style) => (
            <Pressable
              key={style}
              style={({ pressed }) => [
                styles.styleChip,
                pressed && styles.styleChipPressed,
              ]}
              onPress={() => openTravelStyleTrip(style)}
            >
              <Text style={styles.styleChipText}>{style}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 62,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(253, 230, 138, 0.18)",
    color: "#FDE68A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(253, 230, 138, 0.35)",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 40,
    letterSpacing: -1.2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#DDD6FE",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 24,
  },
  heroCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    marginBottom: 26,
  },
  heroIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroText: {
    color: "#DDD6FE",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#C4B5FD",
    marginBottom: 14,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  destinationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(37, 99, 235, 0.32)",
    borderWidth: 1,
    borderColor: "#60A5FA",
    padding: 16,
    borderRadius: 24,
    marginBottom: 14,
  },
  flagBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  flag: {
    fontSize: 28,
  },
  destinationTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 13,
    color: "#DDD6FE",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.35)",
  },

  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  styleChip: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "rgba(253,230,138,0.16)",
    borderWidth: 1,
    borderColor: "rgba(253,230,138,0.38)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  styleChipText: {
    color: "#FDE68A",
    fontSize: 14,
    fontWeight: "900",
  },

  arrowCirclePressed: {
  opacity: 0.8,
  transform: [{ scale: 0.9 }],
},

styleChipPressed: {
  opacity: 0.75,
  transform: [{ scale: 0.96 }],
},

});