import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { AlarmClock, Star, Briefcase, Users } from "lucide-react-native";

export default function CandidateHome() {
  const { handleLogOut, user } = useAuth();

  // Données mock - à remplacer par des données réelles plus tard
  const userName = user?.first_name || "Utilisateur";
  const profileCompletion = 65;
  const applicationsInProgress = 5;
  const newOpportunities = 172;
  // const newMatches = 10;
  const newMatches = 0;

  return (
    <ScreenWrapper>
      <Header
        title="ACCUEIL"
        showNotification={true}
        onNotificationPress={() => console.log("Notification pressed")}
      />
      <ScrollView className="flex-1 p-3" style={{ backgroundColor: "#F7F7F7" }}>
        {/* Welcome Section */}
        <View className="mb-4">
          {/* Greeting Section */}
          <View className="flex-row items-center px-3 mb-4">
            <View className="overflow-hidden justify-center items-center mr-3 w-16 h-16 bg-purple-100 rounded-full">
              {/* Placeholder pour l'image de profil - tu peux remplacer par une vraie image */}
              <Text className="text-2xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xl font-bold text-gray-900">
                Hello {userName}, 👋
              </Text>
              <Text className="text-sm text-gray-600">
                Prêt(e) à découvrir de nouvelles opportunités ?
              </Text>
            </View>
          </View>

          {/* Profile Completion */}
          <View className="p-4 mx-3 rounded-lg border border-gray-200">
            <View className="flex-row items-center mb-2">
              <Text className="flex-1 text-base font-semibold text-gray-900">
                Ton profil est à {profileCompletion}% 🚀
              </Text>
            </View>

            {/* Barre de progression */}
            <View className="mb-3">
              <View className="mb-2 h-2 bg-gray-200 rounded-full">
                <View
                  className="h-2 bg-indigo-500 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                />
              </View>
            </View>

            <Pressable>
              <Text className="text-sm font-medium text-indigo-600">
                Ajoute des compétences et booste tes chances de matcher ⚡
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Grid Layout avec StyleSheet Flexbox - 2 colonnes / 3 lignes */}
        <View style={styles.gridContainer}>
          {/* Ligne 1: Applications in Progress (pleine largeur) */}
          <Pressable style={styles.candidaturesEnCours}>
            <AlarmClock size={24} color="white" />
            <Text style={styles.candidaturesEnCoursText}>
              {applicationsInProgress} Candidatures en cours
            </Text>
          </Pressable>

          {/* Ligne 2-3: Structure en colonnes */}
          <View style={styles.rowContainer}>
            {/* Colonne gauche */}
            <View style={styles.leftColumn}>
              {/* New Matches */}
              <View style={styles.newMatches}>
                <Text style={styles.matchesEmoji}>🤝</Text>
                <Text style={styles.matchesMainText}>
                  {newMatches ? `${newMatches} nouveaux` : "Pas de nouveaux"}{" "}
                  match(s)
                </Text>
              </View>

              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <Text style={styles.statsEmoji}>🧭</Text>
                <View style={styles.statsNumberContainer}>
                  <Text style={styles.statsNumber}>1313</Text>
                  <Text style={styles.statsText}>offres ouvertes</Text>
                </View>
              </View>
            </View>

            {/* Colonne droite */}
            <View style={styles.rightColumn}>
              {/* New Opportunities (prend toute la hauteur) */}
              <View style={styles.newOpportunities}>
                <Text style={styles.opportunitiesEmoji}>🌟</Text>
                <View style={styles.opportunitiesTextContainer}>
                  <Text style={styles.opportunitiesNumber}>
                    {newOpportunities}
                  </Text>
                  <Text style={styles.opportunitiesText}>
                    nouvelles opportunités aujourd'hui
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <Pressable className="p-4 mb-6 bg-teal-400 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-center text-white">
            Prêt à matcher avec ton futur job ? 🎯
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 12,
    marginBottom: 16,
  },
  candidaturesEnCours: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    gap: 24,
  },
  candidaturesEnCoursText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  leftColumn: {
    flexBasis: "50%",
    gap: 12,
  },
  rightColumn: {
    flexBasis: "50%",
  },
  newMatches: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#4717F6",
    borderRadius: 8,
  },
  matchesEmoji: {
    fontSize: 22,
  },
  matchesMainText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  newOpportunities: {
    height: 190,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  opportunitiesTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  opportunitiesNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6366f1",
  },
  opportunitiesEmoji: {
    fontSize: 18,
  },
  opportunitiesText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  quickStats: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#e9d5ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statsEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  statsNumberContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  statsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#270D87",
  },
  statsNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#270D87",
  },
});
