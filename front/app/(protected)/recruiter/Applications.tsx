import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useRoute, RouteProp } from "@react-navigation/native";
// Import des composants originaux
import ApplicationsList from "./components/ApplicationsList";
import MatchesList from "./components/MatchesList";
import JobSelector from "./components/JobSelector";
import { FileText, Heart, Briefcase } from "lucide-react-native";

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
  const [refreshing, setRefreshing] = useState(false);
  const {
    applications,
    matches,
    isLoadingApplications,
    isLoadingMatches,
    refetchApplications,
    refetchMatches,
  } = useJobPost();

  // Initialiser l'onglet selon le paramètre de route
  useEffect(() => {
    if (route.params?.tab) {
      setSelectedTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedTab === "applications") {
        await refetchApplications();
      } else {
        await refetchMatches();
      }
    } catch (error) {
      console.error("Erreur lors du refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTabContent = () => {
    if (selectedJobId) {
      // Utiliser les composants originaux selon le type
      if (selectedTab === "applications") {
        return (
          <ApplicationsList
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
            hideHeader={false}
          />
        );
      } else {
        return (
          <MatchesList
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
            hideHeader={false}
          />
        );
      }
    }

    // JobSelector pour choisir une offre
    return (
      <JobSelector
        jobs={
          selectedTab === "applications" ? applications || [] : matches || []
        }
        selectedJobId={selectedJobId}
        onSelectJob={setSelectedJobId}
        type={selectedTab}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
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
