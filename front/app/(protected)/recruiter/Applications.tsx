import React, { useState } from "react";
import { View } from "react-native";
import JobSelector from "./components/JobSelector";
import ApplicationsList from "./components/ApplicationsList";
import { Job, Application } from "@/types/interfaces";

export default function Applications() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      jobId: "1",
      candidateName: "Marie Dupont",
      jobTitle: "Développeur Frontend",
      date: "2024-03-20",
      status: "pending",
    },
    {
      id: "2",
      jobId: "1",
      candidateName: "Jean Martin",
      jobTitle: "Développeur Frontend",
      date: "2024-03-19",
      status: "accepted",
    },
    {
      id: "3",
      jobId: "2",
      candidateName: "Sophie Girard",
      jobTitle: "UX Designer",
      date: "2024-03-18",
      status: "rejected",
    },
  ]);

  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "Développeur Frontend",
      company: "TechCorp",
      location: "Paris",
    },
    {
      id: "2",
      title: "UX Designer",
      company: "DesignStudio",
      location: "Lyon",
    },
    {
      id: "3",
      title: "Développeur Backend",
      company: "TechCorp",
      location: "Paris",
    },
  ]);

  const handleStatusChange = (id: string, status: "accepted" | "rejected") => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  const filteredApplications = applications.filter(
    (app) => app.jobId === selectedJobId
  );

  return (
    <View className="flex-1 bg-gray-50">
      {selectedJobId ? (
        <ApplicationsList
          applications={filteredApplications}
          onStatusChange={handleStatusChange}
          onBack={() => setSelectedJobId(null)}
        />
      ) : (
        <JobSelector
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          applications={applications}
        />
      )}
    </View>
  );
}
