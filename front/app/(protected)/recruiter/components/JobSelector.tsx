import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Briefcase, MapPin, Users, Heart } from "lucide-react-native";
import { JobSelectorProps } from "@/types/interfaces";

export default function JobSelector({
  jobs,
  selectedJobId,
  onSelectJob,
  type,
  refreshing = false,
  onRefresh,
}: JobSelectorProps) {
  const isApplications = type === "applications";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={
            isApplications ? ["#4717F6", "#6366f1"] : ["#7C3AED", "#8B5CF6"]
          }
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {isApplications ? (
              <Briefcase size={24} color="white" />
            ) : (
              <Heart size={24} color="white" />
            )}
            <Text style={styles.headerTitle}>Sélectionnez une offre</Text>
            <Text style={styles.headerSubtitle}>
              {isApplications
                ? "Choisissez l'offre pour voir les candidatures"
                : "Choisissez l'offre pour voir les matches"}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Liste des offres */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isApplications ? "#4717F6" : "#7C3AED"}
              colors={[isApplications ? "#4717F6" : "#7C3AED"]}
              progressBackgroundColor="#ffffff"
            />
          ) : undefined
        }
      >
        {jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              {isApplications ? (
                <Briefcase size={40} color="#6B7280" />
              ) : (
                <Heart size={40} color="#6B7280" />
              )}
            </View>
            <Text style={styles.emptyTitle}>
              Aucune offre{" "}
              {isApplications ? "avec candidatures" : "avec matches"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isApplications
                ? "Créez des offres pour recevoir des candidatures"
                : "Les matches apparaîtront après validation des candidatures"}
            </Text>
          </View>
        ) : (
          jobs.map((job) => {
            const count = isApplications
              ? job.applications?.filter((app) => app.state !== "matched")
                  .length || 0
              : job.matches?.length || 0;

            return (
              <TouchableOpacity
                key={job.id}
                onPress={() => onSelectJob(job.id)}
                activeOpacity={0.9}
              >
                <View style={styles.jobCard}>
                  <LinearGradient
                    colors={["#FFFFFF", "#F8FAFC"]}
                    style={styles.jobCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.jobCardContent}>
                      {/* Header de la carte */}
                      <View style={styles.jobCardHeader}>
                        <View style={styles.jobTitleSection}>
                          <Briefcase size={20} color="#4717F6" />
                          <Text style={styles.jobTitle}>{job.title}</Text>
                        </View>
                        <View
                          style={[
                            styles.countBadge,
                            {
                              backgroundColor: isApplications
                                ? "#4717F6"
                                : "#7C3AED",
                            },
                          ]}
                        >
                          <Text style={styles.countBadgeText}>{count}</Text>
                        </View>
                      </View>

                      {/* Informations */}
                      <View style={styles.jobInfo}>
                        <View style={styles.infoRow}>
                          <MapPin size={16} color="#6B7280" />
                          <Text style={styles.infoText}>{job.location}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Users size={16} color="#6B7280" />
                          <Text style={styles.infoText}>
                            {job.contract_type}
                          </Text>
                        </View>
                      </View>

                      {/* Statut */}
                      <View style={styles.statusSection}>
                        <Text style={styles.statusText}>
                          {count > 0
                            ? `${count} ${
                                isApplications ? "candidature" : "match"
                              }${count > 1 ? "s" : ""} en attente`
                            : `Aucun${
                                isApplications ? "e candidature" : " match"
                              }`}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  headerGradient: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  jobCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
  jobCardContent: {
    gap: 12,
  },
  jobCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    flex: 1,
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  jobInfo: {
    gap: 8,
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
  statusSection: {
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4717F6",
  },
  statusText: {
    fontSize: 12,
    color: "#4717F6",
    fontWeight: "600",
  },
});
