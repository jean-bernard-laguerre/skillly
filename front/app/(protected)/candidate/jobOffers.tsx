import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
  PanResponder,
} from "react-native";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import {
  Heart,
  X,
  RotateCcw,
  RefreshCw,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  CheckCircle2,
} from "lucide-react-native";
import { JobPost } from "@/types/interfaces";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useApplication } from "@/lib/hooks/useApplication";
import Toast from "react-native-toast-message";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function Card({ card, onPress }: { card: JobPost; onPress: () => void }) {
  const DESCRIPTION_PREVIEW_LINES = 3;

  return (
    <View className="flex flex-col justify-between w-full h-full p-6 bg-white shadow-lg rounded-xl">
      <View className="flex items-center justify-center h-[80%]">
        <Text className="w-full mb-1 text-2xl font-bold text-center text-black">
          {card.title}
        </Text>
        <View className="flex-row items-center justify-center w-full gap-2 mb-2">
          <Building2 size={16} color="#374151" className="mr-1" />
          <Text className="text-base font-semibold text-center text-gray-700">
            {card.company?.company_name || "Entreprise inconnue"}
          </Text>
        </View>
        <View className="w-full mb-4 space-y-2">
          <View className="flex-row items-center gap-2">
            <MapPin size={18} color="#374151" className="mr-2" />
            <Text className="text-lg text-gray-700">{card.location}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Briefcase size={18} color="#374151" className="mr-2" />
            <Text className="text-lg text-gray-700">{card.contract_type}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <DollarSign size={18} color="#22c55e" className="mr-2" />
            <Text className="text-lg font-semibold text-green-600">
              {card.salary_range}
            </Text>
          </View>
        </View>
        <View className="flex-row flex-wrap w-full gap-2">
          <Text className="w-full mb-2 text-sm text-gray-500">
            Compétences requises :
          </Text>
          {card.skills?.map((skill) => (
            <View
              key={skill.id}
              className="px-3 py-1.5 bg-blue-100 rounded-full"
            >
              <Text className="text-sm font-medium text-blue-800">
                {skill.name}
              </Text>
            </View>
          ))}
        </View>
        {card.description && (
          <Text
            className="w-full mt-4 text-sm italic text-gray-600"
            numberOfLines={DESCRIPTION_PREVIEW_LINES}
            ellipsizeMode="tail"
          >
            {card.description}
          </Text>
        )}
      </View>
      <TouchableOpacity
        className="self-center px-4 py-2 mt-6 bg-blue-500 rounded-lg"
        onPress={onPress}
      >
        <Text className="font-semibold text-white">Voir plus</Text>
      </TouchableOpacity>
    </View>
  );
}

function OverlayLabelRight() {
  return (
    <View className="items-center justify-center w-full h-full border-4 border-green-500 bg-green-500/20 rounded-xl">
      <View className="p-4 bg-green-500 rounded-full">
        <Heart size={40} color="white" />
      </View>
      <Text className="mt-2 text-xl font-bold text-green-500">POSTULER</Text>
    </View>
  );
}

function OverlayLabelLeft() {
  return (
    <View className="items-center justify-center w-full h-full border-4 border-red-500 bg-red-500/20 rounded-xl">
      <View className="p-4 bg-red-500 rounded-full">
        <X size={40} color="white" />
      </View>
      <Text className="mt-2 text-xl font-bold text-red-500">PASSER</Text>
    </View>
  );
}

