import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useJobPost } from "@/lib/hooks/useJobPost";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  LogOut,
  Briefcase,
  FileText,
  Heart,
  TrendingUp,
  Calendar,
} from "lucide-react-native";

export default function Profile() {
  const { user, handleLogOut } = useAuth();
  const {
    jobPosts,
    isLoadingJobPosts,
    applications,
    isLoadingApplications,
    matches,
    isLoadingMatches,
  } = useJobPost();

  // Calcul des statistiques
  const stats = useMemo(() => {
    const today = new Date().toDateString();

    // Offres actives (non expirées)
    const activeJobPosts =
      jobPosts?.filter((job) => {
        const expirationDate = new Date(job.expiration_date).toDateString();
        return new Date(expirationDate) >= new Date(today);
      }).length || 0;

    // Total des offres
    const totalJobPosts = jobPosts?.length || 0;

    // Extraire toutes les applications des job posts
    const allApplications =
      applications?.flatMap((jobPost) => jobPost.applications || []) || [];

    // Total des candidatures
    const totalApplications = allApplications.length || 0;

    // Candidatures en attente
    const pendingApplications =
      allApplications.filter((app) => app.state === "pending").length || 0;

    // Matches actuels
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
      activeJobPosts,
      totalJobPosts,
      totalApplications,
      pendingApplications,
      currentMatches,
      newJobsThisWeek,
    };
  }, [jobPosts, applications, matches]);

  const recruiterProfile = user?.profile_recruiter;
  const company = recruiterProfile?.company;

  if (isLoadingJobPosts || isLoadingApplications || isLoadingMatches) {
    return (
      <ScreenWrapper>
        <Header title="MON PROFIL" subtitle="Gérez votre profil recruteur 👤" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-bold">
            Chargement de votre profil...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="MON PROFIL" subtitle="Gérez votre profil recruteur 👤" />

      <ScrollView
        className="flex-1 px-4"
        style={{ backgroundColor: "#F7F7F7" }}
      >
        {/* Section Profil Principal */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={["#4717F6", "#6366f1"]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: "https://picsum.photos/seed/recruiter123/120/120",
                  }}
                />
              </View>
              <Text style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.roleRow}>
                <Briefcase size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.userRole}>
                  {recruiterProfile?.title || "Recruteur"}
                </Text>
              </View>
              {recruiterProfile?.role && (
                <View style={styles.companyRoleContainer}>
                  <Text style={styles.companyRole}>
                    {recruiterProfile.role === "admin"
                      ? "Administrateur"
                      : "Membre"}{" "}
                    de l'équipe
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Section Entreprise */}
        {company ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mon Entreprise</Text>
              <Building2 size={24} color="#7C3AED" />
            </View>

            <View style={styles.companyCard}>
              <LinearGradient
                colors={["#7C3AED", "#8B5CF6"]}
                style={styles.companyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.companyContent}>
                  {company.logo && (
                    <View style={styles.companyLogoContainer}>
                      <Image
                        style={styles.companyLogo}
                        source={{ uri: company.logo }}
                        defaultSource={require("@/assets/images/noImg.png")}
                      />
                    </View>
                  )}
                  <Text style={styles.companyName}>
                    {company.company_name || "Nom d'entreprise"}
                  </Text>

                  {company.industry && (
                    <View style={styles.companyInfoRow}>
                      <Text style={styles.companyInfoText}>
                        {company.industry}
                      </Text>
                    </View>
                  )}

                  {company.location && (
                    <View style={styles.companyInfoRow}>
                      <MapPin size={16} color="rgba(255, 255, 255, 0.9)" />
                      <Text style={styles.companyInfoText}>
                        {company.location}
                      </Text>
                    </View>
                  )}

                  {company.size && (
                    <View style={styles.companyInfoRow}>
                      <Users size={16} color="rgba(255, 255, 255, 0.9)" />
                      <Text style={styles.companyInfoText}>
                        {company.size} employés
                      </Text>
                    </View>
                  )}

                  {company.web_site && (
                    <View style={styles.companyInfoRow}>
                      <Globe size={16} color="rgba(255, 255, 255, 0.9)" />
                      <Text style={styles.companyInfoText}>
                        {company.web_site}
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>

            {company.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>À propos</Text>
                <Text style={styles.descriptionText}>
                  {company.description}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informations Recruteur</Text>
              <Building2 size={24} color="#7C3AED" />
            </View>

            <View style={styles.companyCard}>
              <LinearGradient
                colors={["#7C3AED", "#8B5CF6"]}
                style={styles.companyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.companyContent}>
                  <Text style={styles.companyName}>
                    {recruiterProfile?.title || "Poste non renseigné"}
                  </Text>

                  <View style={styles.companyInfoRow}>
                    <Text style={styles.companyInfoText}>
                      {recruiterProfile?.role === "admin"
                        ? "Administrateur"
                        : "Membre"}{" "}
                      de l'équipe
                    </Text>
                  </View>

                  <View style={styles.companyInfoRow}>
                    <Text style={styles.companyInfoText}>
                      Company ID:{" "}
                      {recruiterProfile?.companyID || "Non renseigné"}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>À propos</Text>
              <Text style={styles.descriptionText}>
                Recruteur professionnel dédié à trouver les meilleurs talents
                pour l'entreprise. Expertise dans l'évaluation des candidatures
                et la création d'offres attractives.
              </Text>
            </View>
          </View>
        )}

        {/* Section Statistiques */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <TrendingUp size={24} color="#36E9CD" />
          </View>

          <View style={styles.statsGrid}>
            {/* Ligne 1 */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#36E9CD", "#00D4AA"]}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Briefcase size={20} color="white" />
                  <Text style={styles.statNumber}>{stats.activeJobPosts}</Text>
                  <Text style={styles.statLabel}>Offres actives</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#4717F6", "#6366f1"]}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FileText size={20} color="white" />
                  <Text style={styles.statNumber}>
                    {stats.totalApplications}
                  </Text>
                  <Text style={styles.statLabel}>Candidatures</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Ligne 2 */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#FF2056", "#FF4081"]}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Heart size={20} color="white" />
                  <Text style={styles.statNumber}>{stats.currentMatches}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={["#FFB366", "#FFA726"]}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Calendar size={20} color="white" />
                  <Text style={styles.statNumber}>{stats.newJobsThisWeek}</Text>
                  <Text style={styles.statLabel}>Cette semaine</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Indicateur candidatures en attente */}
          {stats.pendingApplications > 0 && (
            <View style={styles.pendingIndicator}>
              <LinearGradient
                colors={["#FFB366", "#FFA726"]}
                style={styles.pendingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.pendingText}>
                  ⏳ {stats.pendingApplications} candidature(s) en attente de
                  votre réponse
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Bouton Déconnexion */}
        <View style={styles.logoutContainer}>
          <Pressable style={styles.logoutButton} onPress={() => handleLogOut()}>
            <LinearGradient
              colors={["#FF2056", "#FF4081"]}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LogOut size={18} color="white" />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    marginBottom: 24,
  },
  profileGradient: {
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileContent: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  userRole: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  companyRoleContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  companyRole: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#374151",
  },
  companyCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  companyGradient: {
    borderRadius: 16,
    padding: 20,
  },
  companyContent: {
    alignItems: "center",
  },
  companyLogoContainer: {
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  companyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  companyInfoText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  descriptionContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    textAlign: "justify",
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statGradient: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textAlign: "center",
  },
  pendingIndicator: {
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  pendingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 12,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
