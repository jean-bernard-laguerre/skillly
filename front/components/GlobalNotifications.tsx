import React from "react";
import { useGlobalUnreadMessages } from "@/lib/hooks/useGlobalUnreadMessages";

/**
 * Composant invisible qui gère les notifications globales
 * Il doit être placé après les providers dans _layout.tsx
 */
export default function GlobalNotifications() {
  // Activer le hook global WebSocket pour toute l'app
  useGlobalUnreadMessages();

  // Ce composant n'affiche rien, il gère juste les notifications en arrière-plan
  return null;
}
