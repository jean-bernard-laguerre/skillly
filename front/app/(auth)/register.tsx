import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  BackHandler,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { TabNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { Zap } from "lucide-react-native";
import { useNavigationVisibility } from "@/context/NavigationVisibilityContext";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";

// Composants des étapes
import CommonSignup from "./signup/CommonSignup";
import RoleChoice from "./signup/RoleChoice";
import CandidateSteps from "./signup/CandidateSteps";
import RecruiterSteps from "./signup/RecruiterSteps";
import ScreenWrapper from "@/navigation/ScreenWrapper";

const { width, height } = Dimensions.get("window");

type RegistrationStep =
  | "common"
  | "role-choice"
  | "candidate-steps"
  | "recruiter-steps";
type UserRole = "candidate" | "recruiter" | null;

interface CommonFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("common");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [commonData, setCommonData] = useState<CommonFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showQuickSignup, setShowQuickSignup] = useState(false);

  const { hideNavigation, showNavigation } = useNavigationVisibility();
  const { registerCandidate, registerRecruiter } = useAuthMutation();
  const navigation = useNavigation<TabNavigationProp>();
  const router = useRouter();

  // Masquer la navigation au montage
  useEffect(() => {
    hideNavigation();
    return () => {
      showNavigation();
    };
  }, [hideNavigation, showNavigation]);

  // Gérer le retour de navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      showNavigation();
    });
    return unsubscribe;
  }, [navigation, showNavigation]);

  // Gérer le bouton retour Android hardware
  useEffect(() => {
    const handler = () => {
      showNavigation();
      router.back();
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => sub.remove();
  }, [showNavigation, router]);

  const handleQuickSignup = (role: "candidate" | "recruiter") => {
    if (role === "candidate") {
      registerCandidate({
        firstName: "John",
        lastName: "Doe",
        email: "candidate@mail.com",
        password: "test1234",
        bio: "Développeur passionné",
        location: "Paris",
        skills: [],
        certifications: [],
      });
    } else {
      registerRecruiter({
        firstName: "Jane",
        lastName: "Smith",
        email: "recruiter@mail.com",
        password: "test1234",
        newCompany: {
          CompanyName: "Tech Company",
          SIRET: "123456789",
        },
      });
    }
  };

  const handleCommonDataComplete = (data: CommonFormData) => {
    setCommonData(data);
    setCurrentStep("role-choice");
  };

  const handleRoleChoice = (role: UserRole) => {
    setUserRole(role);
    if (role === "candidate") {
      setCurrentStep("candidate-steps");
    } else if (role === "recruiter") {
      setCurrentStep("recruiter-steps");
    }
  };

  const handleBackToRoleChoice = () => {
    setCurrentStep("role-choice");
    setUserRole(null);
  };

  const handleBackToCommon = () => {
    setCurrentStep("common");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "common":
        return (
          <CommonSignup
            initialData={commonData}
            onComplete={handleCommonDataComplete}
            onLoginPress={() => navigation.navigate("Login")}
          />
        );
      case "role-choice":
        return (
          <RoleChoice
            onRoleSelect={handleRoleChoice}
            onBack={handleBackToCommon}
          />
        );
      case "candidate-steps":
        return (
          <CandidateSteps
            commonData={commonData}
            onBack={handleBackToRoleChoice}
          />
        );
      case "recruiter-steps":
        return (
          <RecruiterSteps
            commonData={commonData}
            onBack={handleBackToRoleChoice}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Background avec cercles blurrés identique au login */}
        <View style={styles.backgroundContainer}>
          <View style={[styles.blurredCircle, styles.circle1]} />
          <View style={[styles.blurredCircle, styles.circle2]} />
          <View style={[styles.blurredCircle, styles.circle3]} />
        </View>

        {/* Boutons d'inscription rapide cachés */}
        <View style={styles.quickSignupContainer}>
          <Pressable
            style={styles.quickSignupToggle}
            onPress={() => setShowQuickSignup(!showQuickSignup)}
          >
            <Zap size={20} color="#FFFFFF" />
          </Pressable>

          {showQuickSignup && (
            <View style={styles.quickSignupButtons}>
              <Pressable
                style={[styles.quickButton, styles.candidateButton]}
                onPress={() => handleQuickSignup("candidate")}
              >
                <Text style={styles.quickButtonText}>C</Text>
              </Pressable>
              <Pressable
                style={[styles.quickButton, styles.recruiterButton]}
                onPress={() => handleQuickSignup("recruiter")}
              >
                <Text style={styles.quickButtonText}>R</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Contenu de l'étape actuelle */}
        {renderCurrentStep()}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.32, // Réduit la hauteur du background
  },
  blurredCircle: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 0,
    borderStyle: "solid",
  },
  circle1: {
    width: width * 0.5, // Réduit
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(71, 23, 246, 0.15)",
    top: -width * 0.18,
    right: -width * 0.1,
    ...(Platform.OS === "android"
      ? { elevation: 8 }
      : {
          shadowColor: "#4717F6",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 25,
        }),
  },
  circle2: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    top: height * 0.03,
    left: -width * 0.08,
    ...(Platform.OS === "android"
      ? { elevation: 5 }
      : {
          shadowColor: "#6366f1",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 18,
        }),
  },
  circle3: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: "rgba(54, 233, 205, 0.1)",
    top: height * 0.09,
    right: width * 0.05,
    ...(Platform.OS === "android"
      ? { elevation: 3 }
      : {
          shadowColor: "#36E9CD",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        }),
  },
  quickSignupContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    alignItems: "flex-end",
  },
  quickSignupToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(71, 23, 246, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    ...(Platform.OS === "android"
      ? {
          elevation: 6,
        }
      : {
          shadowColor: "#4717F6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }),
  },
  quickSignupButtons: {
    gap: 12,
  },
  quickButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...(Platform.OS === "android"
      ? {
          elevation: 3,
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }),
  },
  candidateButton: {
    backgroundColor: "#36E9CD",
  },
  recruiterButton: {
    backgroundColor: "#7C3AED",
  },
  quickButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
