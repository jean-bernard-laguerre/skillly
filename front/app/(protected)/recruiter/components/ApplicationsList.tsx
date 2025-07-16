import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Mail,
  Calendar,
  Check,
  X,
} from "lucide-react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Application } from "@/types/interfaces";
import { useMatch } from "@/lib/hooks/useMatch";
import Toast from "react-native-toast-message";
import { Portal } from "react-native-portalize";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

// Fonction pour obtenir les dimensions adaptatives
const getAdaptiveStyles = () => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;
  const isLargeScreen = screenHeight >= 850;

  return {
    // Marges et paddings adaptatifs
    cardMargin: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
    cardPadding: isSmallScreen ? 12 : isMediumScreen ? 16 : 18,
    sectionMargin: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
    progressPadding: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
    buttonSpacing: isSmallScreen ? 20 : isMediumScreen ? 28 : 32,
    buttonSize: isSmallScreen ? 45 : isMediumScreen ? 48 : 50,
    iconSize: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
    // Légende adaptative
    showLegend: !isSmallScreen, // Masquer la légende sur petits écrans
    legendPadding: isSmallScreen ? 8 : isMediumScreen ? 12 : 20,
  };
};

interface ApplicationsListProps {
  jobId: string;
  onBack: () => void;
  hideHeader?: boolean;
}

