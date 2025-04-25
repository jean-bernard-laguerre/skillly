import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { useSkills } from "@/lib/hooks/useSkills";
import { useCertifications } from "@/lib/hooks/useCertifications";
import { Skill, Certification } from "@/types/interfaces";

export default function Profile() {
  // Utiliser le contexte pour les données en lecture seule
  const { user, handleLogOut } = useAuth();

  // Utiliser useAuthMutation pour les actions
  const {
    addUserSkillsMutation,
    deleteUserSkillMutation,
    deleteUserCertificationMutation,
  } = useAuthMutation();

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
    const payload: { skills?: number[]; certifications?: number[] } = {};

    payload.skills = [skillId]
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
                onSuccess: () => console.log("Compétence supprimée:", payload),
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
    const payload: { skills?: number[]; certifications?: number[] } = {};

    payload.certifications = [certificationId]
    Alert.alert(
      "Supprimer la certification",
      "Êtes-vous sûr de vouloir supprimer cette certification ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteUserCertificationMutation(
              { userId: user.id, certificationId },
              {
                onSuccess: () =>
                  console.log("Certification supprimée:", payload),
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
    <ScrollView className="flex-1 p-5">
      <View className="items-center justify-center">
        <Image
          className="w-[150px] h-[150px] rounded-full mb-5"
          source={{ uri: "https://picsum.photos/seed/1745317097928/150/150" }}
        />
        <Text className="mb-2 text-2xl font-bold">
          {user?.first_name} {user?.last_name}
        </Text>
        <Text className="mb-2 text-gray-600">{user?.email}</Text>
        <Text className="mb-5 text-base text-center">
          Je suis à la recherche d'opportunités professionnelles dans le
          développement.
        </Text>
      </View>

      {/* Section Compétences */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold">Compétences</Text>
          <Pressable
            className="px-3 py-1 bg-blue-500 rounded"
            onPress={handleAddSkills}
          >
            <Text className="text-white">Ajouter</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap">
          {user?.profile_candidate?.skills.map((skill) => (
            <Pressable
              key={skill.id}
              onLongPress={() => handleDeleteSkill(skill.id)}
              className="px-3 py-1 mb-2 mr-2 bg-gray-200 rounded-full"
            >
              <Text>{skill?.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Section Certifications */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold">Certifications</Text>
          <Pressable
            className="px-3 py-1 bg-blue-500 rounded"
            onPress={handleAddCertifications}
          >
            <Text className="text-white">Ajouter</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap">
          {user?.profile_candidate?.certifications.map((certification) => (
            <Pressable
              key={certification.id}
              onLongPress={() => handleDeleteCertification(certification.id)}
              className="px-3 py-1 mb-2 mr-2 bg-gray-200 rounded-full"
            >
              <Text>{certification?.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Modal pour ajouter des compétences */}
      <Modal
        visible={isSkillsModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="bg-white p-5 rounded-lg w-[90%] max-h-[80%]">
            <Text className="mb-4 text-xl font-bold">
              Ajouter des compétences
            </Text>
            <ScrollView>
              {allSkills
                ?.filter((skill) => !userSkillIds.includes(skill.id))
                .map((skill) => (
                  <Pressable
                    key={skill.id}
                    className={`p-3 mb-2 rounded ${
                      selectedSkills.includes(skill.id)
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                    onPress={() => handleSkillSelect(skill.id)}
                  >
                    <Text
                      className={
                        selectedSkills.includes(skill.id)
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      {skill.name}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
            <View className="flex-row justify-end mt-4">
              <Pressable
                className="px-4 py-2 mr-2 bg-gray-500 rounded"
                onPress={() => {
                  setIsSkillsModalVisible(false);
                  setSelectedSkills([]);
                }}
              >
                <Text className="text-white">Annuler</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={handleSaveChanges}
              >
                <Text className="text-white">Valider</Text>
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
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="bg-white p-5 rounded-lg w-[90%] max-h-[80%]">
            <Text className="mb-4 text-xl font-bold">
              Ajouter des certifications
            </Text>
            <ScrollView>
              {allCertifications
                ?.filter((cert) => !userCertificationIds.includes(cert.id))
                .map((certification) => (
                  <Pressable
                    key={certification.id}
                    className={`p-3 mb-2 rounded ${
                      selectedCertifications.includes(certification.id)
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                    onPress={() => handleCertificationSelect(certification.id)}
                  >
                    <Text
                      className={
                        selectedCertifications.includes(certification.id)
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      {certification.name}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
            <View className="flex-row justify-end mt-4">
              <Pressable
                className="px-4 py-2 mr-2 bg-gray-500 rounded"
                onPress={() => {
                  setIsCertificationsModalVisible(false);
                  setSelectedCertifications([]);
                }}
              >
                <Text className="text-white">Annuler</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={handleSaveChanges}
              >
                <Text className="text-white">Valider</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        className="p-2 mt-5 bg-red-500 rounded-md"
        onPress={() => handleLogOut()}
      >
        <Text className="text-white">Se déconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}
