import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "@/types/interfaces";

const { height: screenHeight } = Dimensions.get("window");

// Fonction pour obtenir les dimensions adaptatives
const getAdaptiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;

  return {
    fontSize: isSmallScreen ? 14 : 16,
    timeSize: isSmallScreen ? 10 : 11,
    bubblePadding: isSmallScreen ? 12 : 14,
    marginVertical: isSmallScreen ? 4 : 6,
  };
};

interface MessageBoxProps {
  readonly isSender: boolean;
  readonly message: Message;
  readonly userRole?: "candidate" | "recruiter";
}

export default function MessageBox({
  isSender,
  message,
  userRole = "candidate",
}: MessageBoxProps) {
  const adaptive = getAdaptiveStyles();

  // Couleurs selon le rôle et si c'est l'expéditeur
  const roleColors = {
    candidate: {
      sender: ["#4717F6", "#6366f1"] as const,
      receiver: ["#F3F4F6", "#F9FAFB"] as const,
    },
    recruiter: {
      sender: ["#7C3AED", "#8B5CF6"] as const,
      receiver: ["#F3F4F6", "#F9FAFB"] as const,
    },
  };

  const colors = isSender
    ? roleColors[userRole].sender
    : roleColors[userRole].receiver;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      style={[
        styles.messageContainer,
        {
          alignSelf: isSender ? "flex-end" : "flex-start",
          marginVertical: adaptive.marginVertical,
        },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <LinearGradient
          colors={colors}
          style={[styles.messageGradient, { padding: adaptive.bubblePadding }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.messageText,
              {
                fontSize: adaptive.fontSize,
                color: isSender ? "white" : "#374151",
              },
            ]}
          >
            {message.content}
          </Text>
        </LinearGradient>
      </View>

      <Text
        style={[
          styles.timeText,
          {
            fontSize: adaptive.timeSize,
            textAlign: isSender ? "right" : "left",
          },
        ]}
      >
        {formatTime(message.sent_at)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    marginHorizontal: 8,
  },
  messageBubble: {
    borderRadius: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  senderBubble: {
    borderBottomRightRadius: 6,
  },
  receiverBubble: {
    borderBottomLeftRadius: 6,
  },
  messageGradient: {
    borderRadius: 18,
  },
  messageText: {
    fontWeight: "500",
    lineHeight: 20,
  },
  timeText: {
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 4,
    marginHorizontal: 4,
    fontSize: 11,
  },
});
