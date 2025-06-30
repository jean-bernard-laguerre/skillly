import Modal from "@/components/ui/Modal";
import { useJobPost } from "@/lib/hooks/useJobPost";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import CreateJobPost from "./jobs/create";

export default function Jobs() {
  const { jobPosts, isLoadingJobPosts, jobPostsError } = useJobPost();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const renderContent = () => {
    if (isLoadingJobPosts) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (jobPostsError) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="mb-4 text-red-500">
            Erreur lors du chargement des offres d'emploi
          </Text>
        </View>
      );
    }

    if (jobPosts?.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="mb-4 text-center text-gray-500">
            Aucune offre d'emploi pour le moment
          </Text>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1 px-4 mt-4">
        <View className="gap-4 pb-4">
          {jobPosts?.map((job) => (
            <View
              key={job.id}
              className="p-4 mb-4 bg-white rounded-lg shadow-sm"
            >
              <Text className="mb-2 text-xl font-semibold">{job.title}</Text>
              <Text className="mb-2 text-gray-600">{job.location}</Text>
              <Text className="mb-2 text-gray-600">{job.contract_type}</Text>
              <Text className="mb-2 text-gray-600">{job.salary_range}</Text>
              <Text className="mb-2 text-gray-600">
                Expire le: {new Date(job.expiration_date).toLocaleDateString()}
              </Text>
              <View className="flex-row flex-wrap gap-2 mt-2">
                <Text className="text-sm text-gray-600">Compétences:</Text>
                {job?.skills?.map((skill) => (
                  <View
                    key={skill.id}
                    className="px-2 py-1 bg-blue-100 rounded"
                  >
                    <Text className="text-sm text-blue-800">{skill.name}</Text>
                  </View>
                ))}
              </View>
              <View className="flex-row flex-wrap gap-2 mt-2">
                <Text className="text-sm text-gray-600">Certifications:</Text>
                {job?.certifications?.map((certification) => (
                  <View
                    key={certification.id}
                    className="px-2 py-1 bg-blue-100 rounded"
                  >
                    <Text className="text-sm text-blue-800">
                      {certification.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-gray-100">
        {renderContent()}

        <View className="p-4 bg-white border-t border-gray-200">
          <Pressable
            className="p-4 bg-blue-500 rounded-lg"
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Text className="font-semibold text-center text-white">
              Créer une offre
            </Text>
          </Pressable>
        </View>

        <Modal
          isVisible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          title="Créer une offre d'emploi"
        >
          <CreateJobPost onSuccess={() => setIsCreateModalVisible(false)} />
        </Modal>
      </View>
    </ScreenWrapper>
  );
}
