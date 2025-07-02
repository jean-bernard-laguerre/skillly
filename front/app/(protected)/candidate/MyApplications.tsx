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
import { Check, X, Clock, Star } from "lucide-react-native";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";

type Status = "all" | "pending" | "matched" | "rejected" | "accepted";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "accepted":
      return (
        <View className="px-2 py-1 bg-green-100 rounded">
          <Text className="text-sm text-green-800">Acceptée</Text>
        </View>
      );
    case "rejected":
      return (
        <View className="px-2 py-1 bg-red-100 rounded">
          <Text className="text-sm text-red-800">Refusée</Text>
        </View>
      );
    case "matched":
      return (
        <View className="px-2 py-1 bg-purple-100 rounded">
          <Text className="text-sm text-purple-800">Match</Text>
        </View>
      );
    default:
      return (
        <View className="px-2 py-1 bg-yellow-100 rounded">
          <Text className="text-sm text-yellow-800">En attente</Text>
        </View>
      );
  }
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
        <ActivityIndicator size="large" color="#0000ff" />
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
      <View className="flex-1 bg-gray-100">
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

        <ScrollView className="flex-1 px-4">
          {filteredApplications.map((application) => (
            <View
              key={application.id}
              className="p-4 mb-4 bg-white rounded-lg shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-semibold">
                  {application.job_post?.title || "Titre non spécifié"}
                </Text>
                <StatusBadge status={application.state} />
              </View>
              {application.job_post?.location && (
                <Text className="mb-2 text-gray-600">
                  {application.job_post.location}
                </Text>
              )}
              {application.job_post?.contract_type && (
                <Text className="mb-2 text-gray-600">
                  {application.job_post.contract_type}
                </Text>
              )}
              {application.job_post?.salary_range && (
                <Text className="mb-2 text-gray-600">
                  {application.job_post.salary_range}
                </Text>
              )}
              <View className="flex-row gap-2 items-center mt-2">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm text-gray-500">
                  Postulé le{" "}
                  {new Date(application.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
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
});

export default MyApplications;
