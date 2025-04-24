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
} from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useSkills } from "@/lib/hooks/useSkills";
import { useCertifications } from "@/lib/hooks/useCertifications";
import { CreateJobPostDTO } from "@/types/interfaces";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const newSelectedSkills = selectedSkills.filter((id) => id !== skillId);
    setSelectedSkills(newSelectedSkills);
    setFormData({ ...formData, skills: newSelectedSkills });
  };

  const handleDeleteCertification = (certificationId: number) => {
    const newSelectedCertifications = selectedCertifications.filter(
      (id) => id !== certificationId
    );
    setSelectedCertifications(newSelectedCertifications);
    setFormData({ ...formData, certifications: newSelectedCertifications });
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="mb-4 text-2xl font-bold">Créer une offre d'emploi</Text>

      {createJobPostError && (
        <Text className="mb-4 text-red-500">{createJobPostError.message}</Text>
      )}

      <View className="mb-4">
        <Text className="mb-2">Titre</Text>
        <TextInput
          className="p-2 bg-white rounded"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Description</Text>
        <TextInput
          className="h-32 p-2 bg-white rounded"
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Localisation</Text>
        <TextInput
          className="p-2 bg-white rounded"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Type de contrat</Text>
        <View className="flex-row space-x-4">
          <Pressable
            className={`flex-1 p-2 rounded ${
              formData.contract_type === "CDI" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setFormData({ ...formData, contract_type: "CDI" })}
          >
            <Text
              className={`text-center ${
                formData.contract_type === "CDI"
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              CDI
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 p-2 rounded ${
              formData.contract_type === "CDD" ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setFormData({ ...formData, contract_type: "CDD" })}
          >
            <Text
              className={`text-center ${
                formData.contract_type === "CDD"
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              CDD
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="mb-4">
        <Text className="mb-2">Fourchette de salaire</Text>
        <TextInput
          className="p-2 bg-white rounded"
          value={formData.salary_range}
          onChangeText={(text) =>
            setFormData({ ...formData, salary_range: text })
          }
          placeholder="ex: 30 000 - 40 000"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Date d'expiration</Text>
        <SafeAreaView>
          <Pressable onPress={showDatepicker}>
            <Text>{date.toLocaleDateString("fr-FR")}</Text>
          </Pressable>
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
        </SafeAreaView>
      </View>

      {/* Section Compétences */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold">Compétences requises</Text>
          <Pressable
            className="px-3 py-1 bg-blue-500 rounded"
            onPress={handleOpenSkillsModal}
          >
            <Text className="text-white">Ajouter</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap">
          {selectedSkills.map((skillId) => {
            const skill = allSkills?.find((s) => s.id === skillId);
            return (
              <Pressable
                key={skillId}
                onLongPress={() => handleDeleteSkill(skillId)}
                className="px-3 py-1 mb-2 mr-2 bg-gray-200 rounded-full"
              >
                <Text>{skill?.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Section Certifications */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold">Certifications requises</Text>
          <Pressable
            className="px-3 py-1 bg-blue-500 rounded"
            onPress={handleOpenCertificationsModal}
          >
            <Text className="text-white">Ajouter</Text>
          </Pressable>
        </View>
        <View className="flex-row flex-wrap">
          {selectedCertifications.map((certificationId) => {
            const certification = allCertifications?.find(
              (c) => c.id === certificationId
            );
            return (
              <Pressable
                key={certificationId}
                onLongPress={() => handleDeleteCertification(certificationId)}
                className="px-3 py-1 mb-2 mr-2 bg-gray-200 rounded-full"
              >
                <Text>{certification?.name}</Text>
              </Pressable>
            );
          })}
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
              Ajouter des compétences requises
            </Text>
            <ScrollView>
              {allSkills
                ?.filter((skill) => !selectedSkills.includes(skill.id))
                .map((skill) => (
                  <Pressable
                    key={skill.id}
                    className={`p-3 mb-2 rounded ${
                      tempSelectedSkills.includes(skill.id)
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                    onPress={() => handleSkillSelect(skill.id)}
                  >
                    <Text>{skill.name}</Text>
                  </Pressable>
                ))}
            </ScrollView>
            <View className="flex-row justify-end mt-4">
              <Pressable
                className="px-4 py-2 mr-2 bg-gray-500 rounded"
                onPress={handleCancelSkills}
              >
                <Text className="text-white">Annuler</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={handleSaveSkills}
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
              Ajouter des certifications requises
            </Text>
            <ScrollView>
              {allCertifications
                ?.filter((cert) => !selectedCertifications.includes(cert.id))
                .map((certification) => (
                  <Pressable
                    key={certification.id}
                    className={`p-3 mb-2 rounded ${
                      tempSelectedCertifications.includes(certification.id)
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                    onPress={() => handleCertificationSelect(certification.id)}
                  >
                    <Text>{certification.name}</Text>
                  </Pressable>
                ))}
            </ScrollView>
            <View className="flex-row justify-end mt-4">
              <Pressable
                className="px-4 py-2 mr-2 bg-gray-500 rounded"
                onPress={handleCancelCertifications}
              >
                <Text className="text-white">Annuler</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded"
                onPress={handleSaveCertifications}
              >
                <Text className="text-white">Valider</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View className="mb-20">
        <Pressable
          className="p-4 bg-blue-500 rounded-lg"
          onPress={handleSubmit}
          disabled={isCreatingJobPost}
        >
          {isCreatingJobPost ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-center text-white">
              Créer l'offre
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
