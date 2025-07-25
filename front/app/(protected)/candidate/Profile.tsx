import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { useSkills } from "@/lib/hooks/useSkills";
import { useCertifications } from "@/lib/hooks/useCertifications";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import { Plus, Trash2, LogOut } from "lucide-react-native";

export default function Profile() {
  const { user, handleLogOut } = useAuth();
  const { addUserSkillsMutation, deleteUserSkillMutation } = useAuthMutation();

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

  const userSkillIds = user?.profile_candidate?.skills.map((s) => s.id) || [];
  const userCertificationIds =
    user?.profile_candidate?.certifications.map((c) => c.id) || [];

  const handleAddSkills = () => {
    setSelectedSkills(userSkillIds);
    setIsSkillsModalVisible(true);
  };

  const handleAddCertifications = () => {
    setSelectedCertifications(userCertificationIds);
    setIsCertificationsModalVisible(true);
  };

  const handleSkillSelect = (skillId: number) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills((prev) => [...prev, skillId]);
    } else {
      setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
    }
  };

  const handleCertificationSelect = (certificationId: number) => {
    if (!selectedCertifications.includes(certificationId)) {
      setSelectedCertifications((prev) => [...prev, certificationId]);
    } else {
      setSelectedCertifications((prev) =>
        prev.filter((id) => id !== certificationId)
      );
    }
  };

  const handleSaveChanges = () => {
    if (!user) return;
    const payload: { skills?: number[]; certifications?: number[] } = {};

    const newSkills = selectedSkills.filter((id) => !userSkillIds.includes(id));
    const newCertifications = selectedCertifications.filter(
      (id) => !userCertificationIds.includes(id)
    );

    if (newSkills.length > 0) {
      payload.skills = newSkills;
    }
    if (newCertifications.length > 0) {
      payload.certifications = newCertifications;
    }

    if (Object.keys(payload).length > 0) {
      addUserSkillsMutation(
        { userId: user.id, payload },
        {
          onSuccess: () => {
            console.log("Profil mis à jour avec succès");
            setIsSkillsModalVisible(false);
            setIsCertificationsModalVisible(false);
          },
          onError: (error) => {
            console.error("Erreur lors de la mise à jour du profil:", error);
            Alert.alert(
              "Erreur",
              "Impossible de sauvegarder les modifications."
            );
          },
        }
      );
    } else {
      setIsSkillsModalVisible(false);
      setIsCertificationsModalVisible(false);
    }
  };

  const handleDeleteSkill = (skillId: number) => {
    if (!user) return;
    const payload = {
      data: {
        skills: [skillId],
        certifications: [],
      },
    };

    Alert.alert(
      "Supprimer la compétence",
      "Êtes-vous sûr de vouloir supprimer cette compétence ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteUserSkillMutation(
              { userId: user.id, payload },
              {
                onSuccess: () => console.log("Compétence supprimée:", skillId),
                onError: (error) => {
                  console.error("Erreur suppression compétence:", error);
                  Alert.alert(
                    "Erreur",
                    "Impossible de supprimer la compétence."
                  );
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleDeleteCertification = (certificationId: number) => {
    if (!user) return;
    const payload = {
      data: {
        skills: [],
        certifications: [certificationId],
      },
    };

    Alert.alert(
      "Supprimer la certification",
      "Êtes-vous sûr de vouloir supprimer cette certification ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteUserSkillMutation(
              { userId: user.id, payload },
              {
                onSuccess: () =>
                  console.log("Certification supprimée:", certificationId),
                onError: (error) => {
                  console.error("Erreur suppression certification:", error);
                  Alert.alert(
                    "Erreur",
                    "Impossible de supprimer la certification."
                  );
                },
              }
            );
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <Header
        title="MON PROFIL"
        subtitle="Gérez vos informations et compétences 🎯"
      />

      <ScrollView
        className="flex-1 px-4"
        style={{ backgroundColor: "#F7F7F7" }}
      >
        {/* Section Profil Principal */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={["#4717F6", "#6366f1"]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: "https://picsum.photos/seed/1745317097928/120/120",
                  }}
                />
              </View>
              <Text style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userBio}>{user?.profile_candidate?.bio}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Section Compétences */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Compétences</Text>
            <Pressable style={styles.addButton} onPress={handleAddSkills}>
              <LinearGradient
                colors={["#4717F6", "#6366f1"]}
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={16} color="white" />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.tagsContainer}>
            {user?.profile_candidate?.skills.map((skill) => (
              <Pressable
                key={skill.id}
                onLongPress={() => handleDeleteSkill(skill.id)}
                style={styles.skillTag}
              >
                <Text style={styles.skillTagText}>{skill?.name}</Text>
                <Trash2 size={14} color="#4717F6" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section Certifications */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Pressable
              style={styles.addButton}
              onPress={handleAddCertifications}
            >
              <LinearGradient
                colors={["#7C3AED", "#8B5CF6"]}
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={16} color="white" />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.tagsContainer}>
            {user?.profile_candidate?.certifications.map((certification) => (
              <Pressable
                key={certification.id}
                onLongPress={() => handleDeleteCertification(certification.id)}
                style={styles.certificationTag}
              >
                <Text style={styles.certificationTagText}>
                  {certification?.name}
                </Text>
                <Trash2 size={14} color="#7C3AED" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bouton Déconnexion */}
        <View style={styles.logoutContainer}>
          <Pressable testID="logoutButton" style={styles.logoutButton} onPress={() => handleLogOut()}>
            <LinearGradient
              colors={["#FF2056", "#FF4081"]}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LogOut size={18} color="white" />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal pour ajouter des compétences */}
      <Modal
        visible={isSkillsModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ajouter des compétences</Text>
            <ScrollView style={styles.modalScrollView}>
              {allSkills
                ?.filter((skill) => !userSkillIds.includes(skill.id))
                .map((skill) => (
                  <Pressable
                    key={skill.id}
                    style={[
                      styles.modalItem,
                      selectedSkills.includes(skill.id) &&
                        styles.modalItemSelected,
                    ]}
                    onPress={() => handleSkillSelect(skill.id)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedSkills.includes(skill.id) &&
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
                onPress={() => {
                  setIsSkillsModalVisible(false);
                  setSelectedSkills([]);
                }}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={styles.modalSaveButton}
                onPress={handleSaveChanges}
              >
                <LinearGradient
                  colors={["#4717F6", "#6366f1"]}
                  style={styles.modalSaveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.modalSaveText}>Valider</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pour ajouter des certifications */}
      <Modal
        visible={isCertificationsModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ajouter des certifications</Text>
            <ScrollView style={styles.modalScrollView}>
              {allCertifications
                ?.filter((cert) => !userCertificationIds.includes(cert.id))
                .map((certification) => (
                  <Pressable
                    key={certification.id}
                    style={[
                      styles.modalItem,
                      selectedCertifications.includes(certification.id) &&
                        styles.modalItemSelected,
                    ]}
                    onPress={() => handleCertificationSelect(certification.id)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        selectedCertifications.includes(certification.id) &&
                          styles.modalItemTextSelected,
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
                onPress={() => {
                  setIsCertificationsModalVisible(false);
                  setSelectedCertifications([]);
                }}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={styles.modalSaveButton}
                onPress={handleSaveChanges}
              >
                <LinearGradient
                  colors={["#7C3AED", "#8B5CF6"]}
                  style={styles.modalSaveGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.modalSaveText}>Valider</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    marginBottom: 24,
  },
  profileGradient: {
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileContent: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  userBio: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#374151",
  },
  addButton: {
    borderRadius: 8,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
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
  logoutContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 12,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    borderRadius: 8,
  },
  modalSaveGradient: {
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