export default function ApplicationsList({
  jobId,
  onBack,
  hideHeader = false,
}: ApplicationsListProps) {
  const { applications: companyJobPosts, isLoadingApplications } = useJobPost();
  const { createMatch } = useMatch();
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Obtenir les styles adaptatifs
  const adaptiveStyles = getAdaptiveStyles();

  // Valeurs pour le swipe
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const isSwipeDisabled = useSharedValue(false);

  const job = companyJobPosts?.find((job) => job.id === jobId);
  const pendingApplications =
    job?.applications?.filter((app) => app.state === "pending") || [];

  const SWIPE_THRESHOLD = 100;

  // PanResponder pour la bottom sheet (comme dans jobOffers)
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

  const handleMatch = (application: Application) => {
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
              text1: "Match créé ! 🎉",
              text2: `Match avec ${application.candidate.user.first_name}.`,
            });
            // Toujours aller à la candidature suivante (même si c'est la fin)
            setCurrentIndex(currentIndex + 1);
          },
          onError: () => {
            Toast.show({
              type: "error",
              text1: "Erreur",
              text2: "Impossible de créer le match.",
            });
            // Même en cas d'erreur, on passe à la suivante
            setCurrentIndex(currentIndex + 1);
          },
        }
      );
    });
  };

  const handlePass = (application: Application) => {
    animateCardExit("left", () => {
      // Logique pour passer/rejeter une candidature
      // Toujours aller à la candidature suivante (même si c'est la fin)
      setCurrentIndex(currentIndex + 1);
    });
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

  // Gestionnaire de gestes avec la même logique que jobOffers
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
        const application = pendingApplications[currentIndex];

        if (direction === "right") {
          runOnJS(handleMatch)(application);
        } else {
          runOnJS(handlePass)(application);
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
      const application = pendingApplications[currentIndex];
      runOnJS(handleOpenModal)(application);
    }
  });

  // Composition des gestes
  const composedGestures = Gesture.Simultaneous(panGesture, tapGesture);

  // Styles animés pour le swipe
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

  if (isLoadingApplications) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4717F6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const currentApplication = pendingApplications[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header moderne - conditionné par hideHeader */}
      {!hideHeader && (
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={["#4717F6", "#6366f1"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={onBack}
                style={styles.backButton}
                activeOpacity={0.8}
                delayPressIn={0}
              >
                <ArrowLeft size={20} color="white" />
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <View style={styles.titleSection}>
                  <Text
                    style={styles.jobTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {job?.title}
                  </Text>
                  <Text style={styles.candidateCount}>
                    {currentIndex + 1} candidature(s) /{" "}
                    {pendingApplications.length}
                  </Text>
                </View>
              </View>

              <View style={styles.spacer} />
            </View>
          </LinearGradient>
        </View>
      )}

      {pendingApplications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <User size={40} color="#6B7280" />
          <Text style={styles.emptyTitle}>Aucune candidature</Text>
          <Text style={styles.emptySubtitle}>
            Aucune candidature en attente pour ce poste.
          </Text>
        </View>
      ) : currentIndex >= pendingApplications.length ? (
        <View style={styles.emptyContainer}>
          <Check size={40} color="#36E9CD" />
          <Text style={styles.emptyTitle}>
            Toutes les candidatures traitées !
          </Text>
          <Text style={styles.emptySubtitle}>
            Bravo ! Vous avez évalué toutes les candidatures pour ce poste.
          </Text>
        </View>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* Indicateur de progression discret */}
          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>
              Candidature {currentIndex + 1} / {pendingApplications?.length}{" "}
            </Text>
          </View>
          <View style={styles.cardContainer}>
            {/* Carte active uniquement */}
            <GestureDetector gesture={composedGestures}>
              <ReanimatedAnimated.View
                style={[
                  styles.candidateCard,
                  animatedCardStyle,
                  styles.activeCard,
                ]}
              >
                {/* Header candidat - avec geste de swipe */}
                <View style={styles.candidateHeaderFull}>
                  <LinearGradient
                    colors={["#4717F6", "#6366f1"]}
                    style={styles.candidateHeaderFullGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.headerMainRow}>
                      <Text style={styles.candidateNameFull}>
                        {currentApplication.candidate.user.first_name}{" "}
                        {currentApplication.candidate.user.last_name}
                      </Text>
                      <View style={styles.candidateDateBadge}>
                        <Calendar size={12} color="#4717F6" />
                        <Text style={styles.candidateDateText}>
                          {new Date(
                            currentApplication.created_at
                          ).toLocaleDateString("fr-FR")}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>

                <LinearGradient
                  colors={["#8464F9", "#F2F2F2"]}
                  style={styles.cardGradientBody}
                  start={{ x: 0, y: -3 }}
                  end={{ x: 0, y: 0.9 }}
                >
                  {/* Informations principales - Email seulement */}
                  <View style={styles.infoSectionCard}>
                    <View style={styles.emailOnlyContainer}>
                      <View style={styles.emailInfoCard}>
                        <Mail
                          size={16}
                          color="#4717F6"
                          style={{ marginRight: 10 }}
                        />
                        <View style={styles.infoCardContent}>
                          <Text style={styles.infoCardLabel}>Email</Text>
                          <Text style={styles.infoCardValue} numberOfLines={2}>
                            {currentApplication.candidate.user.email}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Compétences */}
                  {currentApplication.candidate.skills &&
                    currentApplication.candidate.skills.length > 0 && (
                      <View style={styles.skillsSection}>
                        <Text style={styles.sectionTitle}>Compétences</Text>
                        <View style={styles.skillsContainer}>
                          {currentApplication.candidate.skills
                            .filter((skill) =>
                              (currentApplication.job_post?.skills ?? []).some(
                                (jobSkill) => jobSkill.id === skill.id
                              )
                            )
                            .slice(0, 2)
                            .map((skill) => (
                              <View
                                key={skill.id}
                                style={styles.skillBadgeMatched}
                              >
                                <Text style={styles.skillTextMatched}>
                                  {skill.name}
                                </Text>
                              </View>
                            ))}
                          {currentApplication.candidate.skills
                            .filter(
                              (skill) =>
                                !(
                                  currentApplication.job_post?.skills ?? []
                                ).some((jobSkill) => jobSkill.id === skill.id)
                            )
                            .slice(0, 1)
                            .map((skill) => (
                              <View key={skill.id} style={styles.skillBadge}>
                                <Text style={styles.skillText}>
                                  {skill.name}
                                </Text>
                              </View>
                            ))}
                          {currentApplication.candidate.skills.length > 3 && (
                            <View style={styles.skillBadgeExtra}>
                              <Text style={styles.skillTextExtra}>
                                +
                                {currentApplication.candidate.skills.length - 3}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.legend}>
                          <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                              <View style={styles.legendPillGreen} />
                              <Text style={styles.legendText}>
                                correspond à l'offre
                              </Text>
                            </View>
                            <View style={styles.legendItem}>
                              <View style={styles.legendPillGray} />
                              <Text style={styles.legendText}>autres</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}

                  {/* Bio */}
                  {currentApplication.candidate.bio && (
                    <View style={styles.bioSection}>
                      <Text style={styles.sectionTitle}>À propos</Text>
                      <Text style={styles.bioText} numberOfLines={2}>
                        {currentApplication.candidate.bio}
                      </Text>
                    </View>
                  )}

                  {/* Zone bouton */}
                  <View style={styles.actionsSection}>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.seeProfileButton}
                        onPress={() => {
                          handleOpenModal(currentApplication);
                        }}
                        onPressIn={() => {
                          isSwipeDisabled.value = true;
                        }}
                        onPressOut={() => {
                          setTimeout(() => {
                            isSwipeDisabled.value = false;
                          }, 100);
                        }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      >
                        <LinearGradient
                          colors={["#36E9CD", "#36E9CD"]}
                          style={styles.seeProfileGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Text style={styles.seeProfileText}>Voir plus</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>

                {/* Overlays pour le swipe */}
                <ReanimatedAnimated.View
                  style={[styles.leftOverlay, leftOverlayStyle]}
                >
                  <View style={styles.overlayContent}>
                    <X size={adaptiveStyles.iconSize + 16} color="#ffffff" />
                    <Text style={styles.overlayTextRed}>PASSER</Text>
                  </View>
                </ReanimatedAnimated.View>

                <ReanimatedAnimated.View
                  style={[styles.rightOverlay, rightOverlayStyle]}
                >
                  <View style={styles.overlayContent}>
                    <Check
                      size={adaptiveStyles.iconSize + 16}
                      color="#ffffff"
                    />
                    <Text style={styles.overlayTextGreen}>MATCH</Text>
                  </View>
                </ReanimatedAnimated.View>
              </ReanimatedAnimated.View>
            </GestureDetector>
          </View>

          {/* Boutons d'action externes */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => {
                handlePass(currentApplication);
              }}
              style={styles.actionButtonRed}
              activeOpacity={0.8}
              delayPressIn={0}
            >
              <X size={adaptiveStyles.iconSize} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleMatch(currentApplication);
              }}
              style={styles.actionButtonGreen}
              activeOpacity={0.8}
              delayPressIn={0}
            >
              <Check size={adaptiveStyles.iconSize} color="white" />
            </TouchableOpacity>
          </View>

          {/* Légende explicative - adaptative selon la taille d'écran */}
          {adaptiveStyles.showLegend && (
            <View
              style={[
                styles.legendContainer,
                { paddingBottom: adaptiveStyles.legendPadding },
              ]}
            >
              <Text style={styles.legendButtonText}>
                Swipez ou utilisez les boutons pour évaluer les candidatures
              </Text>
            </View>
          )}
        </GestureHandlerRootView>
      )}

      {/* Bottom Sheet */}
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
              <View style={styles.modalHandle} {...panResponder.panHandlers}>
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
                        {selectedApplication?.candidate.user.first_name}{" "}
                        {selectedApplication?.candidate.user.last_name}
                      </Text>
                      <View style={styles.modalCompanyRow}>
                        <User size={20} color="rgba(255, 255, 255, 0.9)" />
                        <Text style={styles.modalCompany}>Profil candidat</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>

                {/* Informations détaillées */}
                <View style={styles.modalInfoSection}>
                  <View style={styles.modalInfoCard}>
                    <MapPin size={20} color="#4717F6" />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Localisation</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedApplication?.candidate.location ||
                          "Non renseigné"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoCard}>
                    <Briefcase size={20} color="#4717F6" />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Expérience</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedApplication?.candidate.experience_year
                          ? `${selectedApplication.candidate.experience_year} ans`
                          : "Non renseigné"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoCard}>
                    <Mail size={20} color="#4717F6" />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Email</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedApplication?.candidate.user.email}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoCard}>
                    <Calendar size={20} color="#4717F6" />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>
                        Date de candidature
                      </Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedApplication?.created_at
                          ? new Date(
                              selectedApplication.created_at
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Non renseigné"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bio complète */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>À propos</Text>
                  <View style={styles.modalDescriptionContainer}>
                    <Text style={styles.modalDescription}>
                      {selectedApplication?.candidate.bio ||
                        "Aucune biographie fournie."}
                    </Text>
                  </View>
                </View>

                {/* Compétences complètes */}
                {selectedApplication?.candidate.skills &&
                  selectedApplication.candidate.skills.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Compétences</Text>
                      <View style={styles.modalSkillsContainer}>
                        {selectedApplication.candidate.skills
                          .filter((skill) =>
                            (selectedApplication.job_post?.skills ?? []).some(
                              (jobSkill) => jobSkill.id === skill.id
                            )
                          )
                          .map((skill) => (
                            <View key={skill.id} style={styles.modalSkillBadge}>
                              <Text style={styles.modalSkillText}>
                                {skill.name}
                              </Text>
                            </View>
                          ))}
                        {selectedApplication.candidate.skills
                          .filter(
                            (skill) =>
                              !(
                                selectedApplication.job_post?.skills ?? []
                              ).some((jobSkill) => jobSkill.id === skill.id)
                          )
                          .map((skill) => (
                            <View key={skill.id} style={styles.modalCertBadge}>
                              <Text style={styles.modalCertText}>
                                {skill.name}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </View>
                  )}

                {/* Certifications */}
                {selectedApplication?.candidate.certifications &&
                  selectedApplication?.candidate.certifications.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>
                        Certifications
                      </Text>
                      <View style={styles.modalSkillsContainer}>
                        {selectedApplication.candidate.certifications.map(
                          (cert) => (
                            <View key={cert.id} style={styles.modalCertBadge}>
                              <Text style={styles.modalCertText}>
                                {cert.name}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  )}

                {/* Boutons d'action */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalActionGreen}
                    onPress={() => {
                      if (selectedApplication) {
                        handleMatch(selectedApplication);
                        handleCloseModal();
                      }
                    }}
                  >
                    <LinearGradient
                      colors={["#36E9CD", "#36E9CD"]}
                      style={styles.modalActionGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Check size={18} color="white" />
                      <Text style={styles.modalActionText}>Match</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalActionRed}
                    onPress={() => {
                      if (selectedApplication) {
                        handlePass(selectedApplication);
                        handleCloseModal();
                      }
                    }}
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
    </View>
  );
}

const adaptive = getAdaptiveStyles();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#6B7280",
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  headerGradient: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    minHeight: 80,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  titleSection: {
    alignItems: "center",
    maxWidth: "100%",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
    maxWidth: 220,
  },
  spacer: {
    width: 40,
  },
  candidateCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  progressIndicator: {
    alignItems: "center",
    paddingVertical: adaptive.progressPadding,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    fontStyle: "italic",
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: adaptive.cardMargin,
    marginVertical: adaptive.cardMargin,
  },
  candidateCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 1,
    borderColor: "#4717F6",
    shadowColor: "#4717F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  // Nouveaux styles pour header pleine largeur
  candidateHeaderFull: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  candidateHeaderFullGradient: {
    alignItems: "center",
    padding: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  candidateNameFull: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  candidateInfoFull: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  candidateRoleFull: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  cardGradientBody: {
    flex: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: adaptive.cardPadding,
  },

  infoSectionCard: {
    marginBottom: adaptive.sectionMargin,
  },

  infoCardContainer: {
    gap: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#4717F6",
  },
  infoCardContent: {
    flex: 1,
    minWidth: 0, // Permet au contenu de se rétrécir si nécessaire
  },
  infoCardLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  infoCardValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "700",
    lineHeight: 16,
  },
  skillsSection: {
    marginBottom: adaptive.sectionMargin,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadgeMatched: {
    backgroundColor: "#36E9CD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillTextMatched: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  skillBadge: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  skillBadgeExtra: {
    backgroundColor: "#9CA3AF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillTextExtra: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  legend: {
    marginTop: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendPillGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#36E9CD",
  },
  legendPillGray: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6B7280",
  },
  legendText: {
    fontSize: 11,
    color: "#6B7280",
    fontStyle: "italic",
  },
  bioSection: {
    marginBottom: adaptive.sectionMargin,
  },
  bioText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  actionsSection: {
    gap: 12,
    flex: 1,
    justifyContent: "center",
  },
  swipeZoneTop: {
    height: 20,
    backgroundColor: "transparent",
  },
  swipeZoneBottom: {
    height: 20,
    backgroundColor: "transparent",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  swipeZoneLeft: {
    flex: 1,
    height: 60,
    backgroundColor: "transparent",
  },
  swipeZoneRight: {
    flex: 1,
    height: 60,
    backgroundColor: "transparent",
  },
  seeProfileButton: {
    alignSelf: "center",
    zIndex: 1000,
  },
  seeProfileGradient: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  seeProfileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: adaptive.buttonSpacing,
    paddingBottom: adaptive.progressPadding,
  },
  actionButtonRed: {
    width: adaptive.buttonSize,
    height: adaptive.buttonSize,
    borderRadius: adaptive.buttonSize / 2,
    backgroundColor: "#FF2056",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonGreen: {
    width: adaptive.buttonSize,
    height: adaptive.buttonSize,
    borderRadius: adaptive.buttonSize / 2,
    backgroundColor: "#36E9CD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  legendContainer: {
    paddingHorizontal: adaptive.cardMargin + 8,
    paddingBottom: adaptive.legendPadding,
  },
  legendButtonText: {
    fontSize: adaptive.iconSize < 22 ? 12 : 14,
    fontStyle: "italic",
    textAlign: "center",
    color: "#6B7280",
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    backgroundColor: "#36E9CD",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#36E9CD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  // Styles pour les overlays de swipe
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  overlayTextRed: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },
  overlayTextGreen: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },

  // Nouveaux styles pour le header amélioré
  headerMainRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  candidateDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 6,
    marginLeft: 8,
  },
  candidateDateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4717F6",
  },

  // Nouveaux styles pour l'email simplifié
  emailOnlyContainer: {
    alignItems: "center",
  },
  emailInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4717F6",
    width: "100%",
    maxWidth: 350,
  },
});
