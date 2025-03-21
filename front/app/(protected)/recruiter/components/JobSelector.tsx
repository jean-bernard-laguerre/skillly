import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Briefcase } from "lucide-react-native";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  applicationsCount: number;
}

interface JobSelectorProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

export default function JobSelector({
  jobs,
  selectedJobId,
  onSelectJob,
}: JobSelectorProps) {
  return (
    <View className="p-4 mb-4">
      <Text className="mb-2 text-lg font-semibold">Sélectionnez une offre</Text>
      <View className="space-y-2">
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
            <View className="flex-row items-center">
              <Briefcase size={20} color="#6366f1" className="mr-2" />
              <View className="flex-1">
                <Text className="font-medium">{job.title}</Text>
                <Text className="text-sm text-gray-600">{job.company}</Text>
                <Text className="text-sm text-gray-500">{job.location}</Text>
              </View>
              <View className="px-2 py-1 bg-indigo-100 rounded-full">
                <Text className="text-sm text-indigo-800">
                  {job.applicationsCount} candidatures
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
