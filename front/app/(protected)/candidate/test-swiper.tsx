import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
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

const { height: screenHeight } = Dimensions.get("window");

// Test avec des données statiques d'abord
const STATIC_TEST_DATA: any[] = [
  {
    id: "1",
    title: "Développeur React Native",
    company: { company_name: "Tech Corp" },
    location: "Paris",
    contract_type: "CDI",
    salary_range: "45-55k€",
    skills: [
      { id: "1", name: "React Native" },
      { id: "2", name: "TypeScript" },
    ],
    description:
      "Poste de développeur React Native dans une startup innovante.",
  },
  {
    id: "2",
    title: "Développeur Full Stack",
    company: { company_name: "Web Solutions" },
    location: "Lyon",
    contract_type: "CDI",
    salary_range: "50-60k€",
    skills: [
      { id: "3", name: "React" },
      { id: "4", name: "Node.js" },
    ],
    description: "Développement d'applications web modernes.",
  },
  {
    id: "3",
    title: "Développeur Mobile",
    company: { company_name: "Mobile First" },
    location: "Marseille",
    contract_type: "CDI",
    salary_range: "40-50k€",
    skills: [
      { id: "5", name: "Flutter" },
      { id: "6", name: "Dart" },
    ],
    description: "Création d'applications mobiles cross-platform.",
  },
];

