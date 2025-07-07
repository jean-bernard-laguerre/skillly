import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApplication } from "@/lib/hooks/useApplication";
import { Clock, Briefcase, BadgeEuro } from "lucide-react-native";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";

type Status = "all" | "pending" | "matched" | "rejected" | "accepted";

const CompanyLogo = ({ company }: { company?: any }) => {
  const [imageError, setImageError] = useState(false);

  const companyImageUrl = company?.logo;

  if (companyImageUrl && !imageError) {
    return (
      <Image
        source={{ uri: companyImageUrl }}
        style={styles.companyLogo}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Image
      source={require("@/assets/images/noImg.png")}
      style={styles.companyLogo}
    />
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "accepted":
        return {
          backgroundColor: "#36E9CD",
          textColor: "#292929",
          label: "Acceptée",
        };
      case "rejected":
        return {
          backgroundColor: "#FF2056",
          textColor: "#ffffff",
          label: "Refusée",
        };
      case "matched":
        return {
          backgroundColor: "#0C66E4",
          textColor: "#ffffff",
          label: "Match",
        };
      default:
        return {
          backgroundColor: "#FFB366",
          textColor: "#292929",
          label: "En attente",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View
      style={[styles.statusBadge, { backgroundColor: config.backgroundColor }]}
    >
      <Text style={[styles.statusBadgeText, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
};

const FilterButton = ({
  status,
  selectedStatus,
  onPress,
}: {
  status: Status;
  selectedStatus: Status;
  onPress: () => void;
}) => {
  const isSelected = selectedStatus === status;

  const getButtonText = () => {
    switch (status) {
      case "all":
        return "Toutes";
      case "pending":
        return "En attente";
      case "matched":
        return "Matches";
      case "rejected":
        return "Refusées";
      case "accepted":
        return "Acceptées";
      default:
        return "Toutes";
    }
  };

  if (isSelected) {
    return (
      <Pressable onPress={onPress} style={styles.filterButtonSelected}>
        <LinearGradient
          colors={["#4717F6", "#4717F6"]}
          style={styles.selectedButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={[
              "rgba(242, 242, 242, 0.0875)",
              "rgba(242, 242, 242, 0.35)",
            ]}
            style={styles.selectedButtonOverlay}
            start={{ x: 0.2, y: 1 }}
            end={{ x: 0.8, y: 0 }}
          >
            <Text style={styles.selectedButtonText}>{getButtonText()}</Text>
          </LinearGradient>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.filterButtonUnselected}>
      <Text style={styles.unselectedButtonText}>{getButtonText()}</Text>
    </Pressable>
  );
};

const MyApplications = () => {
  const { applications, isLoadingApplications, refetchApplications } =
    useApplication();
  const [selectedStatus, setSelectedStatus] = useState<Status>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filteredApplications = React.useMemo(() => {
    if (!applications) return [];

    if (selectedStatus === "all") return applications;
    return applications.filter((app) => app.state === selectedStatus);
  }, [applications, selectedStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchApplications();
    } catch (error) {
      console.error("Erreur lors du refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoadingApplications) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4717F6" />
      </View>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <ScreenWrapper>
        <View className="flex-1" style={{ backgroundColor: "#F7F7F7" }}>
          <Header
            title="Mes candidatures"
            subtitle="Suis l'avancée de tes candidatures en un coup d'œil  👀"
          />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#4717F6"
                colors={["#4717F6"]}
                progressBackgroundColor="#ffffff"
              />
            }
          >
            <Text style={{ color: "#6B7280", fontSize: 16 }}>
              Vous n'avez pas encore de candidatures
            </Text>
            <Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 8 }}>
              Tirez vers le bas pour actualiser
            </Text>
          </ScrollView>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: "#F7F7F7" }}>
        <Header
          title="Mes candidatures"
          subtitle="Suis l'avancée de tes candidatures en un coup d'œil  👀"
        />

        <View style={styles.filtersContainer}>
          <LinearGradient
            colors={["#C6B7FC", "#C6B7FC"]}
            style={styles.filtersGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <LinearGradient
              colors={[
                "rgba(242, 242, 242, 0.1625)",
                "rgba(242, 242, 242, 0.65)",
              ]}
              style={styles.filtersOverlay}
              start={{ x: 0.2, y: 1 }}
              end={{ x: 0.8, y: 0 }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScrollContainer}
              >
                <FilterButton
                  status="all"
                  selectedStatus={selectedStatus}
                  onPress={() => setSelectedStatus("all")}
                />
                <FilterButton
                  status="pending"
                  selectedStatus={selectedStatus}
                  onPress={() => setSelectedStatus("pending")}
                />
                <FilterButton
                  status="matched"
                  selectedStatus={selectedStatus}
                  onPress={() => setSelectedStatus("matched")}
                />
                <FilterButton
                  status="rejected"
                  selectedStatus={selectedStatus}
                  onPress={() => setSelectedStatus("rejected")}
                />
                <FilterButton
                  status="accepted"
                  selectedStatus={selectedStatus}
                  onPress={() => setSelectedStatus("accepted")}
                />
              </ScrollView>
            </LinearGradient>
          </LinearGradient>
        </View>

        <ScrollView
          className="flex-1 px-3"
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#4717F6"
              colors={["#4717F6"]}
              progressBackgroundColor="#ffffff"
            />
          }
        >
          {filteredApplications.map((application) => (
            <Pressable
              key={application.id}
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <View style={styles.applicationCard}>
                <LinearGradient
                  colors={["#8464F9", "#F2F2F2"]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: -3 }}
                  end={{ x: 0, y: 0.9 }}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.logoContainer}>
                        <CompanyLogo company={application.job_post?.company} />
                      </View>
                      <View style={styles.companyInfoContainer}>
                        <Text style={styles.companyName}>
                          {application.job_post?.company?.company_name ||
                            "Entreprise"}
                        </Text>
                        <Text style={styles.jobTitle}>
                          {application.job_post?.title || "Titre non spécifié"}
                        </Text>
                        {application.job_post?.contract_type && (
                          <View style={styles.contractRow}>
                            <Briefcase size={16} color="black" />
                            <Text style={styles.contractText}>
                              {application.job_post.contract_type}
                            </Text>
                          </View>
                        )}
                      </View>
                      <StatusBadge status={application.state} />
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                      {application.job_post?.salary_range && (
                        <View style={styles.infoRowNew}>
                          <BadgeEuro size={18} color="black" />
                          <Text style={styles.infoTextNew}>
                            {application.job_post.salary_range}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.footerRight}>
                      <View style={styles.infoRowNew}>
                        <Clock size={18} color="black" />
                        <Text style={styles.infoTextNew}>
                          Postulé le{" "}
                          {new Date(application.created_at).toLocaleDateString(
                            "fr-FR"
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingLeft: 12,
    marginBottom: 28,
  },
  filtersGradient: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  filtersOverlay: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 4,
  },
  filtersScrollContainer: {
    paddingHorizontal: 4,
    gap: 8,
  },
  filterButtonSelected: {
    marginRight: 8,
  },
  selectedButtonGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedButtonOverlay: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "white",
  },
  filterButtonUnselected: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E5E5E5",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  unselectedButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#525252",
  },
  scrollContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  applicationCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // shadow for android
    elevation: 1.8,
  },
  cardGradient: {
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 0,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
  },
  companyLogo: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  companyInfoContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "black",
    lineHeight: 24,
    textTransform: "uppercase",
  },

  infoRowNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoTextNew: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
  },
  contractRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  contractText: {
    fontSize: 12,
    color: "black",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MyApplications;
