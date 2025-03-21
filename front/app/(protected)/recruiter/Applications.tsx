import React, { useState } from "react";
import { View } from "react-native";
import JobSelector from "./components/JobSelector";
import ApplicationsList from "./components/ApplicationsList";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  applicationsCount: number;
}

interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
}

export default function Applications() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      jobId: "1",
      candidateName: "Marie Dupont",
      jobTitle: "Développeur Frontend React",
      date: "2024-03-20",
      status: "pending",
    },
    {
      id: "2",
      jobId: "1",
      candidateName: "Jean Martin",
      jobTitle: "Développeur Frontend React",
      date: "2024-03-19",
      status: "accepted",
    },
    {
      id: "3",
      jobId: "2",
      candidateName: "Sophie Bernard",
      jobTitle: "Développeur Backend Node.js",
      date: "2024-03-18",
      status: "rejected",
    },
  ]);

  const jobs: Job[] = [
    {
      id: "1",
      title: "Développeur Frontend React",
      company: "TechCorp",
      location: "Paris",
      applicationsCount: 2,
    },
    {
      id: "2",
      title: "Développeur Backend Node.js",
      company: "TechCorp",
      location: "Paris",
      applicationsCount: 1,
    },
    {
      id: "3",
      title: "UX Designer",
      company: "TechCorp",
      location: "Paris",
      applicationsCount: 0,
    },
  ];

  const handleStatusChange = (
    id: string,
    newStatus: "accepted" | "rejected"
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const filteredApplications = selectedJobId
    ? applications.filter((app) => app.jobId === selectedJobId)
    : [];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1">
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
          />
        )}
      </View>
    </View>
  );
}
