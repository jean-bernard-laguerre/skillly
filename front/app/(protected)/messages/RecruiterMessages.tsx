import React from "react";
import MessagesList from "./components/MessagesList";
import { Chatroom } from "@/types/interfaces";

// Mock data - à remplacer par des données réelles de l'API
const chatrooms: Chatroom[] = [
  {
    id: "1",
    name: "Marie Dupont - Frontend Dev",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jean Martin - Backend Dev",
    created_at: new Date(Date.now() - 86400000).toISOString(), // Hier
  },
  {
    id: "3",
    name: "Sophie Bernard - UX Designer",
    created_at: new Date(Date.now() - 172800000).toISOString(), // Il y a 2 jours
  },
];

export default function RecruiterMessages() {
  return (
    <MessagesList
      userRole="recruiter"
      chatrooms={chatrooms}
      isLoading={false}
    />
  );
}
