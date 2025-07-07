import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Clock, User } from "lucide-react-native";
import { Chatroom } from "@/types/interfaces";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Fonction pour obtenir les dimensions adaptatives
const getAdaptiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;

  return {
    cardPadding: isSmallScreen ? 14 : 16,
    avatarSize: isSmallScreen ? 40 : 48,
    titleSize: isSmallScreen ? 16 : 18,
    subtitleSize: isSmallScreen ? 13 : 14,
    timeSize: isSmallScreen ? 11 : 12,
    iconSize: isSmallScreen ? 18 : 20,
  };
};

interface ChatroomItemProps {
  chatroom: Chatroom;
  lastMessage?: string;
  unreadCount?: number;
  onPress: (chatroom: Chatroom) => void;
  userRole?: "candidate" | "recruiter";
}

export default function ChatroomItem({
  chatroom,
  lastMessage = "Commencez une conversation...",
  unreadCount = 0,
  onPress,
  userRole = "candidate",
}: ChatroomItemProps) {
  const adaptive = getAdaptiveStyles();

  // Couleurs selon le rôle
  const roleColors = {
    candidate: ["#4717F6", "#6366f1"] as const,
    recruiter: ["#7C3AED", "#8B5CF6"] as const,
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 jours
      return date.toLocaleDateString("fr-FR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(chatroom)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC"]}
        style={[styles.cardGradient, { padding: adaptive.cardPadding }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          {/* Avatar avec icône */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={roleColors[userRole]}
              style={[
                styles.avatarGradient,
                {
                  width: adaptive.avatarSize,
                  height: adaptive.avatarSize,
                  borderRadius: adaptive.avatarSize / 2,
                },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <User size={adaptive.iconSize} color="white" />
            </LinearGradient>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </View>

          {/* Contenu principal */}
          <View style={styles.contentSection}>
            <View style={styles.headerRow}>
              <Text
                style={[styles.name, { fontSize: adaptive.titleSize }]}
                numberOfLines={1}
              >
                {chatroom.name}
              </Text>
              <View style={styles.timeContainer}>
                <Clock size={adaptive.iconSize - 6} color="#6B7280" />
                <Text style={[styles.time, { fontSize: adaptive.timeSize }]}>
                  {formatTime(chatroom.created_at)}
                </Text>
              </View>
            </View>

            <View style={styles.messageRow}>
              <MessageCircle size={adaptive.iconSize - 6} color="#6B7280" />
              <Text
                style={[
                  styles.lastMessage,
                  { fontSize: adaptive.subtitleSize },
                  unreadCount > 0 && styles.lastMessageUnread,
                ]}
                numberOfLines={1}
              >
                {lastMessage}
              </Text>
            </View>
          </View>

          {/* Indicateur de conversation active */}
          <View style={styles.activeIndicator}>
            <LinearGradient
              colors={roleColors[userRole]}
              style={styles.activeIndicatorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardGradient: {
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  avatarSection: {
    position: "relative",
    marginRight: 14,
  },
  avatarGradient: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF2056",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  unreadText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  contentSection: {
    flex: 1,
    minWidth: 0, // Important pour le text ellipsis
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontWeight: "700",
    color: "#374151",
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(107, 114, 128, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  time: {
    color: "#6B7280",
    fontWeight: "600",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lastMessage: {
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
    fontStyle: "italic",
  },
  lastMessageUnread: {
    color: "#374151",
    fontWeight: "600",
    fontStyle: "normal",
  },
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  activeIndicatorGradient: {
    flex: 1,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
