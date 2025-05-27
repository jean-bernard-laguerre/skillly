import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import { Heart, X, RotateCcw, RefreshCw } from "lucide-react-native";
import { JobPost } from "@/types/interfaces";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useApplication } from "@/lib/hooks/useApplication";
import Toast from "react-native-toast-message";
import Modal from "react-native-modal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Card = ({ card, onPress }: { card: JobPost; onPress: () => void }) => (
  <View className="flex flex-col justify-between flex-1 p-6 mx-2 bg-white shadow-lg rounded-xl">
    <View className="flex items-start justify-center flex-1">
      <Text className="w-full mb-3 text-2xl font-bold text-center text-black">
        {card.title}
      </Text>
      <View className="w-full mb-4 space-y-2">
        <Text className="text-lg text-gray-700">📍 {card.location}</Text>
        <Text className="text-lg text-gray-700">💼 {card.contract_type}</Text>
        <Text className="text-lg font-semibold text-green-600">
          💰 {card.salary_range}
        </Text>
      </View>
      <View className="flex-row flex-wrap w-full gap-2">
        <Text className="w-full mb-2 text-sm text-gray-500">
          Compétences requises :
        </Text>
        {card.skills?.map((skill) => (
          <View key={skill.id} className="px-3 py-1.5 bg-blue-100 rounded-full">
            <Text className="text-sm font-medium text-blue-800">
              {skill.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
    <TouchableOpacity
      className="self-center px-4 py-2 mt-6 bg-blue-500 rounded-lg"
      onPress={onPress}
    >
      <Text className="font-semibold text-white">Voir plus</Text>
    </TouchableOpacity>
  </View>
);

export default function JobOffers() {
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const { applications, isLoadingApplications, createApplication } =
    useApplication();
  const ref = useRef<SwiperCardRefType>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Filtrer les offres déjà postulées
  const availableJobs = React.useMemo(() => {
    if (!candidateJobPosts || !applications) return [];
    const appliedJobIds = applications.map((app) => app.job_post_id);
    return candidateJobPosts.filter((job) => !appliedJobIds.includes(job.id));
  }, [candidateJobPosts, applications]);

  useEffect(() => {
    console.log(
      "Offres d'emploi disponibles:",
      JSON.stringify(availableJobs, null, 2)
    );
  }, [availableJobs]);

  useEffect(() => {
    console.log("isModalVisible", isModalVisible);
    console.log("selectedJob", selectedJob);
  }, [isModalVisible, selectedJob]);

  const handleSwipe = useCallback(
    (direction: "left" | "right", cardIndex: number) => {
      if (cardIndex >= availableJobs.length) return;

      const card = availableJobs[cardIndex];
      if (!card) return;

      if (direction === "right") {
        const score = 90;

        try {
          createApplication(
            { jobOfferId: card.id, score },
            {
              onSuccess: () => {
                Toast.show({
                  type: "success",
                  text1: "Candidature envoyée ! 🎉",
                  text2: `Votre candidature pour ${card.title} a été envoyée avec succès`,
                });
              },
              onError: () => {
                Toast.show({
                  type: "error",
                  text1: "Erreur",
                  text2:
                    "Une erreur est survenue lors de l'envoi de votre candidature",
                });
              },
            }
          );
        } catch (error) {
          // Gestion silencieuse des erreurs
        }
      }
    },
    [availableJobs, createApplication]
  );

  const handleOpenModal = (card: JobPost) => {
    setSelectedJob(card);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  const handleModalAction = (direction: "left" | "right") => {
    if (!selectedJob) return;
    const cardIndex = availableJobs.findIndex(
      (job) => job.id === selectedJob.id
    );
    handleSwipe(direction, cardIndex);
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedJob(null);
      if (direction === "right" || direction === "left") {
        setCurrentIndex((prev) => Math.min(prev + 1, availableJobs.length - 1));
      }
    }, 300);
  };

  const renderCard = useCallback(
    (card: JobPost) => {
      return <Card card={card} onPress={() => handleOpenModal(card)} />;
    },
    [availableJobs]
  );

  const OverlayLabelRight = useCallback(() => {
    return (
      <View className="items-center justify-center flex-1 border-4 border-green-500 bg-green-500/20 rounded-xl">
        <View className="p-4 bg-green-500 rounded-full">
          <Heart size={40} color="white" />
        </View>
        <Text className="mt-2 text-xl font-bold text-green-500">POSTULER</Text>
      </View>
    );
  }, []);

  const OverlayLabelLeft = useCallback(() => {
    return (
      <View className="items-center justify-center flex-1 border-4 border-red-500 bg-red-500/20 rounded-xl">
        <View className="p-4 bg-red-500 rounded-full">
          <X size={40} color="white" />
        </View>
        <Text className="mt-2 text-xl font-bold text-red-500">PASSER</Text>
      </View>
    );
  }, []);

  const resetSwiper = useCallback(() => {
    setIsAllSwiped(false);
    setCurrentIndex(0);
    setSwiperKey((prev) => prev + 1);
  }, []);

  if (isLoadingCandidateJobPosts || isLoadingApplications) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Text className="text-lg text-gray-600">Chargement des offres...</Text>
      </View>
    );
  }

  if (availableJobs.length === 0) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-gray-50">
        <Text className="mb-4 text-xl font-semibold text-center text-gray-700">
          Aucune nouvelle offre disponible
        </Text>
        <Text className="text-base text-center text-gray-500">
          Vous avez déjà postulé à toutes les offres disponibles. Revenez plus
          tard pour de nouvelles opportunités !
        </Text>
      </View>
    );
  }

  return (
    // <View className="flex flex-col flex-1 bg-gray-50">
    <View className="flex-col flex-1 bg-red-500">
      {/* Header avec compteur */}
      {/* <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-center text-gray-700">
          {currentIndex + 1} / {availableJobs.length}
        </Text>
      </View> */}

      {/* Swiper Container */}
      <View className="items-center justify-center px-4 basis-[70%]">
        <Swiper
          key={swiperKey}
          ref={ref}
          cardStyle={{
            width: screenWidth * 0.9,
            height: screenHeight * 0.6,
            borderRadius: 12,
          }}
          data={availableJobs}
          renderCard={renderCard}
          onIndexChange={(index) => {
            setCurrentIndex(index);
          }}
          onSwipeRight={(cardIndex) => {
            handleSwipe("right", cardIndex);
          }}
          onSwipedAll={() => {
            setIsAllSwiped(true);
          }}
          onSwipeLeft={(cardIndex) => {
            handleSwipe("left", cardIndex);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
        />
      </View>

      {/* Boutons d'action en bas */}
      <View className="pt-4 pb-8">
        <View className="flex-row items-center justify-center space-x-8">
          {/* Bouton Passer */}
          <TouchableOpacity
            onPress={() => {
              handleSwipe("left", currentIndex);
              ref.current?.swipeLeft();
            }}
            className="p-4 bg-white border border-red-200 rounded-full shadow-lg"
            activeOpacity={0.7}
          >
            <X size={32} color="#ef4444" />
          </TouchableOpacity>

          {/* Bouton Retour */}
          {currentIndex > 0 && (
            <TouchableOpacity
              onPress={() => {
                ref.current?.swipeBack();
              }}
              className="p-3 bg-white border border-gray-200 rounded-full shadow-lg"
              activeOpacity={0.7}
            >
              <RotateCcw size={24} color="#6b7280" />
            </TouchableOpacity>
          )}

          {/* Bouton Postuler */}
          <TouchableOpacity
            onPress={() => {
              handleSwipe("right", currentIndex);
              ref.current?.swipeRight();
            }}
            className="p-4 bg-white border border-green-200 rounded-full shadow-lg"
            activeOpacity={0.7}
          >
            <Heart size={32} color="#22c55e" />
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-sm text-center text-gray-500">
          Swipez ou utilisez les boutons pour naviguer
        </Text>
      </View>

      {/* Overlay fin */}
      {isAllSwiped && (
        <View className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <View className="items-center max-w-sm p-8 mx-6 bg-white rounded-xl">
            <Text className="mb-2 text-2xl font-bold text-gray-800">
              Terminé ! 🎉
            </Text>
            <Text className="mb-6 text-lg text-center text-gray-600">
              Vous avez parcouru toutes les offres disponibles
            </Text>

            {availableJobs.length > 0 && (
              <TouchableOpacity
                className="flex-row items-center px-6 py-3 bg-blue-500 rounded-lg"
                onPress={resetSwiper}
                activeOpacity={0.8}
              >
                <RefreshCw size={20} color="white" className="mr-2" />
                <Text className="ml-2 font-semibold text-white">
                  Recommencer
                </Text>
              </TouchableOpacity>
            )}

            {availableJobs.length === 0 && (
              <Text className="text-sm text-center text-gray-500">
                Vous avez regardé toutes les offres. Revenez plus tard pour de
                nouvelles opportunités !
              </Text>
            )}
          </View>
        </View>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        backdropTransitionOutTiming={0}
      >
        <View className="relative flex-1 w-full p-6 bg-red-500 rounded-t-2xl">
          <Text className="text-center text-white">Modal</Text>
        </View>
        {/* {selectedJob && (
          <View className="z-50 flex-1 w-full p-6 bg-red-500 rounded-t-2xl">
            <Text className="mb-2 text-2xl font-bold text-black">
              {selectedJob.title}
            </Text>
            <Text className="mb-1 text-lg text-black">
              Entreprise :{" "}
              {selectedJob.company?.company_name || "Entreprise inconnue"}
            </Text>
            <Text className="mb-1 text-black">📍 {selectedJob.location}</Text>
            <Text className="mb-1 text-black">
              💼 {selectedJob.contract_type}
            </Text>
            <Text className="mb-1 text-black">
              💰 {selectedJob.salary_range}
            </Text>
            <Text className="mb-1 text-black">
              Stack technique :{" "}
              {selectedJob.skills?.map((s) => s.name).join(", ")}
            </Text>
            <Text className="mb-2 text-black">
              {selectedJob.description || "Aucune description fournie."}
            </Text>
            {selectedJob.certifications &&
              selectedJob.certifications.length > 0 && (
                <View className="mb-2">
                  <Text className="font-semibold text-black">
                    Certifications :
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mt-1">
                    {selectedJob.certifications.map((cert) => (
                      <View
                        key={cert.id}
                        className="px-2 py-1 bg-gray-200 rounded-full"
                      >
                        <Text className="text-xs text-gray-700">
                          {cert.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            <View className="flex-row justify-center mt-6 space-x-4">
              <TouchableOpacity
                className="px-6 py-2 bg-green-500 rounded-lg"
                onPress={() => handleModalAction("right")}
              >
                <Text className="font-semibold text-white">Postuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-6 py-2 bg-red-500 rounded-lg"
                onPress={() => handleModalAction("left")}
              >
                <Text className="font-semibold text-white">Passer</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="self-center px-4 py-2 mt-4 bg-gray-200 rounded-lg"
              onPress={handleCloseModal}
            >
              <Text className="font-semibold text-gray-800">Fermer</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </Modal>
    </View>
  );
}
