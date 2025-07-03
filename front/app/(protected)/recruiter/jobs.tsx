import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Building2,
} from "lucide-react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Portal } from "react-native-portalize";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import CreateJobPost from "./jobs/create";

type JobFilter = "all" | "active" | "expired";

export default function Jobs() {
  const { jobPosts, isLoadingJobPosts, jobPostsError } = useJobPost();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<JobFilter>("active");

  // Statistiques des offres
  const stats = useMemo(() => {
    if (!jobPosts) return { total: 0, active: 0, expired: 0 };

    const today = new Date();
    const active = jobPosts.filter(
      (job) => new Date(job.expiration_date) >= today
    ).length;
    const expired = jobPosts.filter(
      (job) => new Date(job.expiration_date) < today
    ).length;

    return {
      total: jobPosts.length,
      active,
      expired,
    };
  }, [jobPosts]);

  // Filtrer les offres selon le filtre sélectionné
  const filteredJobPosts = useMemo(() => {
    if (!jobPosts) return [];

    const today = new Date();
    switch (selectedFilter) {
      case "active":
        return jobPosts.filter((job) => new Date(job.expiration_date) >= today);
      case "expired":
        return jobPosts.filter((job) => new Date(job.expiration_date) < today);
      default:
        return jobPosts;
    }
  }, [jobPosts, selectedFilter]);

  const renderContent = () => {
    if (isLoadingJobPosts) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4717F6" />
          <Text className="mt-4 text-lg font-semibold text-gray-600">
            Chargement de vos offres...
          </Text>
        </View>
      );
    }

    if (jobPostsError) {
      return (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="mb-4 text-xl font-bold text-center text-red-500">
            Erreur lors du chargement
          </Text>
          <Text className="text-center text-gray-500">
            Une erreur est survenue lors du chargement de vos offres d'emploi
          </Text>
        </View>
      );
    }

    if (jobPosts?.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-5">
          <View className="items-center mb-8">
            <View className="justify-center items-center mb-4 w-24 h-24 bg-indigo-100 rounded-full">
              <Briefcase size={40} color="#4717F6" />
            </View>
            <Text className="mb-4 text-2xl font-bold text-center text-gray-800">
              Aucune offre d'emploi
            </Text>
            <Text className="mb-6 text-center text-gray-500">
              Créez votre première offre pour commencer à recruter de nouveaux
              talents
            </Text>
            <Pressable onPress={() => setIsCreateModalVisible(true)}>
              <LinearGradient
                colors={["#4717F6", "#6366f1"]}
                style={styles.createFirstButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={20} color="white" />
                <Text className="ml-2 font-semibold text-white">
                  Créer ma première offre
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1" style={{ backgroundColor: "#F7F7F7" }}>
        {/* Statistiques fixes en haut */}
        <View style={styles.statsContainer} className="px-4">
          <LinearGradient
            colors={["#4717F6", "#6366f1"]}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsContent}>
              <Pressable
                style={[
                  styles.statItem,
                  selectedFilter === "all" && styles.statItemSelected,
                ]}
                onPress={() => setSelectedFilter("all")}
              >
                <Text
                  style={[
                    styles.statNumber,
                    selectedFilter === "all" && styles.statNumberSelected,
                  ]}
                >
                  {stats.total}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    selectedFilter === "all" && styles.statLabelSelected,
                  ]}
                >
                  Total
                </Text>
                {selectedFilter === "all" && (
                  <View style={styles.statIndicator} />
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.statItem,
                  selectedFilter === "active" && styles.statItemSelected,
                ]}
                onPress={() => setSelectedFilter("active")}
              >
                <Text
                  style={[
                    styles.statNumber,
                    selectedFilter === "active" && styles.statNumberSelected,
                  ]}
                >
                  {stats.active}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    selectedFilter === "active" && styles.statLabelSelected,
                  ]}
                >
                  Actives
                </Text>
                {selectedFilter === "active" && (
                  <View style={styles.statIndicator} />
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.statItem,
                  selectedFilter === "expired" && styles.statItemSelected,
                ]}
                onPress={() => setSelectedFilter("expired")}
              >
                <Text
                  style={[
                    styles.statNumber,
                    selectedFilter === "expired" && styles.statNumberSelected,
                  ]}
                >
                  {stats.expired}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    selectedFilter === "expired" && styles.statLabelSelected,
                  ]}
                >
                  Expirées
                </Text>
                {selectedFilter === "expired" && (
                  <View style={styles.statIndicator} />
                )}
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Indication que les stats sont cliquables */}
        {jobPosts && jobPosts.length > 0 && (
          <Text style={styles.filterHint}>
            💡 Appuyez sur les statistiques pour filtrer vos offres
          </Text>
        )}

        {/* Zone scrollable pour les offres */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Liste des offres */}
          {filteredJobPosts && filteredJobPosts.length === 0 ? (
            <View
              className="flex-1 justify-center items-center px-5 py-8"
              style={{ minHeight: 300 }}
            >
              <View className="justify-center items-center mb-4 w-20 h-20 bg-gray-100 rounded-full">
                <Briefcase size={32} color="#6B7280" />
              </View>
              <Text className="mb-2 text-xl font-bold text-center text-gray-800">
                Aucune offre{" "}
                {selectedFilter === "active"
                  ? "active"
                  : selectedFilter === "expired"
                  ? "expirée"
                  : ""}
              </Text>
              <Text className="text-center text-gray-500">
                {selectedFilter === "active"
                  ? "Vous n'avez pas d'offres actives pour le moment"
                  : selectedFilter === "expired"
                  ? "Aucune offre expirée trouvée"
                  : "Aucune offre trouvée"}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredJobPosts?.map((job) => {
                const isExpired = new Date(job.expiration_date) < new Date();
                const hasApplications =
                  job.applications && job.applications.length > 0;

                return (
                  <View key={job.id} style={styles.jobCard}>
                    <LinearGradient
                      colors={
                        isExpired
                          ? ["#F3F4F6", "#E5E7EB"]
                          : ["#FFFFFF", "#F8FAFC"]
                      }
                      style={styles.jobCardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {/* Header de la carte */}
                      <View style={styles.jobCardHeader}>
                        <View style={styles.jobTitleSection}>
                          <Text
                            style={[
                              styles.jobTitle,
                              isExpired && styles.expiredText,
                            ]}
                          >
                            {job.title}
                          </Text>
                          <View style={styles.statusBadgeContainer}>
                            {isExpired ? (
                              <View style={styles.expiredBadge}>
                                <Text style={styles.expiredBadgeText}>
                                  Expirée
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>
                                  Active
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      {/* Informations principales */}
                      <View style={styles.jobInfoSection}>
                        <View style={styles.infoRow}>
                          <MapPin size={16} color="#6B7280" />
                          <Text style={styles.infoText}>{job.location}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Briefcase size={16} color="#6B7280" />
                          <Text style={styles.infoText}>
                            {job.contract_type}
                          </Text>
                        </View>

                        <View style={styles.infoRow}>
                          <DollarSign size={16} color="#22c55e" />
                          <Text
                            style={[
                              styles.infoText,
                              { color: "#22c55e", fontWeight: "600" },
                            ]}
                          >
                            {job.salary_range}
                          </Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Calendar size={16} color="#6B7280" />
                          <Text style={styles.infoText}>
                            Expire le{" "}
                            {new Date(job.expiration_date).toLocaleDateString(
                              "fr-FR"
                            )}
                          </Text>
                        </View>

                        {hasApplications && (
                          <View style={styles.infoRow}>
                            <Users size={16} color="#4717F6" />
                            <Text
                              style={[
                                styles.infoText,
                                { color: "#4717F6", fontWeight: "600" },
                              ]}
                            >
                              {job.applications?.length} candidature(s)
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Compétences */}
                      {job.skills && job.skills.length > 0 && (
                        <View style={styles.skillsSection}>
                          <Text style={styles.sectionTitle}>Compétences</Text>
                          <View style={styles.skillsContainer}>
                            {job.skills.slice(0, 3).map((skill) => (
                              <View key={skill.id} style={styles.skillBadge}>
                                <Text style={styles.skillText}>
                                  {skill.name}
                                </Text>
                              </View>
                            ))}
                            {job.skills.length > 3 && (
                              <View style={styles.skillBadgeExtra}>
                                <Text style={styles.skillTextExtra}>
                                  +{job.skills.length - 3}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}

                      {/* Description */}
                      {job.description && (
                        <View style={styles.descriptionSection}>
                          <Text style={styles.sectionTitle}>Description</Text>
                          <Text
                            style={styles.descriptionText}
                            numberOfLines={2}
                          >
                            {job.description}
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header
        title="MES OFFRES"
        subtitle="Gérez vos offres d'emploi et suivez leur performance 📊"
      />
      <View className="flex-1" style={{ backgroundColor: "#F7F7F7" }}>
        {renderContent()}

        {/* Bouton flottant pour créer une offre */}
        {jobPosts && jobPosts.length > 0 && (
          <View style={styles.floatingButtonContainer}>
            <Pressable
              onPress={() => setIsCreateModalVisible(true)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <LinearGradient
                colors={["#36E9CD", "#36E9CD"]}
                style={styles.floatingButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={24} color="white" />
                <Text style={styles.floatingButtonText}>Nouvelle offre</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        <Portal>
          {isCreateModalVisible && (
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Créer une offre d'emploi
                  </Text>
                  <Pressable
                    onPress={() => setIsCreateModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </Pressable>
                </View>
                <View style={styles.modalContent}>
                  <CreateJobPost
                    onSuccess={() => setIsCreateModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          )}
        </Portal>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  statsGradient: {
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: 80,
  },
  statItemSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: [{ scale: 1.05 }],
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  statNumberSelected: {
    fontSize: 30,
    color: "#36E9CD",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  statLabelSelected: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  statIndicator: {
    width: 20,
    height: 3,
    backgroundColor: "#36E9CD",
    borderRadius: 2,
    marginTop: 4,
    shadowColor: "#36E9CD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  filterHint: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  jobCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  jobCardGradient: {
    borderRadius: 12,
    padding: 16,
  },
  jobCardHeader: {
    marginBottom: 12,
  },
  jobTitleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    flex: 1,
    marginRight: 12,
  },
  expiredText: {
    color: "#9CA3AF",
  },
  statusBadgeContainer: {
    alignSelf: "flex-start",
  },
  activeBadge: {
    backgroundColor: "#36E9CD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#292929",
  },
  expiredBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  expiredBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  jobInfoSection: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  skillsSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillBadge: {
    backgroundColor: "#4717F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  skillBadgeExtra: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillTextExtra: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  descriptionSection: {
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  createFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  modalBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: "white",
    // borderTopLeftRadius: 16,
    // borderTopRightRadius: 16,
    width: "100%",
    height: "100%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
});
