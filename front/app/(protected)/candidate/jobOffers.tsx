import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
} from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import {
  Heart,
  X,
  RotateCcw,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
} from "lucide-react-native";
import { JobPost } from "@/types/interfaces";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useApplication } from "@/lib/hooks/useApplication";
import Toast from "react-native-toast-message";

const SWIPE_THRESHOLD = 100;
const { height: screenHeight } = Dimensions.get("window");

export default function JobOffers() {
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const { applications, isLoadingApplications, createApplication } =
    useApplication();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  // Valeurs animées pour les gestes
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const isSwipeDisabled = useSharedValue(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Ne se déclencher que si le mouvement est vers le bas et assez significatif
        return (
          gestureState.dy > 10 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setIsModalVisible(false);
          });
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Calculer les jobs disponibles
  const availableJobs = React.useMemo(() => {
    if (!candidateJobPosts || !applications) return [];
    const appliedJobIds = applications.map((app) => app.job_post_id);
    return candidateJobPosts.filter((job) => !appliedJobIds.includes(job.id));
  }, [candidateJobPosts, applications]);

  React.useEffect(() => {
    if (isModalVisible) {
      setIsSheetVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
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

  const handleOpenModal = (job: JobPost) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleModalAction = (direction: "left" | "right") => {
    if (!selectedJob) return;
    if (direction === "right") {
      handleApply();
    } else {
      handlePass();
    }
    setIsModalVisible(false);
  };

  // Fonction pour postuler
  const handleApply = () => {
    const job = availableJobs[currentIndex];
    if (!job) return;

    animateCardExit("right", () => {
      createApplication(
        { jobOfferId: job.id, score: 90 },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: "Candidature envoyée ! 🎉",
              text2: `Votre candidature pour ${job.title} a été envoyée avec succès`,
            });
            goToNext();
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
    });
  };

  // Fonction pour passer
  const handlePass = () => {
    animateCardExit("left", () => {
      goToNext();
    });
  };

  // Fonction pour aller à la suivante
  const goToNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  // Fonction pour revenir en arrière
  const goToPrevious = () => {
    if (currentIndex > 0) {
      resetAnimations();
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Réinitialiser les animations
  const resetAnimations = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  // Fonction pour animer la sortie de la card
  const animateCardExit = (
    direction: "left" | "right",
    callback: () => void
  ) => {
    const exitX = direction === "left" ? -400 : 400;

    translateX.value = withSpring(exitX, { damping: 15 });
    opacity.value = withSpring(0, { damping: 15 });

    setTimeout(() => {
      callback();
      // Réinitialiser pour la prochaine card
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 1;
    }, 300);
  };

  // Gestionnaire de gestes avec la nouvelle API
  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isSwipeDisabled.value) return;
      scale.value = withSpring(0.95);
    })
    .onUpdate((event) => {
      if (isSwipeDisabled.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5; // Réduire le mouvement vertical
    })
    .onEnd((event) => {
      if (isSwipeDisabled.value) return;
      scale.value = withSpring(1);

      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe détecté
        const direction = event.translationX > 0 ? "right" : "left";

        if (direction === "right") {
          runOnJS(handleApply)();
        } else {
          runOnJS(handlePass)();
        }
      } else {
        // Retour à la position initiale
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const tapGesture = Gesture.Tap().onStart(() => {
    // Ne pas ouvrir la modal si un swipe est en cours
    if (Math.abs(translateX.value) < 10) {
      runOnJS(handleOpenModal)(currentJob);
    }
  });

  // Composition des gestes
  const composedGestures = Gesture.Simultaneous(panGesture, tapGesture);

  // Styles animés
  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Styles des overlays
  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-150, -50, 0],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    ),
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, 50, 150],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    ),
  }));

  if (isLoadingCandidateJobPosts || isLoadingApplications) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-xl font-bold">Chargement des offres...</Text>
      </View>
    );
  }

  if (availableJobs.length === 0) {
    return (
      <View className="items-center justify-center flex-1 px-5">
        <Text className="mb-5 text-2xl font-bold text-center">
          Aucune nouvelle offre disponible
        </Text>
        <Text className="text-base text-center text-gray-500">
          Vous avez déjà postulé à toutes les offres disponibles. Revenez plus
          tard pour de nouvelles opportunités !
        </Text>
      </View>
    );
  }

  if (currentIndex >= availableJobs.length) {
    return (
      <View className="items-center justify-center flex-1 px-5">
        <Text className="mb-5 text-2xl font-bold text-center">
          Toutes les offres parcourues ! 🎉
        </Text>
        <TouchableOpacity
          className="px-4 py-2 mt-5 bg-blue-500 rounded-lg"
          onPress={() => setCurrentIndex(0)}
        >
          <Text className="text-base font-bold text-white">Recommencer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentJob = availableJobs[currentIndex];

  return (
    <GestureHandlerRootView className="flex-1 bg-gray-100">
      <View className="items-center pt-4 pb-2">
        <Text className="text-base font-semibold text-center">
          {currentIndex + 1} / {availableJobs.length}
        </Text>
      </View>

      <GestureDetector gesture={composedGestures}>
        <ReanimatedAnimated.View
          className="flex-1 mx-5 my-5 rounded-xl bg-white shadow-2xl border border-gray-100"
          style={[
            animatedCardStyle,
            {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            },
          ]}
        >
          <View className="justify-between flex-1 p-6">
            <View className="items-center justify-center flex-1">
              <View className="items-center w-full mb-5">
                <Text className="mb-2 text-2xl font-bold text-center text-black">
                  {currentJob.title}
                </Text>
                <View className="flex-row items-center">
                  <Building2 size={16} color="#374151" />
                  <Text className="ml-1 text-lg font-semibold text-center text-gray-700">
                    {currentJob.company?.company_name || "Entreprise inconnue"}
                  </Text>
                </View>
              </View>

              <View className="w-full mt-2">
                <View className="flex-row items-center mb-1">
                  <MapPin size={18} color="#374151" />
                  <Text className="ml-1 text-base text-gray-500">
                    {currentJob.location}
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <Briefcase size={18} color="#374151" />
                  <Text className="ml-1 text-base text-gray-500">
                    {currentJob.contract_type}
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <DollarSign size={18} color="#22c55e" />
                  <Text className="ml-1 text-lg font-bold text-green-500">
                    {currentJob.salary_range}
                  </Text>
                </View>
              </View>

              {currentJob.skills && currentJob.skills.length > 0 && (
                <View className="w-full mt-5">
                  <Text className="mb-2 text-sm text-left text-gray-500">
                    Compétences requises :
                  </Text>
                  <View className="flex-row flex-wrap justify-start gap-1">
                    {currentJob.skills.slice(0, 3).map((skill) => (
                      <View
                        key={skill.id}
                        className="bg-blue-100 px-2 py-1 rounded-xl mx-0.5"
                      >
                        <Text className="text-xs font-medium text-blue-800">
                          {skill.name}
                        </Text>
                      </View>
                    ))}
                    {currentJob.skills.length > 3 && (
                      <View className="bg-blue-100 px-2 py-1 rounded-xl mx-0.5">
                        <Text className="text-xs font-medium text-blue-800">
                          +{currentJob.skills.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {currentJob.description && (
                <Text
                  className="w-full mt-5 text-sm italic text-left text-gray-500"
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {currentJob.description}
                </Text>
              )}
            </View>

            <View className="relative z-10 items-center">
              <TouchableOpacity
                className="items-center self-center justify-center px-4 py-2 bg-blue-500 rounded-lg"
                onPressIn={() => {
                  isSwipeDisabled.value = true;
                }}
                onPressOut={() => {
                  setTimeout(() => {
                    isSwipeDisabled.value = false;
                  }, 100);
                }}
                onPress={() => handleOpenModal(currentJob)}
              >
                <Text className="text-base font-bold text-white">
                  Voir plus
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overlays animés */}
          <ReanimatedAnimated.View
            className="absolute inset-0 items-center justify-center bg-red-500/10 rounded-xl"
            style={[leftOverlayStyle]}
          >
            <View className="items-center justify-center px-5 py-4 shadow-lg bg-white/90 rounded-2xl">
              <X size={50} color="#ef4444" />
              <Text className="mt-1 text-lg font-bold text-red-500">
                PASSER
              </Text>
            </View>
          </ReanimatedAnimated.View>

          <ReanimatedAnimated.View
            className="absolute inset-0 items-center justify-center bg-green-500/10 rounded-xl"
            style={[rightOverlayStyle]}
          >
            <View className="items-center justify-center px-5 py-4 shadow-lg bg-white/90 rounded-2xl">
              <Heart size={50} color="#22c55e" />
              <Text className="mt-1 text-lg font-bold text-green-500">
                POSTULER
              </Text>
            </View>
          </ReanimatedAnimated.View>
        </ReanimatedAnimated.View>
      </GestureDetector>

      <View className="flex-row justify-center gap-10 pb-4">
        <TouchableOpacity
          onPress={handlePass}
          className="items-center justify-center p-4 bg-red-500 rounded-full w-15 h-15"
        >
          <X size={30} color="white" />
        </TouchableOpacity>

        {currentIndex > 0 && (
          <TouchableOpacity
            onPress={goToPrevious}
            className="items-center justify-center p-4 bg-gray-500 rounded-full w-15 h-15"
          >
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleApply}
          className="items-center justify-center p-4 bg-green-500 rounded-full w-15 h-15"
        >
          <Heart size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Légende explicative */}
      <View className="px-6 pb-8">
        <Text className="text-sm italic text-center text-gray-500">
          Swipez ou utilisez les boutons pour trier les offres
        </Text>
      </View>

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
            className="flex-1 w-full bg-white rounded-t-3xl"
            style={{
              transform: [{ translateY: slideAnim }],
              maxHeight: screenHeight * 0.5,
              alignSelf: "flex-end",
            }}
          >
            <View
              className="items-center py-4 bg-white rounded-t-3xl"
              {...panResponder.panHandlers}
            >
              <View className="self-center w-12 h-1 bg-gray-300 rounded-full" />
            </View>
            <ScrollView
              className="flex-1 px-6 pb-1"
              showsVerticalScrollIndicator={true}
              bounces={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* En-tête */}
              <View className="items-center mb-6">
                <View className="flex-row items-center gap-2 mb-2">
                  <Building2 size={24} color="#374151" />
                  <Text className="text-2xl font-bold text-black">
                    {selectedJob?.title}
                  </Text>
                </View>
                <Text className="text-base text-center text-gray-500">
                  {selectedJob?.company?.company_name || "Entreprise inconnue"}
                </Text>
              </View>

              {/* Informations principales */}
              <View className="mb-6">
                <View className="flex-row items-center mb-4">
                  <View className="items-center w-24">
                    <MapPin size={20} color="#374151" />
                    <Text className="mt-1 text-sm font-medium text-gray-500">
                      Localisation
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-700">
                    {selectedJob?.location || "Non renseigné"}
                  </Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <View className="items-center w-24">
                    <Briefcase size={20} color="#374151" />
                    <Text className="mt-1 text-sm font-medium text-gray-500">
                      Contrat
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-700">
                    {selectedJob?.contract_type || "Non renseigné"}
                  </Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <View className="items-center w-24">
                    <DollarSign size={20} color="#22c55e" />
                    <Text className="mt-1 text-sm font-medium text-gray-500">
                      Salaire
                    </Text>
                  </View>
                  <Text className="flex-1 text-base font-bold text-green-500">
                    {selectedJob?.salary_range || "Non renseigné"}
                  </Text>
                </View>
              </View>

              {/* Description complète */}
              <View className="mb-6">
                <Text className="mb-3 text-lg font-semibold text-gray-700">
                  Description du poste
                </Text>
                <Text className="text-base leading-6 text-gray-500">
                  {selectedJob?.description || "Aucune description fournie."}
                </Text>
              </View>

              {/* Compétences */}
              {selectedJob?.skills && selectedJob.skills.length > 0 && (
                <View className="mb-6">
                  <Text className="mb-3 text-lg font-semibold text-gray-700">
                    Compétences requises
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {selectedJob.skills.map((skill) => (
                      <View
                        key={skill.id}
                        className="bg-blue-100 px-3 py-1.5 rounded-2xl"
                      >
                        <Text className="text-sm font-medium text-blue-800">
                          {skill.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Certifications */}
              {selectedJob?.certifications &&
                selectedJob.certifications.length > 0 && (
                  <View className="mb-6">
                    <Text className="mb-3 text-lg font-semibold text-gray-700">
                      Certifications
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {selectedJob.certifications.map((cert) => (
                        <View
                          key={cert.id}
                          className="bg-purple-100 px-3 py-1.5 rounded-2xl"
                        >
                          <Text className="text-sm font-medium text-purple-700">
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
                  className="items-center flex-1 px-6 py-3 bg-green-500 rounded-lg"
                  onPress={() => handleModalAction("right")}
                >
                  <Text className="text-base font-semibold text-white">
                    Postuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center flex-1 px-6 py-3 bg-red-500 rounded-lg"
                  onPress={() => handleModalAction("left")}
                >
                  <Text className="text-base font-semibold text-white">
                    Passer
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="items-center self-center px-6 py-3 mt-2 mb-4 bg-gray-200 rounded-lg"
                onPress={handleCloseModal}
              >
                <Text className="text-base font-semibold text-gray-700">
                  Fermer
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}
