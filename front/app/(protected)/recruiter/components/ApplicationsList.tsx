import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
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
import { Application } from "@/types/interfaces";
import { useMatch } from "@/lib/hooks/useMatch";
import Toast from "react-native-toast-message";

const { height: screenHeight } = Dimensions.get("window");

interface ApplicationsListProps {
  jobId: string;
  onBack: () => void;
}

function OverlayLabelLeft() {
  return (
    <View className="items-center justify-center flex-1 border-4 border-red-500 bg-red-500/20 rounded-xl">
      <View className="p-4 bg-red-500 rounded-full">
        <X size={40} color="white" />
      </View>
      <Text className="mt-2 text-xl font-bold text-red-500">PASSER</Text>
    </View>
  );
}

function OverlayLabelRight() {
  return (
    <View className="items-center justify-center flex-1 border-4 border-green-500 bg-green-500/20 rounded-xl">
      <View className="p-4 bg-green-500 rounded-full">
        <Check size={40} color="white" />
      </View>
      <Text className="mt-2 text-xl font-bold text-green-500">MATCH</Text>
    </View>
  );
}

const ApplicationCard = ({
  application,
  onPress,
}: {
  application: Application;
  onPress: () => void;
}) => {
  return (
    <View className="flex flex-col justify-between w-full h-full p-6 bg-white shadow-lg rounded-xl">
      <View className="flex items-center justify-center h-[80%]">
        <View className="flex-row items-center justify-center w-full gap-2 mb-2">
          <User size={20} color="#374151" />
          <Text className="text-xl font-bold text-center text-black">
            {application.candidate.user.first_name}{" "}
            {application.candidate.user.last_name}
          </Text>
        </View>
        <Text className="w-full mb-4 text-sm text-center text-gray-500">
          Candidat depuis le{" "}
          {new Date(application.created_at).toLocaleDateString()}
        </Text>

        <View className="w-full mb-4 space-y-2">
          <View className="flex-row items-center gap-2">
            <MapPin size={18} color="#374151" />
            <Text className="text-lg text-gray-700">
              {application.candidate.location || "Non renseigné"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Briefcase size={18} color="#374151" />
            <Text className="text-lg text-gray-700">
              Années d'expérience :{" "}
              {application.candidate.experience_year
                ? `${application.candidate.experience_year} ans`
                : "Non renseigné"}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap w-full gap-2">
          <Text className="w-full mb-2 text-sm text-gray-500">Compétences</Text>
          {application.candidate.skills
            ?.filter((skill) =>
              (application.job_post?.skills ?? []).some(
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
          {application.candidate.skills
            ?.filter(
              (skill) =>
                !(application.job_post?.skills ?? []).some(
                  (jobSkill) => jobSkill.id === skill.id
                )
            )
            .slice(
              0,
              Math.max(
                0,
                4 -
                  (application.candidate.skills?.filter((skill) =>
                    (application.job_post?.skills ?? []).some(
                      (jobSkill) => jobSkill.id === skill.id
                    )
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
          {(application.candidate.skills?.length ?? 0) > 4 && (
            <View className="px-3 py-1.5 bg-gray-100 rounded-full">
              <Text className="text-sm font-medium text-gray-700">...</Text>
            </View>
          )}
        </View>

        {application.candidate.certifications &&
          application.candidate.certifications.length > 0 && (
            <View className="flex-row flex-wrap w-full gap-2 mt-4">
              <Text className="w-full mb-2 text-sm text-gray-500">
                Certifications
              </Text>
              {application.candidate.certifications
                .filter((cert) =>
                  (application.job_post?.certifications ?? []).some(
                    (jobCert) => jobCert.id === cert.id
                  )
                )
                .slice(0, 4)
                .map((certification) => (
                  <View
                    key={certification.id}
                    className="px-3 py-1.5 bg-blue-100 rounded-full"
                  >
                    <Text className="text-sm font-medium text-blue-800">
                      {certification.name}
                    </Text>
                  </View>
                ))}
              {application.candidate.certifications
                .filter(
                  (cert) =>
                    !(application.job_post?.certifications ?? []).some(
                      (jobCert) => jobCert.id === cert.id
                    )
                )
                .slice(
                  0,
                  Math.max(
                    0,
                    4 -
                      application.candidate.certifications.filter((cert) =>
                        (application.job_post?.certifications ?? []).some(
                          (jobCert) => jobCert.id === cert.id
                        )
                      ).length
                  )
                )
                .map((certification) => (
                  <View
                    key={certification.id}
                    className="px-3 py-1.5 bg-gray-100 rounded-full"
                  >
                    <Text className="text-sm font-medium text-gray-700">
                      {certification.name}
                    </Text>
                  </View>
                ))}
              {application.candidate.certifications.length > 4 && (
                <View className="px-3 py-1.5 bg-gray-100 rounded-full">
                  <Text className="text-sm font-medium text-gray-700">...</Text>
                </View>
              )}
            </View>
          )}

        <View className="flex-row items-center justify-center w-full gap-4 mt-4">
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 bg-blue-100 rounded-full" />
            <Text className="text-xs text-gray-500">Correspond à l'offre</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 bg-gray-100 rounded-full" />
            <Text className="text-xs text-gray-500">Autre compétence</Text>
          </View>
        </View>
      </View>
      <Pressable
        className="self-center px-4 py-2 mt-6 bg-blue-500 rounded-lg"
        onPress={onPress}
      >
        <Text className="font-semibold text-white">Voir plus</Text>
      </Pressable>
    </View>
  );
};

export default function ApplicationsList({
  jobId,
  onBack,
}: ApplicationsListProps) {
  const {
    applications: companyJobPosts,
    isLoadingApplications: isLoadingJobPosts,
  } = useJobPost();
  const { createMatch } = useMatch();
  const ref = useRef<SwiperCardRefType>(null);

  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 250) {
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setIsModalVisible(false);
          });
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
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

  const resetSwiper = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsAllSwiped(false);
      setIndex(0);
      setSwiperKey((prev) => prev + 1);
    });
  };

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
          setTimeout(() => setSelectedApplication(null), 0);
        }
      });
    }
  }, [isModalVisible]);

  const handleSwipe = useCallback(
    (direction: "left" | "right", cardIndex: number) => {
      if (cardIndex >= pendingApplications.length) return;

      const application = pendingApplications[cardIndex];
      if (!application) return;

      if (direction === "right") {
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
                text1: "Match!",
                text2: `Match créé avec ${application.candidate.user.first_name}.`,
              });
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
      }
    },
    [pendingApplications, createMatch, jobId]
  );

  const onSwipedAll = useCallback(() => {
    setIsAllSwiped(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleOpenModal = (application: Application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleModalAction = (direction: "left" | "right") => {
    if (!selectedApplication) return;
    const cardIndex = pendingApplications.findIndex(
      (app) => app.id === selectedApplication.id
    );
    handleSwipe(direction, cardIndex);
    setIsModalVisible(false);
  };

  const renderCard = useCallback((application: Application) => {
    return (
      <ApplicationCard
        application={application}
        onPress={() => handleOpenModal(application)}
      />
    );
  }, []);

  if (isLoadingJobPosts) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text>Chargement des candidatures...</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col h-full bg-gray-50">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-4">
          <ArrowLeft size={24} color="#6366f1" />
        </Pressable>
        <Text className="text-xl font-semibold">
          {job?.title} (En attente: {pendingApplications.length})
        </Text>
      </View>

      <View className="flex-1">
        <View className="items-center justify-center h-[80%]">
          <Swiper
            key={swiperKey}
            ref={ref}
            cardStyle={{
              width: "90%",
              height: "90%",
              borderRadius: 12,
            }}
            data={pendingApplications}
            renderCard={renderCard}
            onIndexChange={setIndex}
            onSwipeRight={(cardIndex) => {
              handleSwipe("right", cardIndex);
            }}
            onSwipedAll={onSwipedAll}
            onSwipeLeft={(cardIndex) => {
              handleSwipe("left", cardIndex);
            }}
            OverlayLabelRight={OverlayLabelRight}
            OverlayLabelLeft={OverlayLabelLeft}
            disableTopSwipe={true}
            disableBottomSwipe={true}
          />
        </View>

        <View className="pt-4 pb-8">
          <View className="flex-row items-center justify-center gap-4 pb-4">
            <TouchableOpacity
              onPress={() => {
                handleSwipe("left", index);
                ref.current?.swipeLeft();
              }}
              className="p-4 bg-white border border-red-200 rounded-full shadow-lg"
              activeOpacity={0.7}
            >
              <X size={32} color="#ef4444" />
            </TouchableOpacity>
            {index > 0 && (
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
                handleSwipe("right", index);
                ref.current?.swipeRight();
              }}
              className="p-4 bg-white border border-green-200 rounded-full shadow-lg"
              activeOpacity={0.7}
            >
              <Check size={32} color="#22c55e" />
            </TouchableOpacity>
          </View>
          <Text className="mb-4 text-sm text-center text-gray-500">
            Swipez ou utilisez les boutons pour naviguer
          </Text>
        </View>
      </View>

      {isAllSwiped && (
        <Animated.View
          className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-black/80"
          style={{
            opacity: fadeAnim,
            top: 56, // Hauteur de la barre de navigation
          }}
        >
          <View className="items-center max-w-sm p-8 mx-6 bg-white rounded-xl">
            <Text className="mb-2 text-2xl font-bold text-gray-800">
              Terminé ! 🎉
            </Text>
            <Text className="mb-6 text-lg text-center text-gray-600">
              {job?.applications?.length === 0
                ? "Il n'y a pas encore de candidature pour ce poste."
                : "Vous avez parcouru toutes les candidatures disponibles"}
            </Text>
            {pendingApplications.length > 0 && (
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
            {pendingApplications.length === 0 && (
              <Text className="text-sm text-center text-gray-500">
                Revenez plus tard pour de nouvelles candidatures !
              </Text>
            )}
          </View>
        </Animated.View>
      )}

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
                <View className="flex-row items-center justify-center gap-2 mb-2">
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
              <View className="flex flex-col gap-4 mb-6">
                <View className="flex-row items-center">
                  <View className="items-center w-24">
                    <MapPin size={20} color="#374151" className="mb-1" />
                    <Text className="text-sm font-medium text-gray-600">
                      Localisation
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-800">
                    {selectedApplication?.candidate.location || "Non renseigné"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="items-center w-24">
                    <Briefcase size={20} color="#374151" className="mb-1" />
                    <Text className="text-sm font-medium text-gray-600">
                      Expérience
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-800">
                    Années d'expérience :{" "}
                    {selectedApplication?.candidate.experience_year
                      ? `${selectedApplication.candidate.experience_year} ans`
                      : "Non renseigné"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View className="items-center w-24">
                    <Mail size={20} color="#374151" className="mb-1" />
                    <Text className="text-sm font-medium text-gray-600">
                      Email
                    </Text>
                  </View>
                  <Text className="flex-1 text-base text-gray-800">
                    {selectedApplication?.candidate.user.email}
                  </Text>
                </View>
              </View>

              {/* Bio et métier souhaité */}
              <View className="mb-6">
                <View className="mb-4">
                  <Text className="mb-2 text-lg font-semibold text-gray-800">
                    Métier souhaité
                  </Text>
                  <Text className="text-base text-gray-700">
                    {selectedApplication?.candidate.prefered_job ||
                      "Non renseigné"}
                  </Text>
                </View>

                <View>
                  <Text className="mb-2 text-lg font-semibold text-gray-800">
                    À propos
                  </Text>
                  <Text className="text-base text-gray-700">
                    {selectedApplication?.candidate.bio ||
                      "Aucune biographie fournie."}
                  </Text>
                </View>
              </View>

              {/* Compétences */}
              <View className="mb-6">
                <Text className="mb-3 text-lg font-semibold text-gray-800">
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
                    <Text className="mb-3 text-lg font-semibold text-gray-800">
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
                              selectedApplication.job_post?.certifications ?? []
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
                    Autre compétence
                  </Text>
                </View>
              </View>

              {/* Boutons d'action */}
              <View className="flex-row justify-center gap-4 mt-6 mb-4">
                <TouchableOpacity
                  className="flex-1 px-6 py-3 bg-green-500 rounded-lg"
                  onPress={() => handleModalAction("right")}
                >
                  <Text className="font-semibold text-center text-white">
                    Match
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
