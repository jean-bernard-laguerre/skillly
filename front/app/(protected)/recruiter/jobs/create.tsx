import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  X,
  Calendar,
  Briefcase,
  MapPin,
  DollarSign,
  Save,
} from "lucide-react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useSkills } from "@/lib/hooks/useSkills";
import { useCertifications } from "@/lib/hooks/useCertifications";
import { CreateJobPostDTO } from "@/types/interfaces";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Portal } from "react-native-portalize";

interface CreateJobPostProps {
  onSuccess: () => void;
}

export default function CreateJobPost({ onSuccess }: CreateJobPostProps) {
  const [date, setDate] = useState(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate;
  });
  const [show, setShow] = useState(false);
  const { createJobPost, isCreatingJobPost, createJobPostError } = useJobPost();
  const { skills: allSkills, isLoadingSkills } = useSkills();
  const { certifications: allCertifications, isLoadingCertifications } =
    useCertifications();
  const [isSkillsModalVisible, setIsSkillsModalVisible] = useState(false);
  const [isCertificationsModalVisible, setIsCertificationsModalVisible] =
    useState(false);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    number[]
  >([]);
  const [tempSelectedSkills, setTempSelectedSkills] = useState<number[]>([]);
  const [tempSelectedCertifications, setTempSelectedCertifications] = useState<
    number[]
  >([]);

  const [formData, setFormData] = useState<CreateJobPostDTO>({
    description: "",
    title: "",
    location: "",
    contract_type: "CDI",
    salary_range: "",
    expiration_date: date.toISOString(),
    skills: selectedSkills,
    certifications: selectedCertifications,
  });

  const handleSubmit = () => {
    createJobPost(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const currentDate = date;
      setShow(false);
      setDate(currentDate);
      setFormData({
        ...formData,
        expiration_date: currentDate.toISOString(),
      });
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleSkillSelect = (skillId: number) => {
    if (!tempSelectedSkills.includes(skillId)) {
      setTempSelectedSkills((prev) => [...prev, skillId]);
    } else {
      setTempSelectedSkills((prev) => prev.filter((id) => id !== skillId));
    }
  };

  const handleCertificationSelect = (certificationId: number) => {
    if (!tempSelectedCertifications.includes(certificationId)) {
      setTempSelectedCertifications((prev) => [...prev, certificationId]);
    } else {
      setTempSelectedCertifications((prev) =>
        prev.filter((id) => id !== certificationId)
      );
    }
  };

  const handleSaveSkills = () => {
    setSelectedSkills(tempSelectedSkills);
    setFormData({ ...formData, skills: tempSelectedSkills });
    setIsSkillsModalVisible(false);
  };

  const handleSaveCertifications = () => {
    setSelectedCertifications(tempSelectedCertifications);
    setFormData({ ...formData, certifications: tempSelectedCertifications });
    setIsCertificationsModalVisible(false);
  };

  const handleOpenSkillsModal = () => {
    setTempSelectedSkills(selectedSkills);
    setIsSkillsModalVisible(true);
  };

  const handleOpenCertificationsModal = () => {
    setTempSelectedCertifications(selectedCertifications);
    setIsCertificationsModalVisible(true);
  };

  const handleCancelSkills = () => {
    setTempSelectedSkills(selectedSkills);
    setIsSkillsModalVisible(false);
  };

  const handleCancelCertifications = () => {
    setTempSelectedCertifications(selectedCertifications);
    setIsCertificationsModalVisible(false);
  };

  const handleDeleteSkill = (skillId: number) => {
    Alert.alert(
      "Supprimer la compétence",
      "Êtes-vous sûr de vouloir supprimer cette compétence ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const newSelectedSkills = selectedSkills.filter(
              (id) => id !== skillId
            );
            setSelectedSkills(newSelectedSkills);
            setFormData({ ...formData, skills: newSelectedSkills });
          },
        },
      ]
    );
  };

  const handleDeleteCertification = (certificationId: number) => {
    Alert.alert(
      "Supprimer la certification",
      "Êtes-vous sûr de vouloir supprimer cette certification ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const newSelectedCertifications = selectedCertifications.filter(
              (id) => id !== certificationId
            );
            setSelectedCertifications(newSelectedCertifications);
            setFormData({
              ...formData,
              certifications: newSelectedCertifications,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.safeAreaContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={["#4717F6", "#6366f1"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Briefcase size={32} color="white" />
              <Text style={styles.headerTitle}>Nouvelle offre d'emploi</Text>
              <Text style={styles.headerSubtitle}>
                Créez une offre attractive pour vos futurs talents
              </Text>
            </View>
          </LinearGradient>
        </View>

        {createJobPostError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{createJobPostError.message}</Text>
          </View>
        )}

        {/* Formulaire */}
        <View style={styles.formContainer}>
          {/* Titre */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Titre du poste *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                placeholder="Ex: Développeur React Native Senior"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Description du poste *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={5}
                placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Localisation */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Localisation *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6B7280" />
              <TextInput
                style={[styles.textInput, styles.inputWithIcon]}
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                placeholder="Ex: Paris, Télétravail, Lyon..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Type de contrat */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Type de contrat *</Text>
            <View style={styles.contractTypeContainer}>
              <Pressable
                style={[
                  styles.contractButton,
                  formData.contract_type === "CDI" &&
                    styles.contractButtonSelected,
                ]}
                onPress={() =>
                  setFormData({ ...formData, contract_type: "CDI" })
                }
              >
                {formData.contract_type === "CDI" ? (
                  <LinearGradient
                    colors={["#4717F6", "#6366f1"]}
                    style={styles.contractButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.contractButtonTextSelected}>CDI</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.contractButtonText}>CDI</Text>
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.contractButton,
                  formData.contract_type === "CDD" &&
                    styles.contractButtonSelected,
                ]}
                onPress={() =>
                  setFormData({ ...formData, contract_type: "CDD" })
                }
              >
                {formData.contract_type === "CDD" ? (
                  <LinearGradient
                    colors={["#4717F6", "#6366f1"]}
                    style={styles.contractButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.contractButtonTextSelected}>CDD</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.contractButtonText}>CDD</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Salaire */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Fourchette de salaire</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="#22c55e" />
              <TextInput
                style={[styles.textInput, styles.inputWithIcon]}
                value={formData.salary_range}
                onChangeText={(text) =>
                  setFormData({ ...formData, salary_range: text })
                }
                placeholder="Ex: 45k - 55k €/an, 2500 - 3000 €/mois"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Date d'expiration */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Date d'expiration *</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateDisplay}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.dateText}>
                  {date.toLocaleDateString("fr-FR")}
                </Text>
              </View>
              <Pressable onPress={showDatepicker}>
                <LinearGradient
                  colors={["#7C3AED", "#8B5CF6"]}
                  style={styles.dateButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.dateButtonText}>Modifier</Text>
                </LinearGradient>
              </Pressable>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                locale="fr"
                onChange={handleDateChange}
                minimumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              />
            )}
          </View>

          {/* Compétences */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Compétences requises</Text>
              <Pressable onPress={handleOpenSkillsModal}>
                <LinearGradient
                  colors={["#4717F6", "#6366f1"]}
                  style={styles.addButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Plus size={16} color="white" />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </LinearGradient>
              </Pressable>
            </View>
            <View style={styles.tagsContainer}>
              {selectedSkills.map((skillId) => {
                const skill = allSkills?.find((s) => s.id === skillId);
                return (
                  <Pressable
                    key={skillId}
                    onLongPress={() => handleDeleteSkill(skillId)}
                    style={styles.skillTag}
                  >
                    <Text style={styles.skillTagText}>{skill?.name}</Text>
                    <X size={14} color="#4717F6" />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Certifications */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certifications requises</Text>
              <Pressable onPress={handleOpenCertificationsModal}>
                <LinearGradient
                  colors={["#7C3AED", "#8B5CF6"]}
                  style={styles.addButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Plus size={16} color="white" />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </LinearGradient>
              </Pressable>
            </View>
            <View style={styles.tagsContainer}>
              {selectedCertifications.map((certificationId) => {
                const certification = allCertifications?.find(
                  (c) => c.id === certificationId
                );
                return (
                  <Pressable
                    key={certificationId}
                    onLongPress={() =>
                      handleDeleteCertification(certificationId)
                    }
                    style={styles.certificationTag}
                  >
                    <Text style={styles.certificationTagText}>
                      {certification?.name}
                    </Text>
                    <X size={14} color="#7C3AED" />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Bouton de création */}
        <View style={styles.submitContainer}>
          <Pressable
            onPress={handleSubmit}
            disabled={isCreatingJobPost}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <LinearGradient
              colors={["#36E9CD", "#36E9CD"]}
              style={styles.submitButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isCreatingJobPost ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text style={styles.submitButtonText}>Créer l'offre</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        <Portal>
          {isSkillsModalVisible && (
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Ajouter des compétences</Text>
                <ScrollView style={styles.modalScrollView}>
                  {allSkills
                    ?.filter((skill) => !selectedSkills.includes(skill.id))
                    .map((skill) => (
                      <Pressable
                        key={skill.id}
                        style={[
                          styles.modalItem,
                          tempSelectedSkills.includes(skill.id) &&
                            styles.modalItemSelected,
                        ]}
                        onPress={() => handleSkillSelect(skill.id)}
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            tempSelectedSkills.includes(skill.id) &&
                              styles.modalItemTextSelected,
                          ]}
                        >
                          {skill.name}
                        </Text>
                      </Pressable>
                    ))}
                </ScrollView>
                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={handleCancelSkills}
                  >
                    <Text style={styles.modalCancelText}>Annuler</Text>
                  </Pressable>
                  <Pressable onPress={handleSaveSkills}>
                    <LinearGradient
                      colors={["#4717F6", "#6366f1"]}
                      style={styles.modalSaveButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.modalSaveText}>Valider</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </Portal>

        <Portal>
          {isCertificationsModalVisible && (
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  Ajouter des certifications
                </Text>
                <ScrollView style={styles.modalScrollView}>
                  {allCertifications
                    ?.filter(
                      (cert) => !selectedCertifications.includes(cert.id)
                    )
                    .map((certification) => (
                      <Pressable
                        key={certification.id}
                        style={[
                          styles.modalItem,
                          tempSelectedCertifications.includes(
                            certification.id
                          ) && styles.modalItemSelected,
                        ]}
                        onPress={() =>
                          handleCertificationSelect(certification.id)
                        }
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            tempSelectedCertifications.includes(
                              certification.id
                            ) && styles.modalItemTextSelected,
                          ]}
                        >
                          {certification.name}
                        </Text>
                      </Pressable>
                    ))}
                </ScrollView>
                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalCancelButton}
                    onPress={handleCancelCertifications}
                  >
                    <Text style={styles.modalCancelText}>Annuler</Text>
                  </Pressable>
                  <Pressable onPress={handleSaveCertifications}>
                    <LinearGradient
                      colors={["#7C3AED", "#8B5CF6"]}
                      style={styles.modalSaveButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.modalSaveText}>Valider</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </Portal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    alignItems: "center",
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    fontWeight: "500",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  inputWithIcon: {
    marginLeft: 12,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  contractTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  contractButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    overflow: "hidden",
  },
  contractButtonSelected: {
    borderColor: "#4717F6",
  },
  contractButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  contractButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 12,
  },
  contractButtonTextSelected: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(71, 23, 246, 0.1)",
    borderWidth: 1,
    borderColor: "#4717F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  skillTagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4717F6",
  },
  certificationTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderWidth: 1,
    borderColor: "#7C3AED",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  certificationTagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7C3AED",
  },
  submitContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  modalBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  modalScrollView: {
    maxHeight: 400,
    marginBottom: 16,
  },
  modalItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  modalItemSelected: {
    backgroundColor: "#4717F6",
    borderColor: "#4717F6",
  },
  modalItemText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  modalItemTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalSaveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
