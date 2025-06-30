import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Briefcase } from "lucide-react-native";
import { JobSelectorProps } from "@/types/interfaces";

export default function JobSelector({
  jobs,
  selectedJobId,
  onSelectJob,
  type,
}: JobSelectorProps) {
  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-lg font-semibold">Sélectionnez une offre</Text>
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 9 }}>
        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            className={`p-4 rounded-lg border ${
              selectedJobId === job.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 bg-white"
            }`}
            onPress={() => onSelectJob(job.id)}
          >
            <View className="flex-row gap-2 items-center">
              <Briefcase size={20} color="#6366f1" className="mr-2" />
              <View className="flex-1">
                <Text className="font-medium">{job.title}</Text>
                <Text className="text-sm text-gray-600">{job.location}</Text>
                <Text className="text-sm text-gray-500">
                  {job.contract_type}
                </Text>
              </View>
              <View className="px-2 py-1 bg-indigo-100 rounded-full">
                <Text className="text-sm text-indigo-800">
                  {type === "applications"
                    ? job.applications?.filter((app) => app.state !== "matched")
                        .length || 0
                    : job.matches?.length || 0}{" "}
                  {type === "applications" ? "candidature(s)" : "match(es)"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
