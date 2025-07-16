import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

type UserRole = "candidate" | "recruiter" | null;

interface Props {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
}

export default function RoleChoice({ onRoleSelect, onBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Titre */}
        <Text style={styles.title}>Choix du rôle</Text>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          {/* Écran/tableau */}
          <View style={styles.screenContainer}>
            <LinearGradient
              colors={["#4717F6", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.screen}
            />
            {/* Écran blanc à côté */}
            <View style={styles.whiteScreen} />
          </View>

          {/* Personnage */}
          <View style={styles.characterContainer}>
            {/* Tête */}
            <View style={styles.head} />
            {/* Corps */}
            <View style={styles.body}>
              <LinearGradient
                colors={["#4717F6", "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bodyGradient}
              />
            </View>
            {/* Bras pointant */}
            <View style={styles.arm} />
            {/* Jambes */}
            <View style={styles.legs} />
          </View>

          {/* Lignes de sol */}
          <View style={styles.groundLines} />
        </View>

        {/* Spacer pour pousser les boutons en bas */}
        <View style={styles.spacer} />

        {/* Boutons de choix */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.roleButton}
            onPress={() => onRoleSelect("candidate")}
          >
            <LinearGradient
              colors={["#4717F6", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.roleButtonGradient}
            >
              <Text style={styles.roleButtonText}>Je suis candidat 👨‍💻</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={[styles.roleButton, styles.recruiterButton]}
            onPress={() => onRoleSelect("recruiter")}
          >
            <View style={styles.recruiterButtonContent}>
              <Text style={styles.recruiterButtonText}>
                Je suis recruteur 👔
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32, // Titre plus haut
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 60,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    maxHeight: 300,
  },
  screenContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 16,
  },
  screen: {
    width: 120,
    height: 80,
    borderRadius: 8,
    position: "relative",
  },
  whiteScreen: {
    width: 100,
    height: 70,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  characterContainer: {
    alignItems: "center",
    position: "relative",
  },
  head: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FDB4A6", // Couleur peau
    marginBottom: 4,
  },
  body: {
    width: 24,
    height: 40,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  bodyGradient: {
    flex: 1,
    width: "100%",
  },
  arm: {
    position: "absolute",
    right: -16,
    top: 36,
    width: 20,
    height: 4,
    backgroundColor: "#4717F6",
    borderRadius: 2,
    transform: [{ rotate: "-20deg" }],
  },
  legs: {
    width: 28,
    height: 16,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  groundLines: {
    position: "absolute",
    bottom: -10,
    width: 200,
    height: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  buttonsContainer: {
    paddingBottom: 40,
    gap: 16,
  },
  roleButton: {
    borderRadius: 28,
    overflow: "hidden",
    ...(Platform.OS === "android"
      ? {
          elevation: 6,
        }
      : {
          shadowColor: "#4717F6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        }),
  },
  roleButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  roleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  recruiterButton: {
    ...(Platform.OS === "android"
      ? {
          elevation: 3,
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }),
  },
  recruiterButtonContent: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4717F6",
    borderRadius: 28,
  },
  recruiterButtonText: {
    color: "#4717F6",
    fontSize: 16,
    fontWeight: "700",
  },
});