export default function TestSwiper() {
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const { applications, isLoadingApplications, createApplication } =
    useApplication();
  const ref = useRef<SwiperCardRefType>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [useStaticData, setUseStaticData] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  console.log("TestSwiper render - useStaticData:", useStaticData);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5 && gestureState.dy > 0;
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

  const availableJobs = React.useMemo(() => {
    if (useStaticData) {
      console.log("Using static data:", STATIC_TEST_DATA.length, "jobs");
      return STATIC_TEST_DATA;
    }

    if (!candidateJobPosts || !applications) return [];
    const appliedJobIds = applications.map((app) => app.job_post_id);
    const filtered = candidateJobPosts.filter(
      (job) => !appliedJobIds.includes(job.id)
    );
    console.log("Using real data:", filtered.length, "jobs");
    return filtered;
  }, [candidateJobPosts, applications, useStaticData]);

  React.useEffect(() => {
    console.log("TestSwiper - availableJobs changed:", {
      length: availableJobs.length,
      useStaticData: useStaticData,
      jobs: availableJobs.map((job) => ({ id: job.id, title: job.title })),
    });
  }, [availableJobs, useStaticData]);

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

  const handleOpenModal = useCallback((job: any) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  }, []);

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
  };

  const renderCard = useCallback(
    (job: any) => {
      console.log("Test renderCard called for:", job.title);
      return (
        <View style={styles.renderCardContainer}>
          <View style={styles.cardContent}>
            <View style={styles.mainContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{job.title}</Text>
                <View style={styles.companyRow}>
                  <Building2 size={16} color="#374151" />
                  <Text style={styles.cardCompany}>
                    {job.company?.company_name || "Entreprise inconnue"}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={18} color="#374151" />
                  <Text style={styles.detailText}>{job.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Briefcase size={18} color="#374151" />
                  <Text style={styles.detailText}>{job.contract_type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <DollarSign size={18} color="#22c55e" />
                  <Text style={styles.cardSalary}>{job.salary_range}</Text>
                </View>
              </View>

              {job.skills && job.skills.length > 0 && (
                <View style={styles.skillsContainer}>
                  <Text style={styles.skillsTitle}>Compétences requises :</Text>
                  <View style={styles.skillsWrapper}>
                    {job.skills.slice(0, 3).map((skill) => (
                      <View key={skill.id} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill.name}</Text>
                      </View>
                    ))}
                    {job.skills.length > 3 && (
                      <View style={styles.skillTag}>
                        <Text style={styles.skillText}>
                          +{job.skills.length - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {job.description && (
                <Text
                  style={styles.description}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {job.description}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => handleOpenModal(job)}
            >
              <Text style={styles.seeMoreText}>Voir plus</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleOpenModal]
  );

  const OverlayLabelRight = useCallback(() => {
    return (
      <View style={[styles.overlayContainer, styles.overlayRight]}>
        <Heart size={40} color="#22c55e" />
        <Text style={styles.overlayText}>LIKE</Text>
      </View>
    );
  }, []);

  const OverlayLabelLeft = useCallback(() => {
    return (
      <View style={[styles.overlayContainer, styles.overlayLeft]}>
        <X size={40} color="#ef4444" />
        <Text style={styles.overlayTextRed}>PASS</Text>
      </View>
    );
  }, []);

  const handleSwipe = (direction: string, cardIndex: number) => {
    console.log("Test handleSwipe:", {
      direction,
      cardIndex,
      availableJobsLength: availableJobs.length,
    });

    if (cardIndex >= availableJobs.length) return;
    const job = availableJobs[cardIndex];
    if (!job) return;

    if (direction === "right") {
      const score = 90;
      try {
        createApplication(
          { jobOfferId: job.id, score },
          {
            onSuccess: () => {
              Toast.show({
                type: "success",
                text1: "Candidature envoyée ! 🎉",
                text2: `Votre candidature pour ${job.title} a été envoyée avec succès`,
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
        console.error("Error creating application:", error);
      }
    }
  };

  const handleIndexChange = (index: number) => {
    console.log("Test index changed to:", index);
    setCurrentIndex(index);
  };

  if (isLoadingCandidateJobPosts || isLoadingApplications) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des offres...</Text>
      </View>
    );
  }

  if (availableJobs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Aucune offre disponible</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Test Complet - {currentIndex + 1} / {availableJobs.length}
        </Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            console.log(
              "Toggling data source from",
              useStaticData,
              "to",
              !useStaticData
            );
            setUseStaticData(!useStaticData);
            setCurrentIndex(0);
          }}
        >
          <Text style={styles.toggleButtonText}>
            {useStaticData
              ? "Utiliser données réelles"
              : "Utiliser données statiques"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subContainer}>
        <Swiper
          key={`swiper-${useStaticData ? "static" : "real"}-${
            availableJobs.length
          }`}
          ref={ref}
          cardStyle={styles.cardStyle}
          data={availableJobs}
          renderCard={renderCard}
          onIndexChange={(index) => {
            console.log(
              "Test onIndexChange:",
              index,
              "total jobs:",
              availableJobs.length
            );
            handleIndexChange(index);
          }}
          onSwipeRight={(cardIndex) => {
            console.log("Test onSwipeRight:", cardIndex);
            handleSwipe("right", cardIndex);
          }}
          onSwipeLeft={(cardIndex) => {
            console.log("Test onSwipeLeft:", cardIndex);
            handleSwipe("left", cardIndex);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => ref.current?.swipeLeft()}
        >
          <X size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { height: 60, marginHorizontal: 10 }]}
          onPress={() => ref.current?.swipeBack()}
        >
          <RotateCcw size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => ref.current?.swipeRight()}
        >
          <Heart size={32} color="white" />
        </TouchableOpacity>
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
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.sheetDragArea} {...panResponder.panHandlers}>
              <View style={styles.sheetHandle} />
            </View>
            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* En-tête */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetTitleRow}>
                  <Building2 size={24} color="#374151" />
                  <Text style={styles.sheetTitle}>{selectedJob?.title}</Text>
                </View>
                <Text style={styles.sheetCompany}>
                  {selectedJob?.company?.company_name || "Entreprise inconnue"}
                </Text>
              </View>

              {/* Informations principales */}
              <View style={styles.sheetInfoSection}>
                <View style={styles.sheetInfoRow}>
                  <View style={styles.sheetInfoIcon}>
                    <MapPin size={20} color="#374151" />
                    <Text style={styles.sheetInfoLabel}>Localisation</Text>
                  </View>
                  <Text style={styles.sheetInfoText}>
                    {selectedJob?.location || "Non renseigné"}
                  </Text>
                </View>

                <View style={styles.sheetInfoRow}>
                  <View style={styles.sheetInfoIcon}>
                    <Briefcase size={20} color="#374151" />
                    <Text style={styles.sheetInfoLabel}>Contrat</Text>
                  </View>
                  <Text style={styles.sheetInfoText}>
                    {selectedJob?.contract_type || "Non renseigné"}
                  </Text>
                </View>

                <View style={styles.sheetInfoRow}>
                  <View style={styles.sheetInfoIcon}>
                    <DollarSign size={20} color="#22c55e" />
                    <Text style={styles.sheetInfoLabel}>Salaire</Text>
                  </View>
                  <Text
                    style={[
                      styles.sheetInfoText,
                      { color: "#22c55e", fontWeight: "bold" },
                    ]}
                  >
                    {selectedJob?.salary_range || "Non renseigné"}
                  </Text>
                </View>
              </View>

              {/* Description complète */}
              <View style={styles.sheetSection}>
                <Text style={styles.sheetSectionTitle}>
                  Description du poste
                </Text>
                <Text style={styles.sheetDescription}>
                  {selectedJob?.description || "Aucune description fournie."}
                </Text>
              </View>

              {/* Compétences */}
              {selectedJob?.skills && selectedJob.skills.length > 0 && (
                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionTitle}>
                    Compétences requises
                  </Text>
                  <View style={styles.sheetSkillsWrapper}>
                    {selectedJob.skills.map((skill) => (
                      <View key={skill.id} style={styles.sheetSkillTag}>
                        <Text style={styles.sheetSkillText}>{skill.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Boutons d'action */}
              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={styles.sheetActionButton}
                  onPress={() => handleModalAction("right")}
                >
                  <Text style={styles.sheetActionText}>Postuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetRejectButton}
                  onPress={() => handleModalAction("left")}
                >
                  <Text style={styles.sheetRejectText}>Passer</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.sheetCloseButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.sheetCloseText}>Fermer</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  toggleButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardStyle: {
    width: "90%",
    height: "80%",
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    borderRadius: 15,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    padding: 24,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContent: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeader: {
    width: "100%",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  cardCompany: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDetails: {
    width: "100%",
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#6b7280",
    marginLeft: 5,
  },
  cardSalary: {
    fontSize: 18,
    color: "#22c55e",
    fontWeight: "bold",
    marginLeft: 5,
  },
  skillsContainer: {
    marginTop: 10,
    width: "100%",
  },
  skillsTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "left",
  },
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 5,
  },
  skillTag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  skillText: {
    color: "#1e40af",
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    marginTop: 10,
    color: "#6b7280",
    textAlign: "left",
    fontStyle: "italic",
    fontSize: 14,
    width: "100%",
  },
  seeMoreButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  seeMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 4,
  },
  overlayRight: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "#22c55e",
  },
  overlayLeft: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#ef4444",
  },
  overlayText: {
    color: "#22c55e",
    fontWeight: "bold",
    marginTop: 8,
  },
  overlayTextRed: {
    color: "#ef4444",
    fontWeight: "bold",
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    bottom: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    aspectRatio: 1,
    backgroundColor: "#3A3D45",
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheet: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.5,
    alignSelf: "flex-end",
  },
  sheetDragArea: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    alignSelf: "center",
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  sheetHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  sheetCompany: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  sheetInfoSection: {
    marginBottom: 24,
  },
  sheetInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetInfoIcon: {
    alignItems: "center",
    width: 96,
  },
  sheetInfoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 4,
  },
  sheetInfoText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  sheetSection: {
    marginBottom: 24,
  },
  sheetSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  sheetDescription: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  sheetSkillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sheetSkillTag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sheetSkillText: {
    color: "#1e40af",
    fontSize: 14,
    fontWeight: "500",
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sheetActionButton: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  sheetRejectButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  sheetActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sheetRejectText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sheetCloseButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  sheetCloseText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});
