import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useApplication } from "@/lib/hooks/useApplication";
import { Check, X, Clock, Star } from "lucide-react-native";
import ScreenWrapper from "@/navigation/ScreenWrapper";

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
}) => (
  <Pressable
    onPress={onPress}
    className={`px-3 py-1.5 rounded-full mr-2 ${
      selectedStatus === status ? "bg-blue-500" : "bg-gray-200"
    }`}
  >
    <Text
      className={`text-sm ${
        selectedStatus === status ? "text-white" : "text-gray-600"
      }`}
    >
      {status === "all"
        ? "Toutes"
        : status === "pending"
        ? "En attente"
        : status === "matched"
        ? "Matches"
        : status === "rejected"
        ? "Refusées"
        : "Acceptées"}
    </Text>
  </Pressable>
);

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
          <Text className="mb-5 text-2xl font-bold">Mes candidatures</Text>
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
        <Text className="p-4 text-2xl font-bold">Mes candidatures</Text>
        <View className="px-4 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

export default MyApplications;
