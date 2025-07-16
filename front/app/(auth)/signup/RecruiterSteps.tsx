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

interface RecruiterFormData {
  title: string;
  companyName: string;
  siret: string;
}

export default function RecruiterSteps({ commonData, onBack }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [recruiterData, setRecruiterData] = useState<RecruiterFormData>({
    title: "",
    companyName: "",
    siret: "",
  });

  const { registerRecruiter, isRegisteringRecruiter, registerRecruiterError } =
    useAuthMutation();

  const steps = [
    {
      title: "Informations Professionnelles",
      subtitle: "Parlez-nous de votre poste et votre entreprise",
    },
    {
      title: "Entreprise",
      subtitle: "Informations sur votre entreprise",
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
      title: recruiterData.title,
      company: 0,
      newCompany: {
        CompanyName: recruiterData.companyName,
        SIRET: recruiterData.siret,
      },
    };

    registerRecruiter(registrationData);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return recruiterData.title.trim().length >= 2;
      case 1:
        return (
          recruiterData.companyName.trim().length >= 2 &&
          recruiterData.siret.trim().length >= 9
        );
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Poste occupé</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={recruiterData.title}
                  onChangeText={(text) =>
                    setRecruiterData({ ...recruiterData, title: text })
                  }
                  placeholder="Responsable RH, Talent Acquisition..."
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom de l'entreprise</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={recruiterData.companyName}
                  onChangeText={(text) =>
                    setRecruiterData({ ...recruiterData, companyName: text })
                  }
                  placeholder="Nom de votre entreprise"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>SIRET</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={recruiterData.siret}
                  onChangeText={(text) =>
                    setRecruiterData({ ...recruiterData, siret: text })
                  }
                  placeholder="Numéro SIRET de l'entreprise"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
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
          {registerRecruiterError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {registerRecruiterError.message}
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
              disabled={!isCurrentStepValid() || isRegisteringRecruiter}
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
                  {isRegisteringRecruiter
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
    gap: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#4717F6",
    paddingHorizontal: 0,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
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
