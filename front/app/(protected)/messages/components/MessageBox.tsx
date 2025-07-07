import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "@/types/interfaces";
import { useResponsive } from "@/lib/hooks/useResponsive";

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
  const responsive = useResponsive();

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
          marginVertical: responsive.config.spacing.xs,
          marginHorizontal: responsive.config.spacing.sm,
          maxWidth: responsive.config.compactMode ? "85%" : "80%",
        },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.senderBubble : styles.receiverBubble,
          { borderRadius: responsive.config.compactMode ? 14 : 18 },
        ]}
      >
        <LinearGradient
          colors={colors}
          style={[
            styles.messageGradient,
            {
              padding: responsive.config.compactMode
                ? responsive.config.spacing.sm
                : responsive.config.spacing.md,
              borderRadius: responsive.config.compactMode ? 14 : 18,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.messageText,
              {
                fontSize: responsive.config.fontSize.md,
                color: isSender ? "white" : "#374151",
                lineHeight: responsive.config.fontSize.lg,
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
            fontSize: responsive.config.fontSize.xs,
            textAlign: isSender ? "right" : "left",
            marginTop: responsive.config.spacing.xs,
            marginHorizontal: responsive.config.spacing.xs,
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
    // Styles de base, les dimensions sont gérées inline avec responsive
  },
  messageBubble: {
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
    // Styles gérés inline avec responsive
  },
  messageText: {
    fontWeight: "500",
  },
  timeText: {
    color: "#6B7280",
    fontWeight: "500",
  },
});
