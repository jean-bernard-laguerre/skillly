import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Briefcase,
  Users,
  Heart,
  FileText,
  Plus,
  TrendingUp,
  Calendar,
  Building2,
} from "lucide-react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function RecruiterHome() {
  const { handleLogOut, user } = useAuth();
  const {
    jobPosts,
    isLoadingJobPosts,
    applications,
    isLoadingApplications,
    matches,
    isLoadingMatches,
    refetchJobPosts,
    refetchApplications,
    refetchMatches,
  } = useJobPost();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Calcul des statistiques réelles
  const stats = useMemo(() => {
    const userName = user?.first_name || "Recruteur";
    const companyName = user?.profile_recruiter?.companyID
      ? "Votre entreprise"
      : "Entreprise"; // À adapter selon la structure

    // Date d'aujourd'hui pour les calculs
    const today = new Date().toDateString();

    // Offres actives (non expirées)
    const activeJobPosts =
      jobPosts?.filter((job) => {
        const expirationDate = new Date(job.expiration_date).toDateString();
        return new Date(expirationDate) >= new Date(today);
      }).length || 0;

    // Extraire toutes les applications des job posts
    const allApplications =
      applications?.flatMap((jobPost) => jobPost.applications || []) || [];

    // Nouvelles candidatures (reçues aujourd'hui)
    const newApplications =
      allApplications.filter((app) => {
        const appDate = new Date(app.created_at).toDateString();
        return appDate === today;
      }).length || 0;

    // Total des candidatures
    const totalApplications = allApplications.length || 0;

    // Candidatures en attente
    const pendingApplications =
      allApplications.filter((app) => app.state === "pending").length || 0;

    // Matches actuels - extraire des job posts avec matches
    const allMatches =
      matches?.flatMap((jobPost) => jobPost.matches || []) || [];
    const currentMatches = allMatches.length || 0;

    // Nouvelles offres créées cette semaine
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newJobsThisWeek =
      jobPosts?.filter((job) => {
        return new Date(job.created_at) >= weekAgo;
      }).length || 0;

    return {
      userName,
      companyName,
      activeJobPosts,
      newApplications,
      totalApplications,
      pendingApplications,
      currentMatches,
      newJobsThisWeek,
    };
  }, [user, jobPosts, applications, matches]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchJobPosts(),
        refetchApplications(),
        refetchMatches(),
      ]);
    } catch (error) {
      console.error("Erreur lors du refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoadingJobPosts || isLoadingApplications || isLoadingMatches) {
    return (
      <ScreenWrapper>
        <View className="flex-1 justify-center items-center bg-gray-100">
          <Text className="text-xl font-bold">
            Chargement de votre tableau de bord...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header
        title="ACCUEIL"
        showNotification={true}
        onNotificationPress={() => console.log("Notification pressed")}
      />
      <ScrollView
        className="flex-1 p-3"
        style={{ backgroundColor: "#F7F7F7" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#7C3AED"
            colors={["#7C3AED"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Welcome Section */}
        <View className="mb-4">
          {/* Greeting Section */}
          <View className="flex-row items-center px-3 mb-4">
            <View className="overflow-hidden justify-center items-center mr-3 w-16 h-16 bg-indigo-100 rounded-full">
              <Building2 size={32} color="#4717F6" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-[24px] font-bold text-black">
                Bonjour {stats.userName} ! 👋
              </Text>
              <Text className="text-[14px] font-[400] text-[#6A6A6A]">
                Gérez vos offres et découvrez de nouveaux talents
              </Text>
            </View>
          </View>

          {/* Quick Stats Panel */}
          <View className="p-4 mx-3 rounded-lg border border-gray-200">
            <View className="flex-row items-center mb-2">
              <Text className="flex-1 text-base font-semibold text-gray-900">
                Vue d'ensemble de votre activité 📊
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="items-center">
                <Text className="text-2xl font-bold text-indigo-600">
                  {stats.activeJobPosts}
                </Text>
                <Text className="text-xs text-gray-600">Offres actives</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {stats.totalApplications}
                </Text>
                <Text className="text-xs text-gray-600">Candidatures</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-pink-600">
                  {stats.currentMatches}
                </Text>
                <Text className="text-xs text-gray-600">Matches</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Grid Layout avec StyleSheet Flexbox - 2 colonnes / 3 lignes */}
        <View style={styles.gridContainer}>
          {/* Ligne 1: Nouvelles candidatures (pleine largeur) */}
          <Pressable
            onPress={() =>
              (navigation as any).navigate("Applications", {
                tab: "applications",
              })
            }
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <LinearGradient
              colors={["#36E9CD", "#36E9CD"]}
              style={styles.newApplications}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={[
                  "rgba(242, 242, 242, 0.075)",
                  "rgba(242, 242, 242, 0.3)",
                ]}
                style={styles.newApplicationsOverlay}
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}
              >
                <FileText size={24} color="white" />
                <Text style={styles.newApplicationsText}>
                  {stats.newApplications} Nouvelles candidatures aujourd'hui
                </Text>
              </LinearGradient>
            </LinearGradient>
          </Pressable>

          {/* Ligne 2-3: Structure en colonnes */}
          <View style={styles.rowContainer}>
            {/* Colonne gauche */}
            <View style={styles.leftColumn}>
              {/* Candidatures en attente */}
              <Pressable
                onPress={() =>
                  (navigation as any).navigate("Applications", {
                    tab: "applications",
                  })
                }
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View style={styles.pendingApplications}>
                  <Text style={styles.pendingEmoji}>⏳</Text>
                  <Text style={styles.pendingMainText}>
                    {stats.pendingApplications > 0
                      ? `${stats.pendingApplications} candidature(s) en attente`
                      : "Aucune candidature en attente"}
                  </Text>
                </View>
              </Pressable>

              {/* Statistiques rapides */}
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
                  <TrendingUp size={16} color="#270D87" />
                  <View style={styles.statsNumberContainer}>
                    <Text style={styles.statsNumber}>
                      {stats.newJobsThisWeek}
                    </Text>
                    <Text style={styles.statsText}>offres cette semaine</Text>
                  </View>
                </LinearGradient>
              </LinearGradient>
            </View>

            {/* Colonne droite */}
            <View style={styles.rightColumn}>
              {/* Matches actuels (prend toute la hauteur) */}
              <Pressable
                onPress={() =>
                  (navigation as any).navigate("Applications", {
                    tab: "matches",
                  })
                }
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <View style={styles.currentMatches}>
                  <Heart size={20} color="#FF2056" />
                  <View style={styles.matchesTextContainer}>
                    <Text style={styles.matchesNumber}>
                      {stats.currentMatches}
                    </Text>
                    <Text style={styles.matchesText}>
                      match(s) en cours à gérer
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Actions rapides</Text>

          <View style={styles.actionsRow}>
            {/* Créer une offre */}
            <Pressable
              onPress={() =>
                (navigation as any).navigate("Jobs", { create: true })
              }
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
            >
              <LinearGradient
                colors={["#4717F6", "#6366f1"]}
                style={styles.actionCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={24} color="white" />
                <Text style={styles.actionText}>Créer une offre</Text>
              </LinearGradient>
            </Pressable>

            {/* Voir les offres */}
            <Pressable
              onPress={() => navigation.navigate("Jobs" as never)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, flex: 1 })}
            >
              <LinearGradient
                colors={["#7C3AED", "#8B5CF6"]}
                style={styles.actionCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Briefcase size={24} color="white" />
                <Text style={styles.actionText}>Mes offres</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Call to Action */}
        <Pressable
          onPress={() =>
            (navigation as any).navigate("Applications", {
              tab: "applications",
            })
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <LinearGradient
            colors={["#FF6B6B", "#FF8E8E"]}
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
                {stats.pendingApplications > 0
                  ? `${stats.pendingApplications} candidature(s) attendent votre réponse ! 📝`
                  : "Découvrez vos candidatures et matches ! 🚀"}
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
  newApplications: {
    height: 89,
    borderRadius: 12,
    marginBottom: 12,
  },
  newApplicationsOverlay: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 24,
  },
  newApplicationsText: {
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
  pendingApplications: {
    height: 89,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#FFB366",
    borderRadius: 8,
    gap: 8,
    backgroundColor: "rgba(255, 179, 102, 0.1)",
  },
  pendingEmoji: {
    fontSize: 20,
  },
  pendingMainText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A4A4A",
    textAlign: "left",
    lineHeight: 16,
    flex: 1,
    flexWrap: "wrap",
  },
  currentMatches: {
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
  matchesTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  matchesNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF2056",
  },
  matchesText: {
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
  statsNumberContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 8,
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
  quickActionsContainer: {
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
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
