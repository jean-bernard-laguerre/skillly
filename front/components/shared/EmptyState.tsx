import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

export interface EmptyStateProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle: string;
  size?: "small" | "medium" | "large";
}

export default function EmptyState({
  icon: Icon,
  iconColor = "#6B7280",
  title,
  subtitle,
  size = "medium",
}: EmptyStateProps) {
  const getIconSize = () => {
    switch (size) {
      case "small":
        return 32;
      case "large":
        return 48;
      default:
        return 40;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          size === "large" && styles.largeIconContainer,
        ]}
      >
        <Icon size={getIconSize()} color={iconColor} />
      </View>
      <Text style={[styles.title, size === "large" && styles.largeTitle]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, size === "large" && styles.largeSubtitle]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 40,
    marginBottom: 16,
  },
  largeIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  largeSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
