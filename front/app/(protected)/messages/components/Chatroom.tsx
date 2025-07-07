import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import { Chatroom } from "@/types/interfaces";
import InputBox from "./InputBox";
import MessageBox from "./MessageBox";
import { Message } from "@/types/interfaces";
import { useAuth } from "@/context/AuthContext";
import { useNavigationVisibility } from "@/context/NavigationVisibilityContext";
import { useMessages } from "@/lib/hooks/useMessages";
import { useChatWS } from "@/hooks/useChatWS";

const { height: screenHeight } = Dimensions.get("window");

// Fonction pour obtenir les dimensions adaptatives
const getAdaptiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;

  return {
    headerPadding: isSmallScreen ? 14 : 16,
    titleSize: isSmallScreen ? 16 : 18,
    subtitleSize: isSmallScreen ? 13 : 14,
    messagePadding: isSmallScreen ? 12 : 16,
    iconSize: isSmallScreen ? 20 : 24,
  };
};

interface ChatroomProps {
  readonly onBack: () => void;
  readonly chatroomId: string;
  readonly chatroomName?: string;
}

const mockMessages: Message[] = [];

export default function ChatroomView({
  onBack,
  chatroomId,
  chatroomName,
}: ChatroomProps) {
  const [chatroom, setChatroom] = useState<Chatroom>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const { user, role } = useAuth();
  const { hideNavigation, showNavigation } = useNavigationVisibility();
  const adaptive = getAdaptiveStyles();

  // Masquer la navigation quand le composant se monte
  useEffect(() => {
    hideNavigation();

    // Réafficher la navigation quand le composant se démonte
    return () => {
      showNavigation();
    };
  }, [hideNavigation, showNavigation]);

  // Couleurs selon le rôle
  const roleColors = {
    candidate: ["#4717F6", "#6366f1"] as const,
    recruiter: ["#7C3AED", "#8B5CF6"] as const,
  };

  const colors = roleColors[role || "candidate"];

  const { useMessagesByRoom, addMessageToCache } = useMessages();

  // Hook pour récupérer l'historique des messages
  const { data: historicalMessages, isLoading: isLoadingMessages } =
    useMessagesByRoom(chatroomId);

  // Callbacks stabilisés pour éviter les re-renders
  const handleNewMessage = useCallback(
    (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      // Ajouter aussi au cache React Query
      addMessageToCache(chatroomId, message);
    },
    [chatroomId, addMessageToCache]
  );

  const handleConnect = useCallback(() => {
    console.log("WebSocket connecté");
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("WebSocket déconnecté");
  }, []);

  const {
    sendMessage,
    isConnected,
    isConnecting,
    error: wsError,
  } = useChatWS(chatroomId, handleNewMessage, handleConnect, handleDisconnect);

  // Charger l'historique au montage du composant
  useEffect(() => {
    if (historicalMessages) {
      setMessages(historicalMessages);
    }
  }, [historicalMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user?.id) return;

    const messageData = {
      content: newMessage,
      sender: user.id.toString(),
      room: chatroomId,
    };

    const success = sendMessage(messageData);
    if (success) {
      setNewMessage("");
    } else {
      console.error("Erreur lors de l'envoi du message");
    }
  };

  console.log("CHATROOM", chatroom);

  return (
    <ScreenWrapper>
      {/* Header moderne avec gradient */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={colors}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={[styles.headerContent, { padding: adaptive.headerPadding }]}
          >
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <ArrowLeft size={adaptive.iconSize} color="white" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text
                style={[styles.headerTitle, { fontSize: adaptive.titleSize }]}
                numberOfLines={1}
              >
                {chatroomName || "Conversation"}
              </Text>
              <View style={styles.headerSubtitle}>
                <MessageCircle size={14} color="rgba(255, 255, 255, 0.8)" />
                <Text
                  style={[
                    styles.headerSubtitleText,
                    { fontSize: adaptive.subtitleSize },
                  ]}
                >
                  Discussion en cours
                </Text>
              </View>
            </View>

            <View style={styles.spacer} />
          </View>
        </LinearGradient>
      </View>

      {/* Zone des messages */}
      <View style={styles.messagesContainer}>
        {messages.length > 0 ? (
          <ScrollView
            style={styles.messagesScrollView}
            contentContainerStyle={[
              styles.messagesContent,
              { padding: adaptive.messagePadding },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message, index) => (
              <MessageBox
                key={`message-${message.sender}-${message.sent_at}-${index}`}
                message={message}
                isSender={message.sender === user?.id.toString()}
                userRole={role || "candidate"}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyMessagesContainer}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={colors}
                style={styles.emptyIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MessageCircle size={32} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.emptyTitle}>Commencez la conversation</Text>
            <Text style={styles.emptySubtitle}>
              Écrivez votre premier message pour démarrer la discussion
            </Text>
          </View>
        )}
      </View>

      {/* Zone de saisie */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {role === "candidate" && messages.length === 0 ? (
          <View
            style={{
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ color: "#6B7280", fontSize: 15, textAlign: "center" }}
            >
              Seul le recruteur peut initier la conversation. Vous pourrez
              répondre dès qu'il aura envoyé un premier message.
            </Text>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <InputBox
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSendMessage}
              placeholder="Tapez votre message..."
              disabled={false}
              userRole={role || "candidate"}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    borderRadius: 0, // Pas de bordure arrondie pour le header principal
    overflow: "hidden",
  },
  headerGradient: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerSubtitleText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  spacer: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
});
