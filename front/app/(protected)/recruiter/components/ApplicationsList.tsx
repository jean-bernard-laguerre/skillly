import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  ActivityIndicator,
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
  Check,
  X,
  User,
  ArrowLeft,
  MapPin,
  Briefcase,
  Mail,
  RefreshCw,
  RotateCcw,
} from "lucide-react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Application } from "@/types/interfaces";
import { useMatch } from "@/lib/hooks/useMatch";
import Toast from "react-native-toast-message";
import { Portal } from "react-native-portalize";

const SWIPE_THRESHOLD = 100;
const { height: screenHeight } = Dimensions.get("window");

interface ApplicationsListProps {
  jobId: string;
  onBack: () => void;
}

export default function ApplicationsList({
  jobId,
  onBack,
}: ApplicationsListProps) {
  const {
    applications: companyJobPosts,
    isLoadingApplications: isLoadingJobPosts,
  } = useJobPost();
  const { createMatch } = useMatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
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

  const job = useMemo(
    () => companyJobPosts?.find((job) => job.id === jobId),
    [companyJobPosts, jobId]
  );

  const pendingApplications = useMemo(() => {
    return job?.applications?.filter((app) => app.state === "pending") || [];
  }, [job]);

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
          setTimeout(() => setSelectedApplication(null), 0);
        }
      });
    }
  }, [isModalVisible]);

  const handleOpenModal = (application: Application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleModalAction = (direction: "left" | "right") => {
    if (!selectedApplication) return;
    if (direction === "right") {
      handleMatch();
    } else {
      handlePass();
    }
    setIsModalVisible(false);
  };

  // Fonction pour créer un match
  const handleMatch = () => {
    const application = pendingApplications[currentIndex];
    if (!application) return;

    animateCardExit("right", () => {
      createMatch(
        {
          application_id: parseInt(application.id, 10),
          candidate_id: parseInt(application.candidate.id, 10),
          job_post_id: parseInt(jobId, 10),
        },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: "Match ! 🎉",
              text2: `Match créé avec ${application.candidate.user.first_name}.`,
            });
            goToNext();
          },
          onError: () => {
            Toast.show({
              type: "error",
              text1: "Erreur",
              text2: "Impossible de créer le match.",
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
      translateY.value = event.translationY * 0.5;
    })
    .onEnd((event) => {
      if (isSwipeDisabled.value) return;
      scale.value = withSpring(1);

      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? "right" : "left";

        if (direction === "right") {
          runOnJS(handleMatch)();
        } else {
          runOnJS(handlePass)();
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const tapGesture = Gesture.Tap().onStart(() => {
    if (Math.abs(translateX.value) < 10) {
      runOnJS(handleOpenModal)(currentApplication);
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

  if (isLoadingJobPosts) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-lg font-semibold">
          Chargement des candidatures...
        </Text>
      </View>
    );
  }

  if (pendingApplications.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <ArrowLeft size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">
            {job?.title} (En attente: 0)
          </Text>
        </View>
        <View className="items-center justify-center flex-1 px-5">
          <Text className="mb-5 text-2xl font-bold text-center">
            Aucune candidature en attente
          </Text>
          <Text className="text-base text-center text-gray-500">
            Il n'y a pas encore de candidature pour ce poste. Revenez plus tard
            !
          </Text>
        </View>
      </View>
    );
  }

  if (currentIndex >= pendingApplications.length) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <ArrowLeft size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">
            {job?.title} (En attente: {pendingApplications.length})
          </Text>
        </View>
        <View className="items-center justify-center flex-1 px-5">
          <Text className="mb-5 text-2xl font-bold text-center">
            Terminé ! 🎉
          </Text>
          <Text className="mb-6 text-lg text-center text-gray-600">
            Vous avez parcouru toutes les candidatures disponibles
          </Text>
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 bg-blue-500 rounded-lg"
            onPress={() => setCurrentIndex(0)}
          >
            <RefreshCw size={20} color="white" />
            <Text className="ml-2 font-semibold text-white">Recommencer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentApplication = pendingApplications[currentIndex];

  return (
    <GestureHandlerRootView className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={onBack} className="mr-4">
          <ArrowLeft size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">
          {job?.title} (En attente: {pendingApplications.length})
        </Text>
      </View>

      <GestureDetector gesture={composedGestures}>
        <ReanimatedAnimated.View
          className="flex-1 mx-5 mt-5 mb-3 bg-white border border-gray-100 shadow-2xl rounded-xl"
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
                <View className="flex-row items-center gap-2 mb-2">
                  <User size={20} color="#374151" />
                  <Text className="text-xl font-bold text-center text-black">
                    {currentApplication.candidate.user.first_name}{" "}
                    {currentApplication.candidate.user.last_name}
                  </Text>
                </View>
                <Text className="mb-4 text-sm text-center text-gray-500">
                  Candidat depuis le{" "}
                  {new Date(currentApplication.created_at).toLocaleDateString()}
                </Text>
              </View>

              <View className="w-full mb-4 space-y-2">
                <View className="flex-row items-center gap-2">
                  <MapPin size={18} color="#374151" />
                  <Text className="text-lg text-gray-700">
                    {currentApplication.candidate.location || "Non renseigné"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Briefcase size={18} color="#374151" />
                  <Text className="text-lg text-gray-700">
                    Années d'expérience :{" "}
                    {currentApplication.candidate.experience_year
                      ? `${currentApplication.candidate.experience_year} ans`
                      : "Non renseigné"}
                  </Text>
                </View>
              </View>

              {currentApplication.candidate.skills &&
                currentApplication.candidate.skills.length > 0 && (
                  <View className="w-full">
                    <Text className="mb-2 text-sm text-gray-500">
                      Compétences
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {currentApplication.candidate.skills
                        .filter((skill) =>
                          (currentApplication.job_post?.skills ?? []).some(
                            (jobSkill) => jobSkill.id === skill.id
                          )
                        )
                        .slice(0, 4)
                        .map((skill) => (
                          <View
                            key={skill.id}
                            className="px-3 py-1.5 bg-blue-100 rounded-full"
                          >
                            <Text className="text-sm font-medium text-blue-800">
                              {skill.name}
                            </Text>
                          </View>
                        ))}
                      {currentApplication.candidate.skills
                        .filter(
                          (skill) =>
                            !(currentApplication.job_post?.skills ?? []).some(
                              (jobSkill) => jobSkill.id === skill.id
                            )
                        )
                        .slice(
                          0,
                          Math.max(
                            0,
                            4 -
                              (currentApplication.candidate.skills?.filter(
                                (skill) =>
                                  (
                                    currentApplication.job_post?.skills ?? []
                                  ).some((jobSkill) => jobSkill.id === skill.id)
                              ).length ?? 0)
                          )
                        )
                        .map((skill) => (
                          <View
                            key={skill.id}
                            className="px-3 py-1.5 bg-gray-100 rounded-full"
                          >
                            <Text className="text-sm font-medium text-gray-700">
                              {skill.name}
                            </Text>
                          </View>
                        ))}
                      {(currentApplication.candidate.skills?.length ?? 0) >
                        4 && (
                        <View className="px-3 py-1.5 bg-gray-100 rounded-full">
                          <Text className="text-sm font-medium text-gray-700">
                            ...
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

              <View className="flex-row items-center justify-center w-full gap-4 mt-4">
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 bg-blue-100 rounded-full" />
                  <Text className="text-xs text-gray-500">
                    Correspond à l'offre
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 bg-gray-100 rounded-full" />
                  <Text className="text-xs text-gray-500">
                    Autre(s) compétence(s)
                  </Text>
                </View>
              </View>
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
                onPress={() => handleOpenModal(currentApplication)}
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
              <Check size={50} color="#22c55e" />
              <Text className="mt-1 text-lg font-bold text-green-500">
                MATCH
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
          onPress={handleMatch}
          className="items-center justify-center p-4 bg-green-500 rounded-full w-15 h-15"
        >
          <Check size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Légende explicative */}
      <View className="px-6 pb-8">
        <Text className="text-sm italic text-center text-gray-500">
          Swipez ou utilisez les boutons pour naviguer
        </Text>
      </View>

      <Portal>
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
                    <User size={24} color="#374151" />
                    <Text className="text-2xl font-bold text-black">
                      {selectedApplication?.candidate.user.first_name}{" "}
                      {selectedApplication?.candidate.user.last_name}
                    </Text>
                  </View>
                  <Text className="text-base text-center text-gray-500">
                    Candidat depuis le{" "}
                    {selectedApplication &&
                      new Date(
                        selectedApplication.created_at
                      ).toLocaleDateString()}
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
                      {selectedApplication?.candidate.location ||
                        "Non renseigné"}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-4">
                    <View className="items-center w-24">
                      <Briefcase size={20} color="#374151" />
                      <Text className="mt-1 text-sm font-medium text-gray-500">
                        Expérience
                      </Text>
                    </View>
                    <Text className="flex-1 text-base text-gray-700">
                      {selectedApplication?.candidate.experience_year
                        ? `${selectedApplication.candidate.experience_year} ans`
                        : "Non renseigné"}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-4">
                    <View className="items-center w-24">
                      <Mail size={20} color="#374151" />
                      <Text className="mt-1 text-sm font-medium text-gray-500">
                        Email
                      </Text>
                    </View>
                    <Text className="flex-1 text-base text-gray-700">
                      {selectedApplication?.candidate.user.email}
                    </Text>
                  </View>
                </View>

                {/* Bio et métier souhaité */}
                <View className="mb-6">
                  <View className="mb-4">
                    <Text className="mb-3 text-lg font-semibold text-gray-700">
                      Métier souhaité
                    </Text>
                    <Text className="text-base leading-6 text-gray-500">
                      {selectedApplication?.candidate.prefered_job ||
                        "Non renseigné"}
                    </Text>
                  </View>

                  <View>
                    <Text className="mb-3 text-lg font-semibold text-gray-700">
                      À propos
                    </Text>
                    <Text className="text-base leading-6 text-gray-500">
                      {selectedApplication?.candidate.bio ||
                        "Aucune biographie fournie."}
                    </Text>
                  </View>
                </View>

                {/* Compétences */}
                <View className="mb-6">
                  <Text className="mb-3 text-lg font-semibold text-gray-700">
                    Compétences
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {selectedApplication?.candidate.skills
                      ?.filter((skill) =>
                        (selectedApplication.job_post?.skills ?? []).some(
                          (jobSkill) => jobSkill.id === skill.id
                        )
                      )
                      .map((skill) => (
                        <View
                          key={skill.id}
                          className="px-3 py-1.5 bg-blue-100 rounded-full"
                        >
                          <Text className="text-sm font-medium text-blue-800">
                            {skill.name}
                          </Text>
                        </View>
                      ))}
                    {selectedApplication?.candidate.skills
                      ?.filter(
                        (skill) =>
                          !(selectedApplication.job_post?.skills ?? []).some(
                            (jobSkill) => jobSkill.id === skill.id
                          )
                      )
                      .map((skill) => (
                        <View
                          key={skill.id}
                          className="px-3 py-1.5 bg-gray-100 rounded-full"
                        >
                          <Text className="text-sm font-medium text-gray-700">
                            {skill.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                {/* Certifications */}
                {selectedApplication?.candidate.certifications &&
                  selectedApplication?.candidate.certifications.length > 0 && (
                    <View className="mb-6">
                      <Text className="mb-3 text-lg font-semibold text-gray-700">
                        Certifications
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {selectedApplication.candidate.certifications
                          .filter((cert) =>
                            (
                              selectedApplication.job_post?.certifications ?? []
                            ).some((jobCert) => jobCert.id === cert.id)
                          )
                          .map((cert) => (
                            <View
                              key={cert.id}
                              className="px-3 py-1.5 bg-blue-100 rounded-full"
                            >
                              <Text className="text-sm font-medium text-blue-800">
                                {cert.name}
                              </Text>
                            </View>
                          ))}
                        {selectedApplication.candidate.certifications
                          .filter(
                            (cert) =>
                              !(
                                selectedApplication.job_post?.certifications ??
                                []
                              ).some((jobCert) => jobCert.id === cert.id)
                          )
                          .map((cert) => (
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

                {/* Légende */}
                <View className="flex-row items-center justify-center gap-4 mt-2 mb-4">
                  <View className="flex-row items-center gap-1">
                    <View className="w-3 h-3 bg-blue-100 rounded-full" />
                    <Text className="text-xs text-gray-500">
                      Correspond à l'offre
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <View className="w-3 h-3 bg-gray-100 rounded-full" />
                    <Text className="text-xs text-gray-500">
                      Autre(s) compétence(s)
                    </Text>
                  </View>
                </View>

                {/* Boutons d'action */}
                <View className="flex-row justify-center gap-4 mt-6 mb-4">
                  <TouchableOpacity
                    className="items-center flex-1 px-6 py-3 bg-green-500 rounded-lg"
                    onPress={() => handleModalAction("right")}
                  >
                    <Text className="text-base font-semibold text-white">
                      Match
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
      </Portal>
    </GestureHandlerRootView>
  );
}
