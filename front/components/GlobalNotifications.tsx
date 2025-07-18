import React from "react";
import { useGlobalUnreadMessages } from "@/lib/hooks/useGlobalUnreadMessages";
import { useAuth } from "@/context/AuthContext";

/**
 * Composant invisible qui gère les notifications globales
 * Il doit être placé après les providers dans _layout.tsx
 */
export default function GlobalNotifications() {
  const { user } = useAuth();

  // Activer le hook global WebSocket pour toute l'app
  const globalState = useGlobalUnreadMessages();

  // Ce composant n'affiche rien, il gère juste les notifications en arrière-plan
  return null;
}
