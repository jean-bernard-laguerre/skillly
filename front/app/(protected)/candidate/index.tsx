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
import { LinearGradient } from "expo-linear-gradient";
import { AlarmClock } from "lucide-react-native";
import { useApplication } from "@/lib/hooks/useApplication";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";

export default function CandidateHome() {
  const { handleLogOut, user } = useAuth();
  const { applications, isLoadingApplications } = useApplication();
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const navigation = useNavigation();

  // Calcul des statistiques réelles
  const stats = useMemo(() => {
    const userName = user?.first_name || "Utilisateur";
    const profileCompletion = 65; // À calculer plus tard selon les champs remplis

    // Date d'aujourd'hui pour les calculs
    const today = new Date().toDateString();

    // Candidatures en cours (status pending)
    const applicationsInProgress =
      applications?.filter((app) => app.state === "pending").length || 0;

    // Nombre total d'offres disponibles
    const totalOpportunities = candidateJobPosts?.length || 0;

    // Offres publiées aujourd'hui
    const newOpportunities =
      candidateJobPosts?.filter((job) => {
        const jobDate = new Date(job.created_at).toDateString();
        return jobDate === today;
      }).length || 0;

    // Matchs actuels (applications avec state "matched")
    const currentMatches =
      applications?.filter((app) => app.state === "matched").length || 0;

    return {
      userName,
      profileCompletion,
      applicationsInProgress,
      newOpportunities,
      totalOpportunities,
      currentMatches,
    };
  }, [user, applications, candidateJobPosts]);

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
              <Text className="mb-1 text-[24px] font-bold text-black">
                Hello {stats.userName}, 👋
              </Text>
              <Text className="text-[14px] font-[400] text-[#6A6A6A]">
                Prêt(e) à découvrir de nouvelles opportunités ?
              </Text>
            </View>
          </View>

          {/* Profile Completion */}
          <View className="p-4 mx-3 rounded-lg border border-gray-200">
            <View className="flex-row items-center mb-2">
              <Text className="flex-1 text-base font-semibold text-gray-900">
                Ton profil est à {stats.profileCompletion}% 🚀
              </Text>
            </View>

            {/* Barre de progression */}
            <View className="rounded-full">
              <View className="mb-2 h-2 bg-gray-200 rounded-full">
                <View
                  className="h-2 bg-indigo-500 rounded-full"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </View>
            </View>

            <Pressable>
              <Text className="text-[12px] font-medium text-[#3210AF]">
                Ajoute des compétences et booste tes chances de matcher ⚡
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Grid Layout avec StyleSheet Flexbox - 2 colonnes / 3 lignes */}
        <View style={styles.gridContainer}>
          {/* Ligne 1: Applications in Progress (pleine largeur) */}
          <Pressable
            onPress={() => navigation.navigate("MyApplications" as never)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <LinearGradient
              colors={["#4717F6", "#4717F6"]}
              style={styles.candidaturesEnCours}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={[
                  "rgba(242, 242, 242, 0.075)",
                  "rgba(242, 242, 242, 0.3)",
                ]}
                style={styles.candidaturesEnCoursOverlay}
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}
              >
                <AlarmClock size={24} color="white" />
                <Text style={styles.candidaturesEnCoursText}>
                  {stats.applicationsInProgress} Candidatures en cours
                </Text>
              </LinearGradient>
            </LinearGradient>
          </Pressable>

          {/* Ligne 2-3: Structure en colonnes */}
          <View style={styles.rowContainer}>
            {/* Colonne gauche */}
            <View style={styles.leftColumn}>
              {/* New Matches */}
              <View style={styles.newMatches}>
                <Text style={styles.matchesEmoji}>🤝</Text>
                <Text style={styles.matchesMainText}>
                  {stats.currentMatches
                    ? `${stats.currentMatches} match(s) actuellement`
                    : "Pas de match actuellement"}
                </Text>
              </View>

              {/* Quick Stats */}
              <LinearGradient
                colors={["#C6B7FC", "#C6B7FC"]}
                style={styles.quickStats}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LinearGradient
                  colors={[
                    "rgba(242, 242, 242, 0.1625)",
                    "rgba(242, 242, 242, 0.65)",
                  ]}
                  style={styles.quickStatsOverlay}
                  start={{ x: 0.2, y: 1 }}
                  end={{ x: 0.8, y: 0 }}
                >
                  <Text style={styles.statsEmoji}>🧭</Text>
                  <View style={styles.statsNumberContainer}>
                    <Text style={styles.statsNumber}>
                      {stats.totalOpportunities}
                    </Text>
                    <Text style={styles.statsText}>offres ouvertes</Text>
                  </View>
                </LinearGradient>
              </LinearGradient>
            </View>

            {/* Colonne droite */}
            <View style={styles.rightColumn}>
              {/* New Opportunities (prend toute la hauteur) */}
              <View style={styles.newOpportunities}>
                <Text style={styles.opportunitiesEmoji}>🌟</Text>
                <View style={styles.opportunitiesTextContainer}>
                  <Text style={styles.opportunitiesNumber}>
                    {stats.newOpportunities}
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
        <Pressable
          onPress={() => navigation.navigate("JobOffers" as never)}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <LinearGradient
            colors={["#01E6C3", "#01E6C3"]}
            style={styles.callToAction}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={[
                "rgba(242, 242, 242, 0.1625)",
                "rgba(242, 242, 242, 0.65)",
              ]}
              style={styles.callToActionOverlay}
              start={{ x: 0.2, y: 1 }}
              end={{ x: 0.8, y: 0 }}
            >
              <Text style={styles.callToActionText}>
                Prêt à matcher avec ton futur job ? 🚀
              </Text>
            </LinearGradient>
          </LinearGradient>
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
    borderRadius: 12,
    marginBottom: 12,
  },
  candidaturesEnCoursOverlay: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
    justifyContent: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#4717F6",
    borderRadius: 8,
    gap: 8,
  },
  matchesEmoji: {
    fontSize: 20,
  },
  matchesMainText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A4A4A",
    textAlign: "left",
    lineHeight: 16,
    flex: 1,
    flexWrap: "wrap",
  },
  newOpportunities: {
    height: 190,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
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
    borderRadius: 12,
  },
  quickStatsOverlay: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
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
  callToAction: {
    borderRadius: 12,
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 9,
    // Shadow for Android
    elevation: 4,
  },
  callToActionOverlay: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  callToActionText: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    color: "#000000",
  },
});
