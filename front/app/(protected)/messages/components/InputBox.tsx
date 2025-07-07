import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SendHorizontal, Plus } from "lucide-react-native";

const { height: screenHeight } = Dimensions.get("window");

// Fonction pour obtenir les dimensions adaptatives
const getAdaptiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;

  return {
    containerPadding: isSmallScreen ? 12 : 16,
    inputHeight: isSmallScreen ? 40 : 44,
    buttonSize: isSmallScreen ? 40 : 44,
    fontSize: isSmallScreen ? 14 : 16,
    iconSize: isSmallScreen ? 18 : 20,
  };
};

interface InputBoxProps {
  readonly value: string;
  readonly onChange: (text: string) => void;
  readonly onSend: () => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly userRole?: "candidate" | "recruiter";
}

export default function InputBox({
  value,
  onChange,
  onSend,
  placeholder = "Tapez un message...",
  disabled = false,
  userRole = "candidate",
}: InputBoxProps) {
  const adaptive = getAdaptiveStyles();

  // Couleurs selon le rôle
  const roleColors = {
    candidate: ["#4717F6", "#6366f1"] as const,
    recruiter: ["#7C3AED", "#8B5CF6"] as const,
  };

  const colors = roleColors[userRole];

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={[styles.container, { padding: adaptive.containerPadding }]}>
      <View style={styles.inputRow}>
        {/* Bouton plus (pour les futurs attachements) */}
        <TouchableOpacity
          style={[
            styles.attachButton,
            {
              width: adaptive.buttonSize,
              height: adaptive.buttonSize,
            },
          ]}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <LinearGradient
            colors={["#F3F4F6", "#E5E7EB"]}
            style={[
              styles.attachGradient,
              {
                width: adaptive.buttonSize,
                height: adaptive.buttonSize,
                borderRadius: adaptive.buttonSize / 2,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Plus size={adaptive.iconSize} color="#6B7280" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Input de texte */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                height: adaptive.inputHeight,
                fontSize: adaptive.fontSize,
              },
            ]}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={canSend ? onSend : undefined}
            blurOnSubmit={false}
          />
        </View>

        {/* Bouton d'envoi */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              width: adaptive.buttonSize,
              height: adaptive.buttonSize,
            },
          ]}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={canSend ? colors : ["#E5E7EB", "#D1D5DB"]}
            style={[
              styles.sendGradient,
              {
                width: adaptive.buttonSize,
                height: adaptive.buttonSize,
                borderRadius: adaptive.buttonSize / 2,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <SendHorizontal
              size={adaptive.iconSize}
              color={canSend ? "white" : "#9CA3AF"}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  attachButton: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  attachGradient: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    color: "#374151",
    fontWeight: "500",
    borderRadius: 22,
    backgroundColor: "transparent",
  },
  sendButton: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sendGradient: {
    justifyContent: "center",
    alignItems: "center",
  },
});
