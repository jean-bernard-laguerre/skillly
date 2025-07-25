import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { LoginCredentials } from "@/types/interfaces";
import { useRouter } from "expo-router";
import { TabNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, Eye, EyeOff, Zap } from "lucide-react-native";
import { useNavigationVisibility } from "@/context/NavigationVisibilityContext";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuthMutation();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const { hideNavigation, showNavigation } = useNavigationVisibility();
  const navigation = useNavigation<TabNavigationProp>();
  const router = useRouter();

  // Masquer la navigation au montage
  useEffect(() => {
    hideNavigation();

    // Réafficher la navigation au démontage
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
      showNavigation(); // Afficher la navigation AVANT le retour
      router.back();
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => sub.remove();
  }, [showNavigation, router]);

  const handleSubmit = () => {
    login(formData);
  };

  const handleQuickLogin = (role: "candidate" | "recruiter") => {
    const testEmail = `${role}@mail.com`;
    const testPassword = "test1234";
    login({ email: testEmail, password: testPassword });
  };

  return (
    <View style={styles.container}>
      {/* Background avec cercles blurrés selon Figma */}
      <View style={styles.backgroundContainer}>
        {/* Cercle 1 - violet */}
        <View style={[styles.blurredCircle, styles.circle1]} />
        {/* Cercle 2 - bleu */}
        <View style={[styles.blurredCircle, styles.circle2]} />
        {/* Cercle 3 - turquoise */}
        <View style={[styles.blurredCircle, styles.circle3]} />
      </View>

      {/* Boutons de connexion rapide dans le coin - agrandis */}
      <View style={styles.quickLoginContainer}>
        <Pressable
          style={styles.quickLoginToggle}
          onPress={() => setShowQuickLogin(!showQuickLogin)}
        >
          <Zap size={20} color="#FFFFFF" />
        </Pressable>

        {showQuickLogin && (
          <View style={styles.quickLoginButtons}>
            <Pressable
              style={[styles.quickButton, styles.candidateButton]}
              onPress={() => handleQuickLogin("candidate")}
              disabled={isLoggingIn}
            >
              <Text style={styles.quickButtonText}>C</Text>
            </Pressable>
            <Pressable
              style={[styles.quickButton, styles.recruiterButton]}
              onPress={() => handleQuickLogin("recruiter")}
              disabled={isLoggingIn}
            >
              <Text style={styles.quickButtonText}>R</Text>
            </Pressable>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Titre */}
            <Text style={styles.title}>Connexion</Text>

            {/* Message d'erreur */}
            {loginError && (
              <View style={styles.errorContainer}>
                <Text testID="loginError" style={styles.errorText}>{loginError.message}</Text>
              </View>
            )}

            {/* Formulaire */}
            <View style={styles.form}>
              {/* Champ Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Adresse mail</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    testID="emailInput"
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="votre@mail.com"
                    placeholderTextColor="#9CA3AF"
                  />
                  {formData.email.length > 0 && (
                    <CheckCircle2
                      size={20}
                      color="#4717F6"
                      style={styles.inputIcon}
                    />
                  )}
                </View>
              </View>

              {/* Champ Mot de passe */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    testID="passwordInput"
                    style={[styles.input, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={(text) =>
                      setFormData({ ...formData, password: text })
                    }
                    secureTextEntry={!showPassword}
                    placeholder="••••••••••"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Pressable
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye size={20} color="#4717F6" />
                    ) : (
                      <EyeOff size={20} color="#4717F6" />
                    )}
                  </Pressable>
                </View>
              </View>

              {/* Mot de passe oublié */}
              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Mot de passe oublié ?
                </Text>
              </Pressable>
            </View>

            {/* Spacer pour pousser le contenu en bas */}
            <View style={styles.spacer} />

            {/* Section bas avec inscription et bouton */}
            <View style={styles.bottomSection}>
              {/* Lien d'inscription */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Pas encore de compte ? </Text>
                <Pressable onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.signupLink}>Inscrivez vous</Text>
                </Pressable>
              </View>

              {/* Bouton de connexion */}
              <Pressable
                testID="submitLoginButton"
                style={[
                  styles.loginButton,
                  isLoggingIn && styles.loginButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoggingIn}
              >
                <LinearGradient
                  colors={["#4717F6", "#6366f1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {isLoggingIn ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Se Connecter</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    height: height * 0.5,
  },
  blurredCircle: {
    position: "absolute",
    overflow: "hidden", // Important pour Android
    // Ajout de propriétés pour garantir l'arrondi sur Android
    borderWidth: 0,
    borderStyle: "solid",
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4, // Arrondi parfait
    backgroundColor: "rgba(71, 23, 246, 0.15)",
    top: -width * 0.3,
    right: -width * 0.2,
    // Optimisation shadow pour Android
    ...(Platform.OS === "android"
      ? {
          elevation: 10,
        }
      : {
          shadowColor: "#4717F6",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 40,
        }),
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3, // Arrondi parfait
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    top: height * 0.05,
    left: -width * 0.15,
    // Optimisation shadow pour Android
    ...(Platform.OS === "android"
      ? {
          elevation: 8,
        }
      : {
          shadowColor: "#6366f1",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 35,
        }),
  },
  circle3: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25, // Arrondi parfait
    backgroundColor: "rgba(54, 233, 205, 0.1)",
    top: height * 0.15,
    right: width * 0.1,
    // Optimisation shadow pour Android
    ...(Platform.OS === "android"
      ? {
          elevation: 6,
        }
      : {
          shadowColor: "#36E9CD",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 30,
        }),
  },
  quickLoginContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    alignItems: "flex-end",
  },
  quickLoginToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(71, 23, 246, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden", // Pour Android
    // Optimisation shadow selon la plateforme
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
  quickLoginButtons: {
    gap: 12,
  },
  quickButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Pour Android
    // Optimisation shadow selon la plateforme
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: height * 0.25,
    justifyContent: "space-between", // Distribution espace entre le haut et le bas
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 40,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    overflow: "hidden", // Pour Android
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    width: "100%",
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
  inputIcon: {
    position: "absolute",
    right: 0,
    top: 12,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    top: 12,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#4717F6",
    fontSize: 14,
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
    minHeight: 20, // Hauteur minimale pour garder de l'espace
  },
  bottomSection: {
    paddingBottom: 40,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signupText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  signupLink: {
    color: "#4717F6",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 28,
    overflow: "hidden", // Pour Android
    // Optimisation shadow selon la plateforme
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
