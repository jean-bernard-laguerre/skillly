import React, { useState } from "react";
import { View, Text, Image, Pressable, Modal, ScrollView } from "react-native";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSkills } from "@/lib/hooks/useSkills";
import { useCertifications } from "@/lib/hooks/useCertifications";
import { Skill, Certification } from "@/types/interfaces";

export default function Profile() {
  const { logout, currentUser } = useAuth();
  const { skills, isLoadingSkills } = useSkills();
  const { certifications, isLoadingCertifications } = useCertifications();
  const [isSkillsModalVisible, setIsSkillsModalVisible] = useState(false);
  const [isCertificationsModalVisible, setIsCertificationsModalVisible] =
    useState(false);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    number[]
  >([]);

  const handleAddSkills = () => {
    setIsSkillsModalVisible(true);
  };

  const handleAddCertifications = () => {
    setIsCertificationsModalVisible(true);
  };

  const handleSkillSelect = (skillId: number) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleCertificationSelect = (certificationId: number) => {
    setSelectedCertifications((prev) =>
      prev.includes(certificationId)
        ? prev.filter((id) => id !== certificationId)
        : [...prev, certificationId]
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
          {currentUser?.firstName} {currentUser?.lastName}
        </Text>
        <Text className="mb-2 text-gray-600">{currentUser?.email}</Text>
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
          {currentUser?.profileCandidate?.skills.map((skillId) => {
            const skill = skills?.find((s) => s.id === skillId);
            return (
              <View
                key={skillId}
                className="px-3 py-1 mb-2 mr-2 bg-gray-200 rounded-full"
              >
                <Text>{skill?.name}</Text>
              </View>
            );
          })}
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
          {currentUser?.profileCandidate?.certifications.map(
            (certificationId) => {
              const certification = certifications?.find(
                (c) => c.id === certificationId
              );
              return (
                <View
                  key={certificationId}
                  className="px-3 py-1 mb-2 mr-2 bg-gray-200 rounded-full"
                >
                  <Text>{certification?.name}</Text>
                </View>
              );
            }
          )}
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
              {skills?.map((skill) => (
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
                onPress={() => setIsSkillsModalVisible(false)}
              >
                <Text className="text-white">Annuler</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={() => {
                  // TODO: Implémenter la logique pour sauvegarder les compétences sélectionnées
                  setIsSkillsModalVisible(false);
                }}
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
              {certifications?.map((certification) => (
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
                onPress={() => setIsCertificationsModalVisible(false)}
              >
                <Text className="text-white">Annuler</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={() => {
                  // TODO: Implémenter la logique pour sauvegarder les certifications sélectionnées
                  setIsCertificationsModalVisible(false);
                }}
              >
                <Text className="text-white">Valider</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        className="p-2 mt-5 bg-red-500 rounded-md"
        onPress={() => logout()}
      >
        <Text className="text-white">Se déconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}
