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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const signupSchema = z.object({
  firstName: z.string().nonempty("Le prénom est requis"),
  lastName: z.string().nonempty("Le nom est requis"),
  email: z.string().email("Email invalide").nonempty("L'email est requis"),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
  ).min(8).nonempty("Le mot de passe est requis"),
  confirmPassword: z.string().nonempty("La confirmation est requise"),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Les mots de passes ne correspondent pas",
      path: ["confirmPassword"],
    });
  }
});

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
  /* const [errors, setErrors] = useState<Partial<CommonFormData>>({}); */
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<CommonFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: formData,
    mode: 'onChange',
  });


  const onSubmit = (data: CommonFormData) => {
    onComplete(data);
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
          <Text style={styles.title}>Inscription</Text>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Champ Nom */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom</Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Doe"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
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
                <Text style={styles.errorText}>{errors.lastName.message}</Text>
              )}
            </View>

            {/* Champ Prénom */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="John"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
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
                <Text style={styles.errorText}>{errors.firstName.message}</Text>
              )}
            </View>

            {/* Champ Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Adresse mail</Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="votre@mail.com"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
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
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        errors.password && styles.inputError,
                      ]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      placeholder="••••••••••"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
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
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Champ Confirmation mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Confirmation de mot de passe
              </Text>
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="••••••••••"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
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
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
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
                !isValid && styles.continueButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              <LinearGradient
                colors={
                  isValid ? ["#4717F6", "#6366f1"] : ["#9CA3AF", "#9CA3AF"]
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
    paddingTop: 14, // Titre plus haut
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
