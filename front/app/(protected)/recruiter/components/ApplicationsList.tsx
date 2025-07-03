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
  Award,
  Check,
  X,
} from "lucide-react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Application } from "@/types/interfaces";
import { useMatch } from "@/lib/hooks/useMatch";
import Toast from "react-native-toast-message";
import { Portal } from "react-native-portalize";

const { height: screenHeight } = Dimensions.get("window");

interface ApplicationsListProps {
  jobId: string;
  onBack: () => void;
}

export default function ApplicationsList({
  jobId,
  onBack,
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

  // Valeurs pour le swipe
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const job = companyJobPosts?.find((job) => job.id === jobId);
  const pendingApplications =
    job?.applications?.filter((app) => app.state === "pending") || [];

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
  };

  const handlePass = (application: Application) => {
    // Logique pour passer/rejeter une candidature
    console.log("Candidature passée:", application.id);
  };

  // Créer les gestes pour le swipe
  const createSwipeGesture = (application: Application) => {
    return Gesture.Pan()
      .onStart(() => {
        scale.value = withSpring(0.95);
      })
      .onUpdate((event) => {
        translateX.value = event.translationX;
      })
      .onEnd((event) => {
        scale.value = withSpring(1);

        if (Math.abs(event.translationX) > 100) {
          // Swipe détecté
          const direction = event.translationX > 0 ? "right" : "left";

          if (direction === "right") {
            runOnJS(handleMatch)(application);
          } else {
            runOnJS(handlePass)(application);
          }

          // Animation de sortie
          translateX.value = withSpring(event.translationX > 0 ? 400 : -400);
          opacity.value = withSpring(0);

          setTimeout(() => {
            translateX.value = 0;
            opacity.value = 1;
          }, 300);
        } else {
          // Retour à la position initiale
          translateX.value = withSpring(0);
        }
      });
  };

  // Styles animés pour le swipe
  const createAnimatedStyle = () => {
    return useAnimatedStyle(() => {
      const rotation = interpolate(
        translateX.value,
        [-200, 0, 200],
        [-5, 0, 5],
        Extrapolation.CLAMP
      );

      return {
        transform: [
          { translateX: translateX.value },
          { scale: scale.value },
          { rotate: `${rotation}deg` },
        ],
        opacity: opacity.value,
      };
    });
  };

  if (isLoadingApplications) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4717F6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header moderne */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#4717F6", "#6366f1"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={20} color="white" />
              <Text style={styles.backText}>Retour</Text>
            </TouchableOpacity>
            <View style={styles.titleSection}>
              <Text style={styles.jobTitle}>{job?.title}</Text>
              <Text style={styles.candidateCount}>
                {currentIndex + 1} candidature(s) / {pendingApplications.length}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {pendingApplications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <User size={40} color="#6B7280" />
          <Text style={styles.emptyTitle}>Aucune candidature</Text>
          <Text style={styles.emptySubtitle}>
            Aucune candidature en attente pour ce poste.
          </Text>
        </View>
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {pendingApplications.map((application, index) => (
              <GestureDetector
                key={application.id}
                gesture={createSwipeGesture(application)}
              >
                <ReanimatedAnimated.View
                  style={[
                    styles.candidateCard,
                    createAnimatedStyle(),
                    index === currentIndex && styles.activeCard,
                  ]}
                >
                  <LinearGradient
                    colors={["#8464F9", "#F2F2F2"]}
                    style={styles.cardGradient}
                    start={{ x: 0, y: -3 }}
                    end={{ x: 0, y: 0.9 }}
                  >
                    {/* Header candidat compact */}
                    <View style={styles.candidateHeader}>
                      <LinearGradient
                        colors={["#4717F6", "#6366f1"]}
                        style={styles.candidateHeaderGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.candidateName}>
                          {application.candidate.user.first_name}{" "}
                          {application.candidate.user.last_name}
                        </Text>
                        <View style={styles.candidateInfo}>
                          <User size={14} color="rgba(255, 255, 255, 0.9)" />
                          <Text style={styles.candidateRole}>Candidat</Text>
                        </View>
                      </LinearGradient>
                    </View>

                    {/* Informations en scroll horizontal */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.infoScrollView}
                      contentContainerStyle={styles.infoScrollContent}
                    >
                      <View style={styles.infoCard}>
                        <Mail size={16} color="#4717F6" />
                        <View style={styles.infoCardContent}>
                          <Text style={styles.infoCardLabel}>Email</Text>
                          <Text style={styles.infoCardValue} numberOfLines={1}>
                            {application.candidate.user.email}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoCard}>
                        <Calendar size={16} color="#4717F6" />
                        <View style={styles.infoCardContent}>
                          <Text style={styles.infoCardLabel}>Postulé le</Text>
                          <Text style={styles.infoCardValue}>
                            {new Date(
                              application.created_at
                            ).toLocaleDateString("fr-FR")}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.infoCard}>
                        <MapPin size={16} color="#4717F6" />
                        <View style={styles.infoCardContent}>
                          <Text style={styles.infoCardLabel}>Localisation</Text>
                          <Text style={styles.infoCardValue}>
                            {application.candidate.location || "Non renseigné"}
                          </Text>
                        </View>
                      </View>

                      {application.candidate.experience_year && (
                        <View style={styles.infoCard}>
                          <Briefcase size={16} color="#4717F6" />
                          <View style={styles.infoCardContent}>
                            <Text style={styles.infoCardLabel}>Expérience</Text>
                            <Text style={styles.infoCardValue}>
                              {application.candidate.experience_year} ans
                            </Text>
                          </View>
                        </View>
                      )}
                    </ScrollView>

                    {/* Compétences compactes */}
                    {application.candidate.skills &&
                      application.candidate.skills.length > 0 && (
                        <View style={styles.skillsSection}>
                          <Text style={styles.sectionTitle}>Compétences</Text>
                          <View style={styles.skillsContainer}>
                            {application.candidate.skills
                              .filter((skill) =>
                                (application.job_post?.skills ?? []).some(
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
                            {application.candidate.skills
                              .filter(
                                (skill) =>
                                  !(application.job_post?.skills ?? []).some(
                                    (jobSkill) => jobSkill.id === skill.id
                                  )
                              )
                              .slice(0, 1)
                              .map((skill) => (
                                <View key={skill.id} style={styles.skillBadge}>
                                  <Text style={styles.skillText}>
                                    {skill.name}
                                  </Text>
                                </View>
                              ))}
                            {application.candidate.skills.length > 3 && (
                              <View style={styles.skillBadgeExtra}>
                                <Text style={styles.skillTextExtra}>
                                  +{application.candidate.skills.length - 3}
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

                    {/* Bio courte */}
                    {application.candidate.bio && (
                      <View style={styles.bioSection}>
                        <Text style={styles.sectionTitle}>À propos</Text>
                        <Text style={styles.bioText} numberOfLines={2}>
                          {application.candidate.bio}
                        </Text>
                      </View>
                    )}

                    {/* Action voir plus uniquement */}
                    <View style={styles.actionsSection}>
                      <TouchableOpacity
                        style={styles.seeProfileButton}
                        onPress={() => handleOpenModal(application)}
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
                  </LinearGradient>

                  {/* Overlays pour le swipe */}
                  <ReanimatedAnimated.View
                    style={[
                      styles.leftOverlay,
                      useAnimatedStyle(() => ({
                        opacity: interpolate(
                          translateX.value,
                          [-150, -50, 0],
                          [1, 0.5, 0],
                          Extrapolation.CLAMP
                        ),
                      })),
                    ]}
                  >
                    <View style={styles.overlayContent}>
                      <X size={40} color="#ffffff" />
                      <Text style={styles.overlayTextRed}>PASSER</Text>
                    </View>
                  </ReanimatedAnimated.View>

                  <ReanimatedAnimated.View
                    style={[
                      styles.rightOverlay,
                      useAnimatedStyle(() => ({
                        opacity: interpolate(
                          translateX.value,
                          [0, 50, 150],
                          [0, 0.5, 1],
                          Extrapolation.CLAMP
                        ),
                      })),
                    ]}
                  >
                    <View style={styles.overlayContent}>
                      <Check size={40} color="#ffffff" />
                      <Text style={styles.overlayTextGreen}>MATCH</Text>
                    </View>
                  </ReanimatedAnimated.View>
                </ReanimatedAnimated.View>
              </GestureDetector>
            ))}
          </ScrollView>

          {/* Boutons d'action externes */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => {
                const currentApp = pendingApplications[currentIndex];
                if (currentApp) {
                  handlePass(currentApp);
                  if (currentIndex < pendingApplications.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  }
                }
              }}
              style={styles.actionButtonRed}
            >
              <X size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const currentApp = pendingApplications[currentIndex];
                if (currentApp) {
                  handleMatch(currentApp);
                  if (currentIndex < pendingApplications.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  }
                }
              }}
              style={styles.actionButtonGreen}
            >
              <Check size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Légende explicative */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendButtonText}>
              Swipez ou utilisez les boutons pour évaluer les candidatures
            </Text>
          </View>
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
                    onPress={handleCloseModal}
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
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  titleSection: {
    flex: 1,
    alignItems: "center",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  candidateCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  candidateCard: {
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
  cardGradient: {
    borderRadius: 12,
    padding: 20,
  },
  candidateHeader: {
    marginBottom: 18,
    borderRadius: 8,
    overflow: "hidden",
  },
  candidateHeaderGradient: {
    alignItems: "center",
    padding: 10,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 3,
  },
  candidateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  candidateRole: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  infoScrollView: {
    marginBottom: 18,
  },
  infoScrollContent: {
    paddingHorizontal: 4,
    gap: 10,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(71, 23, 246, 0.05)",
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#4717F6",
    minWidth: 120,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
  },
  infoCardValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "700",
  },
  skillsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillBadgeMatched: {
    backgroundColor: "#36E9CD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  skillTextMatched: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  skillBadge: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  skillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  skillBadgeExtra: {
    backgroundColor: "#9CA3AF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  skillTextExtra: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  legend: {
    marginTop: 6,
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
    fontSize: 10,
    color: "#6B7280",
    fontStyle: "italic",
  },
  bioSection: {
    marginBottom: 16,
  },
  bioText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  actionsSection: {
    gap: 12,
  },
  seeProfileButton: {
    alignSelf: "center",
  },
  seeProfileGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  seeProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    paddingBottom: 16,
  },
  actionButtonRed: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FF2056",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGreen: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#36E9CD",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  legendContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  legendButtonText: {
    fontSize: 14,
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
});
