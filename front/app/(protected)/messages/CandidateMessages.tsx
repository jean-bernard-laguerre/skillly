import React from "react";
import MessagesList from "./components/MessagesList";
import { Chatroom } from "@/types/interfaces";

// Mock data - à remplacer par des données réelles de l'API
const chatrooms: Chatroom[] = [
  {
    id: "1",
    name: "TechCorp - Développeur Frontend",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "StartupXYZ - UX Designer",
    created_at: new Date(Date.now() - 86400000).toISOString(), // Hier
  },
  {
    id: "3",
    name: "DigitalAgency - Full Stack Dev",
    created_at: new Date(Date.now() - 172800000).toISOString(), // Il y a 2 jours
  },
];

export default function CandidateMessages() {
  return (
    <MessagesList
      userRole="candidate"
      chatrooms={chatrooms}
      isLoading={false}
    />
  );
}
