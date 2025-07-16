import React from "react";
import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SendHorizontal, Plus } from "lucide-react-native";
import { useResponsive } from "@/lib/hooks/useResponsive";

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
  const responsive = useResponsive();

  // Couleurs selon le rôle
  const roleColors = {
    candidate: ["#4717F6", "#6366f1"] as const,
    recruiter: ["#7C3AED", "#8B5CF6"] as const,
  };

  const colors = roleColors[userRole];
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={[styles.container, { padding: responsive.config.spacing.md }]}>
      <View style={[styles.inputRow, { gap: responsive.config.spacing.md }]}>
        {/* Bouton plus (pour les futurs attachements) */}
        <TouchableOpacity
          style={[
            styles.attachButton,
            {
              width: responsive.config.button.height,
              height: responsive.config.button.height,
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
                width: responsive.config.button.height,
                height: responsive.config.button.height,
                borderRadius: responsive.config.button.height / 2,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Plus size={responsive.config.iconSize.sm} color="#6B7280" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Input de texte */}
        <View
          style={[
            styles.inputContainer,
            { borderRadius: responsive.config.button.height / 2 },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                height: responsive.config.button.height,
                fontSize: responsive.config.fontSize.md,
                paddingHorizontal: responsive.config.spacing.lg,
                borderRadius: responsive.config.button.height / 2,
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
              width: responsive.config.button.height,
              height: responsive.config.button.height,
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
                width: responsive.config.button.height,
                height: responsive.config.button.height,
                borderRadius: responsive.config.button.height / 2,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <SendHorizontal
              size={responsive.config.iconSize.sm}
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    paddingVertical: 0,
    color: "#374151",
    fontWeight: "500",
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
