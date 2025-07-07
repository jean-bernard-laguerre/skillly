import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useRoute, RouteProp } from "@react-navigation/native";
import ApplicationsList from "./components/ApplicationsList";
import MatchesList from "./components/MatchesList";
import JobSelector from "./components/JobSelector";
import { FileText, Heart, ArrowLeft, Briefcase } from "lucide-react-native";

type Tab = "applications" | "matches";

// Type pour les paramètres de route
type ApplicationsRouteParams = {
  tab?: Tab;
};

type ApplicationsRouteProp = RouteProp<
  { Applications: ApplicationsRouteParams },
  "Applications"
>;

export default function Applications() {
  const route = useRoute<ApplicationsRouteProp>();
  const [selectedTab, setSelectedTab] = useState<Tab>("applications");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { applications, matches, isLoadingApplications, isLoadingMatches } =
    useJobPost();

  // Initialiser l'onglet selon le paramètre de route
  useEffect(() => {
    if (route.params?.tab) {
      setSelectedTab(route.params.tab);
    }
  }, [route.params?.tab]);

  // Trouver l'offre sélectionnée
  const selectedJob = selectedJobId
    ? selectedTab === "applications"
      ? applications?.find((job) => job.id === selectedJobId)
      : matches?.find((job) => job.id === selectedJobId)
    : null;

  const renderTabContent = () => {
    if (selectedTab === "applications") {
      if (selectedJobId) {
        return (
          <ApplicationsList
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
            hideHeader={true}
          />
        );
      }
      return (
        <JobSelector
          jobs={applications || []}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          type="applications"
        />
      );
    }

    if (selectedTab === "matches") {
      if (selectedJobId) {
        return (
          <MatchesList
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
            hideHeader={true}
          />
        );
      }
      return (
        <JobSelector
          jobs={matches || []}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          type="matches"
        />
      );
    }
  };

  return (
    <ScreenWrapper>
      {/* Header principal - affiché seulement quand aucune offre n'est sélectionnée */}
      {!selectedJobId && (
        <Header
          title={selectedTab === "applications" ? "CANDIDATURES" : "MATCHES"}
          subtitle={
            selectedTab === "applications"
              ? "Gérez vos candidatures reçues 📝"
              : "Découvrez vos matches parfaits ❤️"
          }
        />
      )}

      <View className="flex-1" style={{ backgroundColor: "#F7F7F7" }}>
        {/* Header avec titre de l'offre quand une offre est sélectionnée */}
        {selectedJobId && selectedJob && (
          <View style={styles.jobHeaderContainer}>
            <LinearGradient
              colors={["#4717F6", "#6366f1"]}
              style={styles.jobHeaderGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.jobHeaderContent}>
                <TouchableOpacity
                  onPress={() => setSelectedJobId(null)}
                  style={styles.backButton}
                  activeOpacity={0.8}
                >
                  <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                <View style={styles.jobTitleContainer}>
                  <View style={styles.jobTitleSection}>
                    <Briefcase size={18} color="rgba(255, 255, 255, 0.9)" />
                    <Text
                      style={styles.jobTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {selectedJob.title}
                    </Text>
                  </View>
                </View>

                {/* Espace équivalent au bouton pour centrer le titre */}
                <View style={styles.spacer} />
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Section onglets - affichée seulement quand aucune offre n'est sélectionnée */}
        {!selectedJobId && (
          <View style={styles.tabsContainer}>
            <View style={styles.tabsWrapper}>
              <Pressable
                style={[
                  styles.tabButton,
                  selectedTab === "applications" && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab("applications")}
              >
                {selectedTab === "applications" ? (
                  <LinearGradient
                    colors={["#4717F6", "#6366f1"]}
                    style={styles.tabGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.tabContent}>
                      <FileText size={18} color="white" />
                      <Text style={styles.tabTextActive}>Candidatures</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabContent}>
                    <FileText size={18} color="#6B7280" />
                    <Text style={styles.tabTextInactive}>Candidatures</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.tabButton,
                  selectedTab === "matches" && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab("matches")}
              >
                {selectedTab === "matches" ? (
                  <LinearGradient
                    colors={["#7C3AED", "#8B5CF6"]}
                    style={styles.tabGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.tabContent}>
                      <Heart size={18} color="white" />
                      <Text style={styles.tabTextActive}>Matches</Text>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.tabContent}>
                    <Heart size={18} color="#6B7280" />
                    <Text style={styles.tabTextInactive}>Matches</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        )}

        <View className="flex-1">{renderTabContent()}</View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // Styles pour le header combiné
  jobHeaderContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  jobHeaderGradient: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  jobHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 8,
    minHeight: 80,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  jobTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  jobTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "100%",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    maxWidth: 200,
  },
  spacer: {
    width: 40,
  },

  // Styles existants pour les onglets
  tabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#F7F7F7",
  },
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButtonActive: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
