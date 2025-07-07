import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, LucideIcon } from "lucide-react-native";

export interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  colors?: [string, string];
  icon?: LucideIcon;
  iconSize?: number;
  rightContent?: React.ReactNode;
}

export default function CommonHeader({
  title,
  subtitle,
  onBack,
  colors = ["#4717F6", "#6366f1"],
  icon: Icon,
  iconSize = 18,
  rightContent,
}: CommonHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={colors}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.titleContainer,
              !onBack && styles.titleContainerCentered,
            ]}
          >
            <View style={styles.titleSection}>
              {Icon && (
                <Icon size={iconSize} color="rgba(255, 255, 255, 0.9)" />
              )}
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {title}
              </Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          {rightContent && (
            <View style={styles.rightContent}>{rightContent}</View>
          )}

          {onBack && !rightContent && <View style={styles.spacer} />}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
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
    padding: 16,
    minHeight: 80,
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
  titleContainerCentered: {
    paddingHorizontal: 0,
  },
  titleSection: {
    alignItems: "center",
    gap: 6,
    maxWidth: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    maxWidth: 200,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  rightContent: {
    width: 40,
    alignItems: "center",
  },
  spacer: {
    width: 40,
  },
});
