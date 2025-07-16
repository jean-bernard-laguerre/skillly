import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

export interface InfoCardProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string;
  numberOfLines?: number;
  variant?: "default" | "modal";
}

export default function InfoCard({
  icon: Icon,
  iconColor = "#4717F6",
  label,
  value,
  numberOfLines = 2,
  variant = "default",
}: InfoCardProps) {
  const isModal = variant === "modal";

  return (
    <View style={[styles.container, isModal && styles.modalContainer]}>
      <Icon size={isModal ? 20 : 16} color={iconColor} />
      <View style={styles.content}>
        <Text style={[styles.label, isModal && styles.modalLabel]}>
          {label}
        </Text>
        <Text
          style={[styles.value, isModal && styles.modalValue]}
          numberOfLines={numberOfLines}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4717F6",
  },
  modalContainer: {
    marginBottom: 12,
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  modalLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: "none",
  },
  value: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "700",
    lineHeight: 16,
  },
  modalValue: {
    fontSize: 16,
    lineHeight: 20,
  },
});
