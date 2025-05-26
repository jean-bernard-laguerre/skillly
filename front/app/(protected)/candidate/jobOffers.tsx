import React, { useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import { Heart, X, RotateCcw, RefreshCw } from "lucide-react-native";
import { JobPost } from "@/types/interfaces";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useApplication } from "@/lib/hooks/useApplication";
import Toast from "react-native-toast-message";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Card = ({ card }: { card: JobPost }) => (
  <View className="items-start justify-center flex-1 p-6 mx-2 bg-white shadow-lg rounded-xl">
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
);

export default function JobOffers() {
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const { applications, isLoadingApplications, createApplication } =
    useApplication();
  const ref = useRef<SwiperCardRefType>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPassedCards, setHasPassedCards] = useState(false);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0);

  // Filtrer les offres déjà postulées
  const availableJobs = React.useMemo(() => {
    if (!candidateJobPosts || !applications) return [];
    const appliedJobIds = applications.map((app) => app.job_post_id);
    return candidateJobPosts.filter((job) => !appliedJobIds.includes(job.id));
  }, [candidateJobPosts, applications]);

  const handleSwipe = useCallback(
    (direction: "left" | "right", cardIndex: number) => {
      if (cardIndex >= availableJobs.length) return;

      const card = availableJobs[cardIndex];
      if (!card) return;

      if (direction === "left") {
        setHasPassedCards(true);
      }

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

  const renderCard = useCallback((card: JobPost) => {
    return <Card card={card} />;
  }, []);

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
    setHasPassedCards(false);
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
    <View className="flex-1 bg-gray-50">
      {/* Header avec compteur */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-center text-gray-700">
          {currentIndex + 1} / {availableJobs.length}
        </Text>
      </View>

      {/* Swiper Container */}
      <View className="items-center justify-center flex-1 px-4">
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

            {hasPassedCards && (
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

            {!hasPassedCards && (
              <Text className="text-sm text-center text-gray-500">
                Vous avez regardé toutes les offres. Revenez plus tard pour de
                nouvelles opportunités !
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
