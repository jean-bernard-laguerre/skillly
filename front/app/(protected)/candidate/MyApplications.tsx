import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApplication } from "@/lib/hooks/useApplication";
import {
  Check,
  X,
  Clock,
  Star,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react-native";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";

type Status = "all" | "pending" | "matched" | "rejected" | "accepted";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "accepted":
        return {
          backgroundColor: "#36E9CD",
          textColor: "#ffffff",
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
          textColor: "#ffffff",
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
  const { applications, isLoadingApplications } = useApplication();
  const [selectedStatus, setSelectedStatus] = useState<Status>("all");

  const filteredApplications = React.useMemo(() => {
    if (!applications) return [];

    if (selectedStatus === "all") return applications;
    return applications.filter((app) => app.state === selectedStatus);
  }, [applications, selectedStatus]);

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
        <View className="flex-1 justify-center items-center bg-gray-100">
          <Header
            title="Mes candidatures"
            subtitle="Suis l'avancée de tes candidatures en un coup d'œil  👀"
          />
          <Text className="text-gray-600">
            Vous n'avez pas encore de candidatures
          </Text>
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

        {/* Container avec gradient pour les filtres */}
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
        >
          {filteredApplications.map((application) => (
            <Pressable
              key={application.id}
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <View style={styles.applicationCard}>
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.95)",
                    "rgba(255, 255, 255, 1)",
                  ]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Header de la card */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>
                        {application.job_post?.title || "Titre non spécifié"}
                      </Text>
                      <StatusBadge status={application.state} />
                    </View>
                  </View>

                  {/* Informations du poste */}
                  <View style={styles.cardInfo}>
                    {application.job_post?.location && (
                      <View style={styles.infoRow}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.infoText}>
                          {application.job_post.location}
                        </Text>
                      </View>
                    )}

                    {application.job_post?.contract_type && (
                      <View style={styles.infoRow}>
                        <Briefcase size={16} color="#6B7280" />
                        <Text style={styles.infoText}>
                          {application.job_post.contract_type}
                        </Text>
                      </View>
                    )}

                    {application.job_post?.salary_range && (
                      <View style={styles.infoRow}>
                        <DollarSign size={16} color="#6B7280" />
                        <Text style={styles.infoText}>
                          {application.job_post.salary_range}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Footer avec date */}
                  <View style={styles.cardFooter}>
                    <View style={styles.dateContainer}>
                      <Clock size={14} color="#9CA3AF" />
                      <Text style={styles.dateText}>
                        Postulé le{" "}
                        {new Date(application.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </Text>
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
    marginBottom: 4,
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
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    // Shadow for Android
    elevation: 1,
  },
  selectedButtonOverlay: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    // Additional shadow
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
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    marginRight: 8,
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
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },
  cardGradient: {
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: "center",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cardInfo: {
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
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

export default MyApplications;
