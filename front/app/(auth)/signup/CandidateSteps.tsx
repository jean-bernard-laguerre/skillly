import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown } from "lucide-react-native";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { RegisterCredentials } from "@/types/interfaces";

const { height } = Dimensions.get("window");

interface CommonFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  commonData: CommonFormData;
  onBack: () => void;
}

interface CandidateFormData {
  bio: string;
  experienceYears: number;
}

export default function CandidateSteps({ commonData, onBack }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [candidateData, setCandidateData] = useState<CandidateFormData>({
    bio: "",
    experienceYears: 0,
  });

  const { registerCandidate, isRegisteringCandidate, registerCandidateError } =
    useAuthMutation();

  const steps = [
    {
      title: "Présentation Rapide",
      subtitle: "Parle-nous un peu de toi en 2-3 lignes",
    },
    {
      title: "Expérience",
      subtitle: "Depuis combien d'années codes-tu ?",
    },
  ];

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape, soumettre l'inscription
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const registrationData: RegisterCredentials = {
      firstName: commonData.firstName,
      lastName: commonData.lastName,
      email: commonData.email,
      password: commonData.password,
      bio: candidateData.bio,
      experienceYears: candidateData.experienceYears,
      preferedContract: "CDI",
      preferedJob: "",
      location: "",
      availability: "",
      resumeID: 0,
      certifications: [],
      skills: [],
    };

    registerCandidate(registrationData);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return candidateData.bio.trim().length >= 10;
      case 1:
        return candidateData.experienceYears >= 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <TextInput
              style={styles.bioInput}
              value={candidateData.bio}
              onChangeText={(text) =>
                setCandidateData({ ...candidateData, bio: text })
              }
              placeholder="Parle-nous un peu de toi en 2-3 lignes"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.pickerContainer}>
              <Pressable style={styles.picker}>
                <Text style={styles.pickerText}>
                  {candidateData.experienceYears === 0
                    ? "Depuis combien d'années codes-tu ?"
                    : `${candidateData.experienceYears} année${
                        candidateData.experienceYears > 1 ? "s" : ""
                      }`}
                </Text>
                <ChevronDown size={20} color="#4717F6" />
              </Pressable>

              {/* Boutons rapides pour sélectionner les années */}
              <View style={styles.yearButtons}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((years) => (
                  <Pressable
                    key={years}
                    style={[
                      styles.yearButton,
                      candidateData.experienceYears === years &&
                        styles.yearButtonSelected,
                    ]}
                    onPress={() =>
                      setCandidateData({
                        ...candidateData,
                        experienceYears: years,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.yearButtonText,
                        candidateData.experienceYears === years &&
                          styles.yearButtonTextSelected,
                      ]}
                    >
                      {years === 0
                        ? "Débutant"
                        : `${years} an${years > 1 ? "s" : ""}`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Titre */}
          <Text style={styles.title}>{steps[currentStep].title}</Text>

          {/* Sous-titre */}
          <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>

          {/* Affichage des erreurs */}
          {registerCandidateError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {registerCandidateError.message}
              </Text>
            </View>
          )}

          {/* Contenu de l'étape */}
          {renderStepContent()}

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Section bas */}
          <View style={styles.bottomSection}>
            {/* Indicateur d'étapes */}
            <View style={styles.stepsIndicator}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index === currentStep
                      ? styles.stepDotActive
                      : styles.stepDotInactive,
                    index < currentStep && styles.stepDotCompleted,
                  ]}
                />
              ))}
            </View>

            {/* Bouton continuer */}
            <Pressable
              style={[
                styles.continueButton,
                !isCurrentStepValid() && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isCurrentStepValid() || isRegisteringCandidate}
            >
              <LinearGradient
                colors={
                  isCurrentStepValid()
                    ? ["#4717F6", "#6366f1"]
                    : ["#9CA3AF", "#9CA3AF"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {isRegisteringCandidate
                    ? "Inscription..."
                    : currentStep === steps.length - 1
                    ? "Terminer"
                    : "Continuer"}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 32, // Titre plus haut
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  stepContent: {
    flex: 1,
  },
  bioInput: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    minHeight: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    gap: 24,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#4717F6",
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  yearButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  yearButtonSelected: {
    backgroundColor: "#4717F6",
    borderColor: "#4717F6",
  },
  yearButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  yearButtonTextSelected: {
    color: "#FFFFFF",
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: "center",
    gap: 24,
  },
  stepsIndicator: {
    flexDirection: "row",
    gap: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepDotActive: {
    backgroundColor: "#4717F6",
  },
  stepDotInactive: {
    backgroundColor: "#E5E7EB",
  },
  stepDotCompleted: {
    backgroundColor: "#4717F6",
  },
  continueButton: {
    borderRadius: 28,
    overflow: "hidden",
    width: "100%",
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
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
