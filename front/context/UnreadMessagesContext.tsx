import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UnreadMessagesContextType {
  // Compteurs par conversation
  unreadCountByRoom: Record<string, number>;

  // Compteur total
  totalUnreadCount: number;

  // Actions
  markRoomAsRead: (roomId: string) => void;
  incrementUnreadCount: (roomId: string) => void;
  setUnreadCount: (roomId: string, count: number) => void;

  // Initialisation
  initializeUnreadCounts: (
    rooms: Array<{ id: string; unreadCount?: number }>
  ) => void;
}

const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);

interface UnreadMessagesProviderProps {
  children: ReactNode;
}

export function UnreadMessagesProvider({
  children,
}: UnreadMessagesProviderProps) {
  const { user } = useAuth();
  const [unreadCountByRoom, setUnreadCountByRoom] = useState<
    Record<string, number>
  >({});

  // Clé pour le stockage local basée sur l'utilisateur
  const getStorageKey = () => `unread_messages_${user?.id || "guest"}`;

  // Charger les compteurs depuis le stockage local
  useEffect(() => {
    if (!user?.id) return;

    const loadUnreadCounts = async () => {
      try {
        const stored = await AsyncStorage.getItem(getStorageKey());
        if (stored) {
          const counts = JSON.parse(stored);
          setUnreadCountByRoom(counts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des messages non lus:", error);
      }
    };

    loadUnreadCounts();
  }, [user?.id]);

  // Sauvegarder les compteurs dans le stockage local
  const saveUnreadCounts = useCallback(
    async (counts: Record<string, number>) => {
      try {
        await AsyncStorage.setItem(getStorageKey(), JSON.stringify(counts));
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des messages non lus:",
          error
        );
      }
    },
    [user?.id]
  );

  // Calculer le total des messages non lus
  const totalUnreadCount = Object.values(unreadCountByRoom || {}).reduce(
    (total, count) => total + (count || 0),
    0
  );

  // Marquer une conversation comme lue
  const markRoomAsRead = useCallback(
    (roomId: string) => {
      setUnreadCountByRoom((prev) => {
        const newCounts = { ...prev };
        delete newCounts[roomId]; // Supprimer complètement la clé si lu
        saveUnreadCounts(newCounts);
        return newCounts;
      });
    },
    [saveUnreadCounts]
  );

  // Incrémenter le compteur d'une conversation
  const incrementUnreadCount = useCallback(
    (roomId: string) => {
      setUnreadCountByRoom((prev) => {
        const newCounts = {
          ...prev,
          [roomId]: (prev[roomId] || 0) + 1,
        };
        saveUnreadCounts(newCounts);
        return newCounts;
      });
    },
    [saveUnreadCounts]
  );

  // Définir le compteur d'une conversation
  const setUnreadCount = useCallback(
    (roomId: string, count: number) => {
      setUnreadCountByRoom((prev) => {
        const newCounts = { ...prev };
        if (count <= 0) {
          delete newCounts[roomId];
        } else {
          newCounts[roomId] = count;
        }
        saveUnreadCounts(newCounts);
        return newCounts;
      });
    },
    [saveUnreadCounts]
  );

  // Initialiser les compteurs depuis l'API
  const initializeUnreadCounts = useCallback(
    (rooms: Array<{ id: string; unreadCount?: number }>) => {
      const newCounts: Record<string, number> = {};
      rooms.forEach((room) => {
        if (room.unreadCount && room.unreadCount > 0) {
          newCounts[room.id] = room.unreadCount;
        }
      });
      setUnreadCountByRoom(newCounts);
      saveUnreadCounts(newCounts);
    },
    [saveUnreadCounts]
  );

  // Réinitialiser quand l'utilisateur change
  useEffect(() => {
    if (!user) {
      setUnreadCountByRoom({});
    }
  }, [user]);

  const value: UnreadMessagesContextType = {
    unreadCountByRoom,
    totalUnreadCount,
    markRoomAsRead,
    incrementUnreadCount,
    setUnreadCount,
    initializeUnreadCounts,
  };

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages(): UnreadMessagesContextType {
  const context = useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error(
      "useUnreadMessages must be used within an UnreadMessagesProvider"
    );
  }
  return context;
}
