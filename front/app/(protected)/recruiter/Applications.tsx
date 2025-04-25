import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import ApplicationsList from "./components/ApplicationsList";
import MatchesList from "./components/MatchesList";
import JobSelector from "./components/JobSelector";

type Tab = "applications" | "matches";

export default function Applications() {
  const [selectedTab, setSelectedTab] = useState<Tab>("applications");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { applications, matches, isLoadingApplications, isLoadingMatches } =
    useJobPost();

  const renderTabContent = () => {
    if (selectedTab === "applications") {
      if (selectedJobId) {
        return (
          <ApplicationsList
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
          />
        );
      }
      return (
        <JobSelector
          jobs={applications || []}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          type="applications"
        />
      );
    }

    if (selectedTab === "matches") {
      if (selectedJobId) {
        return (
          <MatchesList
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
          />
        );
      }
      return (
        <JobSelector
          jobs={matches || []}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          type="matches"
        />
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row border-b border-gray-200">
        <Pressable
          className={`flex-1 p-4 ${
            selectedTab === "applications" ? "border-b-2 border-blue-500" : ""
          }`}
          onPress={() => setSelectedTab("applications")}
        >
          <Text
            className={`text-center font-semibold ${
              selectedTab === "applications" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Candidatures
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 p-4 ${
            selectedTab === "matches" ? "border-b-2 border-blue-500" : ""
          }`}
          onPress={() => setSelectedTab("matches")}
        >
          <Text
            className={`text-center font-semibold ${
              selectedTab === "matches" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            Matches
          </Text>
        </Pressable>
      </View>

      {renderTabContent()}
    </View>
  );
}
