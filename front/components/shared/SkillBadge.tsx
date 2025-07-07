import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface SkillBadgeProps {
  name: string;
  variant?: "matched" | "regular" | "extra" | "modal" | "certification";
  size?: "small" | "medium" | "large";
}

export default function SkillBadge({
  name,
  variant = "regular",
  size = "medium",
}: SkillBadgeProps) {
  const getStyles = () => {
    let variantBadgeStyle, variantTextStyle, sizeBadgeStyle, sizeTextStyle;

    // Variant styles
    switch (variant) {
      case "matched":
        variantBadgeStyle = styles.matchedBadge;
        variantTextStyle = styles.matchedText;
        break;
      case "extra":
        variantBadgeStyle = styles.extraBadge;
        variantTextStyle = styles.extraText;
        break;
      case "modal":
        variantBadgeStyle = styles.modalBadge;
        variantTextStyle = styles.modalText;
        break;
      case "certification":
        variantBadgeStyle = styles.certificationBadge;
        variantTextStyle = styles.certificationText;
        break;
      default:
        variantBadgeStyle = styles.regularBadge;
        variantTextStyle = styles.regularText;
    }

    // Size styles
    switch (size) {
      case "small":
        sizeBadgeStyle = styles.smallBadge;
        sizeTextStyle = styles.smallText;
        break;
      case "large":
        sizeBadgeStyle = styles.largeBadge;
        sizeTextStyle = styles.largeText;
        break;
      default:
        sizeBadgeStyle = styles.mediumBadge;
        sizeTextStyle = styles.mediumText;
    }

    return {
      baseStyle: [styles.badge, variantBadgeStyle, sizeBadgeStyle],
      textStyle: [styles.text, variantTextStyle, sizeTextStyle],
    };
  };

  const { baseStyle, textStyle } = getStyles();

  return (
    <View style={baseStyle}>
      <Text style={textStyle}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },

  // Variant styles
  matchedBadge: {
    backgroundColor: "#36E9CD",
  },
  matchedText: {
    color: "white",
  },
  regularBadge: {
    backgroundColor: "#6B7280",
  },
  regularText: {
    color: "white",
  },
  extraBadge: {
    backgroundColor: "#9CA3AF",
  },
  extraText: {
    color: "white",
  },
  modalBadge: {
    backgroundColor: "#4717F6",
    shadowColor: "#4717F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalText: {
    color: "white",
  },
  certificationBadge: {
    backgroundColor: "#7C3AED",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  certificationText: {
    color: "white",
  },

  // Size styles
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  smallText: {
    fontSize: 11,
  },
  mediumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mediumText: {
    fontSize: 13,
  },
  largeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  largeText: {
    fontSize: 14,
  },
});
