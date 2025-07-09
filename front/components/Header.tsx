import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { useResponsive } from "@/lib/hooks/useResponsive";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

export default function Header({
  title,
  subtitle,
  showNotification = false,
  onNotificationPress,
}: HeaderProps) {
  const responsive = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: subtitle
            ? responsive.config.header.height
            : responsive.config.header.height * 0.75,
          paddingHorizontal: responsive.config.header.padding,
          paddingTop: responsive.config.spacing.md,
          paddingBottom: responsive.config.spacing.sm,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                fontSize: responsive.config.header.titleSize,
                paddingBottom: responsive.config.spacing.xs,
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: responsive.config.header.subtitleSize,
                  marginTop: responsive.config.spacing.xs,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {showNotification && (
          <Pressable
            onPress={onNotificationPress}
            style={[
              styles.notificationButton,
              { padding: responsive.config.spacing.sm },
            ]}
          >
            <Bell size={responsive.config.iconSize.md} color="#6366f1" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "900",
    textAlign: "left",
    color: "#000000",
    paddingTop: 0,
  },
  subtitle: {
    color: "#6B7280",
    fontWeight: "500",
  },
  notificationButton: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 8,
  },
});
