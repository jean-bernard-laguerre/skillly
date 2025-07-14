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
import { CheckCircle2, Eye, EyeOff } from "lucide-react-native";

const { height } = Dimensions.get("window");

interface CommonFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  initialData: CommonFormData;
  onComplete: (data: CommonFormData) => void;
  onLoginPress: () => void;
}

export default function CommonSignup({
  initialData,
  onComplete,
  onLoginPress,
}: Props) {
  const [formData, setFormData] = useState<CommonFormData>(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<CommonFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CommonFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation est requise";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    /\S+@\S+\.\S+/.test(formData.email);

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
          <Text style={styles.title}>Inscription</Text>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Champ Nom */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  value={formData.lastName}
                  onChangeText={(text) => {
                    setFormData({ ...formData, lastName: text });
                    if (errors.lastName) {
                      setErrors({ ...errors, lastName: undefined });
                    }
                  }}
                  placeholder="Doe"
                  placeholderTextColor="#9CA3AF"
                />
                {formData.lastName.length > 0 && !errors.lastName && (
                  <CheckCircle2
                    size={20}
                    color="#4717F6"
                    style={styles.inputIcon}
                  />
                )}
              </View>
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            {/* Champ Prénom */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  value={formData.firstName}
                  onChangeText={(text) => {
                    setFormData({ ...formData, firstName: text });
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: undefined });
                    }
                  }}
                  placeholder="John"
                  placeholderTextColor="#9CA3AF"
                />
                {formData.firstName.length > 0 && !errors.firstName && (
                  <CheckCircle2
                    size={20}
                    color="#4717F6"
                    style={styles.inputIcon}
                  />
                )}
              </View>
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            {/* Champ Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Adresse mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="votre@mail.com"
                  placeholderTextColor="#9CA3AF"
                />
                {formData.email.length > 0 &&
                  !errors.email &&
                  /\S+@\S+\.\S+/.test(formData.email) && (
                    <CheckCircle2
                      size={20}
                      color="#4717F6"
                      style={styles.inputIcon}
                    />
                  )}
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
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
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Champ Confirmation mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Confirmation de mot de passe
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData({ ...formData, confirmPassword: text });
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#9CA3AF"
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye size={20} color="#4717F6" />
                  ) : (
                    <EyeOff size={20} color="#4717F6" />
                  )}
                </Pressable>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Section bas */}
          <View style={styles.bottomSection}>
            {/* Lien de connexion */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <Pressable onPress={onLoginPress}>
                <Text style={styles.loginLink}>Connectez-vous</Text>
              </Pressable>
            </View>

            {/* Bouton continuer */}
            <Pressable
              style={[
                styles.continueButton,
                !isFormValid && styles.continueButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <LinearGradient
                colors={
                  isFormValid ? ["#4717F6", "#6366f1"] : ["#9CA3AF", "#9CA3AF"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continuer</Text>
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
    marginBottom: 40,
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
  inputError: {
    borderBottomColor: "#DC2626",
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
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  loginLink: {
    color: "#4717F6",
    fontSize: 14,
    fontWeight: "600",
  },
  continueButton: {
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
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonGradient: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
