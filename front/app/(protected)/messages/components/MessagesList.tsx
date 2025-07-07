import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Users } from "lucide-react-native";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import ChatroomItem from "./ChatroomItem";
import ChatroomView from "./Chatroom";
import { Chatroom } from "@/types/interfaces";

const { height: screenHeight } = Dimensions.get("window");

// Fonction pour obtenir les dimensions adaptatives
const getAdaptiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;

  return {
    padding: isSmallScreen ? 12 : 16,
    emptyIconSize: isSmallScreen ? 60 : 80,
    emptyTitleSize: isSmallScreen ? 18 : 20,
    emptySubtitleSize: isSmallScreen ? 14 : 16,
  };
};

interface MessagesListProps {
  userRole: "candidate" | "recruiter";
  chatrooms: Chatroom[];
  isLoading?: boolean;
}

export default function MessagesList({
  userRole,
  chatrooms,
  isLoading = false,
}: MessagesListProps) {
  const [selectedChatroom, setSelectedChatroom] = useState<string>("");
  const adaptive = getAdaptiveStyles();

  // Configuration selon le rôle
  const roleConfig = {
    candidate: {
      title: "MES CONVERSATIONS",
      subtitle: "Échangez avec vos recruteurs 💬",
      emptyTitle: "Aucune conversation",
      emptySubtitle:
        "Vos conversations avec les recruteurs apparaîtront ici après vos premiers matches.",
      targetType: "recruteurs",
      colors: ["#4717F6", "#6366f1"] as const,
    },
    recruiter: {
      title: "MES CONVERSATIONS",
      subtitle: "Échangez avec vos candidats 💬",
      emptyTitle: "Aucune conversation",
      emptySubtitle:
        "Vos conversations avec les candidats apparaîtront ici après vos premiers matches.",
      targetType: "candidats",
      colors: ["#7C3AED", "#8B5CF6"] as const,
    },
  };

  const config = roleConfig[userRole];

  const handlePress = (chatroom: Chatroom) => {
    setSelectedChatroom(chatroom.id);
  };

  const onBack = () => {
    setSelectedChatroom("");
  };

  // Si une conversation est sélectionnée, afficher la vue de conversation
  if (selectedChatroom) {
    return <ChatroomView onBack={onBack} chatroomId={selectedChatroom} />;
  }

  return (
    <ScreenWrapper>
      <Header title={config.title} subtitle={config.subtitle} />

      <View style={styles.container}>
        {chatrooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={config.colors}
                style={[
                  styles.emptyIconGradient,
                  {
                    width: adaptive.emptyIconSize,
                    height: adaptive.emptyIconSize,
                    borderRadius: adaptive.emptyIconSize / 2,
                  },
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MessageCircle
                  size={adaptive.emptyIconSize * 0.4}
                  color="white"
                />
              </LinearGradient>
            </View>
            <Text
              style={[styles.emptyTitle, { fontSize: adaptive.emptyTitleSize }]}
            >
              {config.emptyTitle}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { fontSize: adaptive.emptySubtitleSize },
              ]}
            >
              {config.emptySubtitle}
            </Text>

            {/* CTA card */}
            <View style={styles.ctaCard}>
              <LinearGradient
                colors={[config.colors[1], config.colors[0]]}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.ctaContent}>
                  <Users size={24} color="white" />
                  <View style={styles.ctaTextContainer}>
                    <Text style={styles.ctaTitle}>Commencez à matcher !</Text>
                    <Text style={styles.ctaSubtitle}>
                      {userRole === "candidate"
                        ? "Postulez aux offres qui vous intéressent"
                        : "Découvrez vos candidats parfaits"}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {chatrooms.map((chatroom) => (
              <ChatroomItem
                key={chatroom.id}
                chatroom={chatroom}
                onPress={handlePress}
                userRole={userRole}
                // TODO: Ajouter lastMessage et unreadCount depuis l'API
                lastMessage="Nouveau message..."
                unreadCount={Math.floor(Math.random() * 3)} // Mock pour demo
              />
            ))}
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyIconGradient: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  ctaCard: {
    width: "100%",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    borderRadius: 16,
    padding: 20,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
});
