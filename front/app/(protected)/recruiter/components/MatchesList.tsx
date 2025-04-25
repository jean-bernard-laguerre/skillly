import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Match } from "@/types/interfaces";

interface MatchesListProps {
  jobId: string;
  onBack: () => void;
}

export default function MatchesList({ jobId, onBack }: MatchesListProps) {
  const { matches } = useJobPost();
  const job = matches?.find((job) => job.id === jobId);

  return (
    <View className="flex-1">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-4">
          <Text className="text-blue-500">Retour</Text>
        </Pressable>
        <Text className="text-xl font-semibold">{job?.title}</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {job?.matches?.map((match: Match) => (
          <View
            key={match.id}
            className="p-4 mb-4 bg-white rounded-lg shadow-sm"
          >
            <Text className="text-lg font-semibold">{match.user.name}</Text>
            <Text className="text-gray-600">{match.user.email}</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {match.user.skills?.map((skill) => (
                <View key={skill.id} className="px-2 py-1 bg-blue-100 rounded">
                  <Text className="text-sm text-blue-800">{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
