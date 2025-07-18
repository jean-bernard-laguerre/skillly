import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as MessageService from "@/services/message.service";
import { useAuth } from "@/context/AuthContext";

export const useMessages = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query pour récupérer les conversations de l'utilisateur
  const {
    data: chatrooms,
    isLoading: isLoadingChatrooms,
    error: chatroomsError,
    refetch: refetchChatrooms,
  } = useQuery({
    queryKey: ["chatrooms", user?.id],
    queryFn: MessageService.getChatrooms,
    enabled: !!user,
    staleTime: 10000, // 10 secondes - les conversations peuvent changer rapidement
    refetchOnWindowFocus: true, // Refetch quand l'app revient au premier plan
    refetchOnMount: true, // Refetch à chaque montage
  });

  // Hook pour récupérer les messages d'une conversation spécifique
  const useMessagesByRoom = (roomId: string) => {
    return useQuery({
      queryKey: ["messages", roomId],
      queryFn: () => MessageService.getMessagesByRoom(roomId),
      enabled: !!roomId,
      staleTime: 30000, // 30 secondes - les messages en temps réel viennent du WebSocket
      refetchOnWindowFocus: true, // Refetch quand l'app revient au premier plan
    });
  };

  // Mutation pour créer une nouvelle conversation
  const {
    mutate: createChatroom,
    isPending: isCreatingChatroom,
    error: createChatroomError,
  } = useMutation({
    mutationFn: MessageService.createChatroom,
    onSuccess: () => {
      // Invalider les conversations pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
    },
  });

  // Fonction pour ajouter un message au cache local (utilisée par WebSocket)
  const addMessageToCache = (roomId: string, message: any) => {
    queryClient.setQueryData(
      ["messages", roomId],
      (oldMessages: any[] = []) => [...oldMessages, message]
    );

    // Invalider aussi les conversations pour mettre à jour le dernier message
    queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
  };

  // Fonction pour marquer une conversation comme lue
  const markChatroomAsRead = (roomId: string) => {
    // Ici on pourrait ajouter une mutation pour marquer comme lu côté serveur
    // Pour l'instant on invalide juste le cache
    queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
  };

  return {
    // Conversations
    chatrooms,
    isLoadingChatrooms,
    chatroomsError,
    refetchChatrooms,

    // Messages
    useMessagesByRoom,
    addMessageToCache,
    markChatroomAsRead,

    // Création de conversations
    createChatroom,
    isCreatingChatroom,
    createChatroomError,
  };
};