export default function JobOffers() {
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const { applications, isLoadingApplications, createApplication } =
    useApplication();
  const ref = useRef<SwiperCardRefType>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  // PanResponder pour swipe-to-close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // On active le pan responder uniquement si le mouvement est vertical et vers le bas
        return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        // On suit le doigt, mais on ne permet pas de remonter la sheet
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 250) {
          // Si le swipe vers le bas est suffisant, on ferme la sheet
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setIsModalVisible(false);
          });
        } else {
          // Sinon, on ramène la sheet à sa position initiale
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const availableJobs = React.useMemo(() => {
    if (!candidateJobPosts || !applications) return [];
    const appliedJobIds = applications.map((app) => app.job_post_id);
    return candidateJobPosts.filter((job) => !appliedJobIds.includes(job.id));
  }, [candidateJobPosts, applications]);

  useEffect(() => {
    if (isModalVisible) {
      setIsSheetVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isSheetVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setIsSheetVisible(false);
          setTimeout(() => setSelectedJob(null), 0);
        }
      });
    }
  }, [isModalVisible]);

  const handleSwipe = (direction: "left" | "right", cardIndex: number) => {
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
  };

  const handleOpenModal = (card: JobPost) => {
    setSelectedJob(card);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleModalAction = (direction: "left" | "right") => {
    if (!selectedJob) return;
    const cardIndex = availableJobs.findIndex(
      (job) => job.id === selectedJob.id
    );
    handleSwipe(direction, cardIndex);
    setIsModalVisible(false);
    if (direction === "right" || direction === "left") {
      setCurrentIndex((prev) => Math.min(prev + 1, availableJobs.length - 1));
    }
  };

  const onSwipedAll = useCallback(() => {
    setIsAllSwiped(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const resetSwiper = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsAllSwiped(false);
      setCurrentIndex(0);
      setSwiperKey((prev) => prev + 1);
    });
  };

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
    <View className="flex flex-col justify-between h-full pt-10 bg-gray-50">
      <View className="items-center justify-center px-4 basis-[80%]">
        <Swiper
          key={swiperKey}
          ref={ref}
          cardStyle={{ width: "90%", height: "80%", borderRadius: 12 }}
          data={availableJobs}
          renderCard={(card) => (
            <Card card={card} onPress={() => handleOpenModal(card)} />
          )}
          onIndexChange={setCurrentIndex}
          onSwipeRight={(cardIndex) => handleSwipe("right", cardIndex)}
          onSwipedAll={onSwipedAll}
          onSwipeLeft={(cardIndex) => handleSwipe("left", cardIndex)}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
        />
      </View>

      <View className="pt-4 pb-8">
        <View className="flex-row items-center justify-center gap-4 space-x-8">
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
          {currentIndex > 0 && (
            <TouchableOpacity
              onPress={() => ref.current?.swipeBack()}
              className="p-3 bg-white border border-gray-200 rounded-full shadow-lg"
              activeOpacity={0.7}
            >
              <RotateCcw size={24} color="#6b7280" />
            </TouchableOpacity>
          )}
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

      {isAllSwiped && (
        <Animated.View
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
          style={{ opacity: fadeAnim }}
        >
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
        </Animated.View>
      )}

      {/* BOTTOM SHEET */}
      {isSheetVisible && (
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: backdropAnim,
            justifyContent: "flex-end",
            zIndex: 100,
          }}
        >
          <Animated.View
            className="w-full bg-white rounded-t-2xl"
            style={{
              maxHeight: screenHeight * 0.9,
              alignSelf: "flex-end",
              transform: [{ translateY: slideAnim }],
            }}
            {...panResponder.panHandlers}
          >
            <View className="w-12 h-1 mx-auto mt-2 bg-gray-300 rounded-full" />
            <ScrollView
              className="px-6 py-4"
              showsVerticalScrollIndicator={true}
              bounces={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* En-tête */}
              <View className="mb-6">
                <Text className="mb-2 text-2xl font-bold text-black">
                  {selectedJob?.title}
                </Text>
                <Text className="text-lg font-semibold text-gray-700">
                  {selectedJob?.company?.company_name || "Entreprise inconnue"}
                </Text>
              </View>

              {/* Informations principales */}
              <View className="flex flex-col gap-4 mb-6">
                <View className="flex-row items-center">
                  <View className="items-center w-24">
                    <MapPin size={20} color="#374151" className="mb-1" />
                    <Text className="text-sm font-medium text-gray-600">
                      Localisation
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-800">
                    {selectedJob?.location}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="items-center w-24">
                    <Briefcase size={20} color="#374151" className="mb-1" />
                    <Text className="text-sm font-medium text-gray-600">
                      Contrat
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-800">
                    {selectedJob?.contract_type}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="items-center w-24">
                    <DollarSign size={20} color="#22c55e" className="mb-1" />
                    <Text className="text-sm font-medium text-gray-600">
                      Salaire
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-800">
                    {selectedJob?.salary_range}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="mb-2 text-lg font-semibold text-gray-800">
                  Description
                </Text>
                <Text className="text-base leading-6 text-gray-700">
                  {selectedJob?.description || "Aucune description fournie."}
                </Text>
              </View>

              {/* Stack technique */}
              <View className="mb-6">
                <Text className="mb-3 text-lg font-semibold text-gray-800">
                  Stack technique
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {selectedJob?.skills?.map((skill) => (
                    <View
                      key={skill.id}
                      className="px-3 py-1.5 bg-blue-100 rounded-full"
                    >
                      <Text className="text-sm font-medium text-blue-800">
                        {skill.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Certifications */}
              {selectedJob?.certifications &&
                selectedJob?.certifications.length > 0 && (
                  <View className="mb-6">
                    <Text className="mb-3 text-lg font-semibold text-gray-800">
                      Certifications
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {selectedJob.certifications.map((cert) => (
                        <View
                          key={cert.id}
                          className="px-3 py-1.5 bg-gray-100 rounded-full"
                        >
                          <Text className="text-sm font-medium text-gray-700">
                            {cert.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

              {/* Boutons d'action */}
              <View className="flex-row justify-center gap-4 mt-6 mb-4">
                <TouchableOpacity
                  className="flex-1 px-6 py-3 bg-green-500 rounded-lg"
                  onPress={() => handleModalAction("right")}
                >
                  <Text className="font-semibold text-center text-white">
                    Postuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 px-6 py-3 bg-red-500 rounded-lg"
                  onPress={() => handleModalAction("left")}
                >
                  <Text className="font-semibold text-center text-white">
                    Passer
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="self-center px-6 py-3 mt-2 mb-4 bg-gray-200 rounded-lg"
                onPress={handleCloseModal}
              >
                <Text className="font-semibold text-gray-800">Fermer</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
