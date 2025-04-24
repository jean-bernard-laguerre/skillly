import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import Modal from "@/components/ui/Modal";
import CreateJobPost from "./jobs/create";

export default function Jobs() {
  const { jobPosts, isLoadingJobPosts, jobPostsError } = useJobPost();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const renderContent = () => {
    if (isLoadingJobPosts) {
      return (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (jobPostsError) {
      return (
        <View className="items-center justify-center flex-1">
          <Text className="mb-4 text-red-500">
            Erreur lors du chargement des offres d'emploi
          </Text>
          <Pressable
            className="p-4 bg-blue-500 rounded-lg"
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Text className="font-semibold text-center text-white">
              Créer une offre
            </Text>
          </Pressable>
        </View>
      );
    }

    if (jobPosts?.length === 0) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="mb-4 text-center text-gray-500">
            Aucune offre d'emploi pour le moment
          </Text>
          <Pressable
            className="p-4 bg-blue-500 rounded-lg"
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Text className="font-semibold text-center text-white">
              Créer une offre
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1 px-4">
        {jobPosts?.map((job) => (
          <View key={job.id} className="p-4 mb-4 bg-white rounded-lg shadow-sm">
            <Text className="mb-2 text-xl font-semibold">{job.title}</Text>
            <Text className="mb-2 text-gray-600">{job.location}</Text>
            <Text className="mb-2 text-gray-600">{job.contract_type}</Text>
            <Text className="mb-2 text-gray-600">{job.salary_range}</Text>
            <Text className="mb-2 text-gray-600">
              Expire le: {new Date(job.expiration_date).toLocaleDateString()}
            </Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {job.skills.map((skill) => (
                <View key={skill.id} className="px-2 py-1 bg-blue-100 rounded">
                  <Text className="text-sm text-blue-800">{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {renderContent()}

      <Modal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        title="Créer une offre d'emploi"
      >
        <CreateJobPost onSuccess={() => setIsCreateModalVisible(false)} />
      </Modal>
    </View>
  );
}
