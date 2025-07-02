import React, { useState, useRef } from "react";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import Header from "@/components/Header";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
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
import { LinearGradient } from "expo-linear-gradient";
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
import { Portal } from "react-native-portalize";

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
      const jobToOpen = availableJobs[currentIndex];
      runOnJS(handleOpenModal)(jobToOpen);
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
      <ScreenWrapper>
        <View style={{ backgroundColor: "#F7F7F7", flex: 1 }}>
          <Header title="LES OFFRES" />
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-bold">Chargement des offres...</Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (availableJobs.length === 0) {
    return (
      <ScreenWrapper>
        <View style={{ backgroundColor: "#F7F7F7", flex: 1 }}>
          <Header title="LES OFFRES" />
          <View className="flex-1 justify-center items-center px-5">
            <Text className="mb-5 text-2xl font-bold text-center">
              Aucune nouvelle offre disponible
            </Text>
            <Text className="text-base text-center text-gray-500">
              Vous avez déjà postulé à toutes les offres disponibles. Revenez
              plus tard pour de nouvelles opportunités !
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (currentIndex >= availableJobs.length) {
    return (
      <ScreenWrapper>
        <View style={{ backgroundColor: "#F7F7F7", flex: 1 }}>
          <Header title="LES OFFRES" />
          <View className="flex-1 justify-center items-center px-5">
            <Text className="mb-5 text-2xl font-bold text-center">
              Toutes les offres parcourues ! 🎉
            </Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={() => setCurrentIndex(0)}
            >
              <LinearGradient
                colors={["#4717F6", "#4717F6"]}
                style={styles.restartButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text className="text-base font-bold text-white">
                  Recommencer
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  const currentJob = availableJobs[currentIndex];

  return (
    <ScreenWrapper>
      <View style={{ backgroundColor: "#F7F7F7", flex: 1 }}>
        <Header title="LES OFFRES" />

        <GestureHandlerRootView className="flex-1">
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {availableJobs.length}
            </Text>
          </View>

          <GestureDetector gesture={composedGestures}>
            <ReanimatedAnimated.View
              style={[styles.cardContainer, animatedCardStyle]}
            >
              <View style={styles.card}>
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.98)",
                    "rgba(250, 250, 255, 1)",
                  ]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Header avec dégradé */}
                  <View style={styles.cardHeaderSection}>
                    <LinearGradient
                      colors={["#4717F6", "#6366f1"]}
                      style={styles.cardHeaderGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <View style={styles.cardHeaderContent}>
                        <Text style={styles.jobTitleCard}>
                          {currentJob.title}
                        </Text>
                        <View style={styles.companyRowCard}>
                          <Building2
                            size={16}
                            color="rgba(255, 255, 255, 0.9)"
                          />
                          <Text style={styles.companyNameCard}>
                            {currentJob.company?.company_name ||
                              "Entreprise inconnue"}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>

                  <View style={{ flex: 1, padding: 16 }}>
                    {/* Informations principales */}
                    <View style={styles.infoSectionCard}>
                      <View style={styles.infoCardContainer}>
                        <View style={styles.infoCard}>
                          <MapPin size={18} color="#4717F6" />
                          <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>
                              Localisation
                            </Text>
                            <Text style={styles.infoCardValue}>
                              {currentJob.location}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.infoCard}>
                          <Briefcase size={18} color="#4717F6" />
                          <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Contrat</Text>
                            <Text style={styles.infoCardValue}>
                              {currentJob.contract_type}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.infoCard}>
                          <DollarSign size={18} color="#22c55e" />
                          <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Salaire</Text>
                            <Text style={styles.salaryCardValue}>
                              {currentJob.salary_range}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Compétences */}
                    {currentJob.skills && currentJob.skills.length > 0 && (
                      <View style={styles.skillsSectionCard}>
                        <Text style={styles.sectionTitleCard}>
                          Compétences requises
                        </Text>
                        <View style={styles.skillsContainerCard}>
                          {currentJob.skills.slice(0, 4).map((skill) => (
                            <View key={skill.id} style={styles.skillBadgeCard}>
                              <Text style={styles.skillTextCard}>
                                {skill.name}
                              </Text>
                            </View>
                          ))}
                          {currentJob.skills.length > 4 && (
                            <View style={styles.skillBadgeExtra}>
                              <Text style={styles.skillTextExtra}>
                                +{currentJob.skills.length - 4}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Description */}
                    {currentJob.description && (
                      <View style={styles.descriptionSectionCard}>
                        <Text style={styles.sectionTitleCard}>Description</Text>
                        <View style={styles.descriptionContainer}>
                          <Text
                            style={styles.descriptionTextCard}
                            numberOfLines={3}
                          >
                            {currentJob.description}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Bouton "Voir plus" */}
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={styles.seeMoreButton}
                      onPressIn={() => {
                        isSwipeDisabled.value = true;
                      }}
                      onPressOut={() => {
                        setTimeout(() => {
                          isSwipeDisabled.value = false;
                        }, 100);
                      }}
                      onPress={() => {
                        const jobAtPress = availableJobs[currentIndex];
                        handleOpenModal(jobAtPress);
                      }}
                    >
                      <LinearGradient
                        colors={["#01E6C3", "#00D4AA"]}
                        style={styles.seeMoreGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.seeMoreText}>
                          Voir plus de détails
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>

              {/* Overlays animés */}
              <ReanimatedAnimated.View
                style={[styles.leftOverlay, leftOverlayStyle]}
              >
                <View style={styles.overlayContent}>
                  <X size={50} color="#ffffff" />
                  <Text style={styles.overlayTextRed}>PASSER</Text>
                </View>
              </ReanimatedAnimated.View>

              <ReanimatedAnimated.View
                style={[styles.rightOverlay, rightOverlayStyle]}
              >
                <View style={styles.overlayContent}>
                  <Heart size={50} color="#ffffff" />
                  <Text style={styles.overlayTextGreen}>POSTULER</Text>
                </View>
              </ReanimatedAnimated.View>
            </ReanimatedAnimated.View>
          </GestureDetector>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handlePass}
              style={styles.actionButtonRed}
            >
              <X size={30} color="white" />
            </TouchableOpacity>

            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={goToPrevious}
                style={styles.actionButtonGray}
              >
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleApply}
              style={styles.actionButtonGreen}
            >
              <Heart size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Légende explicative */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>
              Swipez ou utilisez les boutons pour trier les offres
            </Text>
          </View>

          <Portal>
            {isSheetVisible && (
              <Animated.View
                style={[styles.modalBackdrop, { opacity: backdropAnim }]}
              >
                <Animated.View
                  style={[
                    styles.modalSheet,
                    { transform: [{ translateY: slideAnim }] },
                  ]}
                >
                  <View
                    style={styles.modalHandle}
                    {...panResponder.panHandlers}
                  >
                    <View style={styles.handleBar} />
                  </View>

                  <ScrollView
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    contentContainerStyle={{ paddingBottom: 32 }}
                  >
                    {/* En-tête modal */}
                    <View style={styles.modalHeaderContainer}>
                      <LinearGradient
                        colors={["#4717F6", "#6366f1"]}
                        style={styles.modalHeaderGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <View style={styles.modalHeaderContent}>
                          <Text style={styles.modalTitle}>
                            {selectedJob?.title}
                          </Text>
                          <View style={styles.modalCompanyRow}>
                            <Building2
                              size={20}
                              color="rgba(255, 255, 255, 0.9)"
                            />
                            <Text style={styles.modalCompany}>
                              {selectedJob?.company?.company_name ||
                                "Entreprise inconnue"}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>

                    {/* Informations principales modal */}
                    <View style={styles.modalInfoSection}>
                      <View style={styles.modalInfoCard}>
                        <MapPin size={20} color="#4717F6" />
                        <View style={styles.modalInfoContent}>
                          <Text style={styles.modalInfoLabel}>
                            Localisation
                          </Text>
                          <Text style={styles.modalInfoValue}>
                            {selectedJob?.location || "Non renseigné"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.modalInfoCard}>
                        <Briefcase size={20} color="#4717F6" />
                        <View style={styles.modalInfoContent}>
                          <Text style={styles.modalInfoLabel}>
                            Type de contrat
                          </Text>
                          <Text style={styles.modalInfoValue}>
                            {selectedJob?.contract_type || "Non renseigné"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.modalInfoCard}>
                        <DollarSign size={20} color="#22c55e" />
                        <View style={styles.modalInfoContent}>
                          <Text style={styles.modalInfoLabel}>
                            Rémunération
                          </Text>
                          <Text style={styles.modalSalaryValue}>
                            {selectedJob?.salary_range || "Non renseigné"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Description complète */}
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>
                        Description du poste
                      </Text>
                      <View style={styles.modalDescriptionContainer}>
                        <Text style={styles.modalDescription}>
                          {selectedJob?.description ||
                            "Aucune description fournie."}
                        </Text>
                      </View>
                    </View>

                    {/* Compétences modal */}
                    {selectedJob?.skills && selectedJob.skills.length > 0 && (
                      <View style={styles.modalSection}>
                        <Text style={styles.modalSectionTitle}>
                          Compétences requises
                        </Text>
                        <View style={styles.modalSkillsContainer}>
                          {selectedJob.skills.map((skill) => (
                            <View key={skill.id} style={styles.modalSkillBadge}>
                              <Text style={styles.modalSkillText}>
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
                        <View style={styles.modalSection}>
                          <Text style={styles.modalSectionTitle}>
                            Certifications
                          </Text>
                          <View style={styles.modalSkillsContainer}>
                            {selectedJob.certifications.map((cert) => (
                              <View key={cert.id} style={styles.modalCertBadge}>
                                <Text style={styles.modalCertText}>
                                  {cert.name}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                    {/* Boutons d'action modal */}
                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={styles.modalActionGreen}
                        onPress={() => handleModalAction("right")}
                      >
                        <LinearGradient
                          colors={["#36E9CD", "#36E9CD"]}
                          style={styles.modalActionGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Heart size={18} color="white" />
                          <Text style={styles.modalActionText}>Postuler</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalActionRed}
                        onPress={() => handleModalAction("left")}
                      >
                        <LinearGradient
                          colors={["#FF2056", "#FF2056"]}
                          style={styles.modalActionGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <X size={18} color="white" />
                          <Text style={styles.modalActionText}>Passer</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.modalClose}
                      onPress={handleCloseModal}
                    >
                      <Text style={styles.modalCloseText}>Fermer</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </Animated.View>
              </Animated.View>
            )}
          </Portal>
        </GestureHandlerRootView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 2,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 12,
  },

  cardHeaderSection: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  cardHeaderGradient: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardHeaderContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  jobTitleCard: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 6,
  },
  companyRowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  companyNameCard: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  infoSectionCard: {
    marginBottom: 14,
  },
  infoCardContainer: {
    gap: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4717F6",
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "700",
  },
  salaryCardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22c55e",
  },
  skillsSectionCard: {
    marginBottom: 14,
  },
  sectionTitleCard: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "700",
    marginBottom: 8,
  },
  skillsContainerCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadgeCard: {
    backgroundColor: "#4717F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    // Shadow for iOS
    shadowColor: "#4717F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  skillTextCard: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  skillBadgeExtra: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    // Shadow for iOS
    shadowColor: "#6B7280",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  skillTextExtra: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  descriptionSectionCard: {
    marginBottom: 12,
  },
  descriptionContainer: {
    padding: 12,
    backgroundColor: "rgba(243, 244, 246, 0.8)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  descriptionTextCard: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    textAlign: "justify",
  },
  cardFooter: {
    padding: 14,
    alignItems: "center",
  },
  seeMoreButton: {
    alignSelf: "center",
  },
  seeMoreGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  seeMoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  leftOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 32, 86, 0.85)",
    borderRadius: 12,
  },
  rightOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(54, 233, 205, 0.85)",
    borderRadius: 12,
  },
  overlayContent: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 6,
  },
  overlayTextRed: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },
  overlayTextGreen: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    paddingBottom: 12,
  },
  actionButtonRed: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF2056",
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 6,
  },
  actionButtonGray: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6B7280",
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 6,
  },
  actionButtonGreen: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#36E9CD",
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 6,
  },
  legendContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  legendText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    color: "#6B7280",
  },
  restartButton: {
    marginTop: 20,
  },
  restartButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  // Modal styles
  modalBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "70%",
    alignSelf: "flex-end",
    width: "100%",
    // Shadow for iOS
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 10,
  },
  modalHandle: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleBar: {
    width: 48,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },

  modalHeaderContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeaderGradient: {
    borderRadius: 12,
  },
  modalHeaderContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  modalCompanyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalCompany: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  modalInfoSection: {
    marginBottom: 24,
  },
  modalInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4717F6",
  },
  modalInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  modalInfoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  modalInfoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  modalSalaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22c55e",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  modalDescriptionContainer: {
    padding: 12,
    backgroundColor: "rgba(243, 244, 246, 0.8)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
  },
  modalSkillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalSkillBadge: {
    backgroundColor: "#4717F6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    // Shadow for iOS
    shadowColor: "#4717F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  modalSkillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  modalCertBadge: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    // Shadow for iOS
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  modalCertText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  modalActionGreen: {
    flex: 1,
  },
  modalActionRed: {
    flex: 1,
  },
  modalActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  modalClose: {
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
