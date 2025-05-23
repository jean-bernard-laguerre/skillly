import React, { useState, useMemo, useRef } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import { Check, X, User, ArrowLeft } from "lucide-react-native";
import { Application } from "@/types/interfaces";
import { useApplication } from "@/lib/hooks/useApplication";
import { useMatch } from "@/lib/hooks/useMatch";
import Toast from "react-native-toast-message";

interface ApplicationsListProps {
  jobId: string;
  onBack: () => void;
}

const ApplicationCard = ({ application }: { application: Application }) => {
  return (
    <View className="flex-[0.9] rounded-lg shadow-lg justify-center items-center bg-white p-4">
      <View className="w-full">
        <View className="flex-row items-center gap-2 mb-4">
          <User size={24} color="#6366f1" className="mr-2" />
          <Text className="text-xl font-semibold">
            {application.candidate.user.first_name}{" "}
            {application.candidate.user.last_name}
          </Text>
        </View>
        <Text className="text-sm text-gray-500">
          Candidat depuis le{" "}
          {new Date(application.created_at).toLocaleDateString()}
        </Text>
        <View className="flex-row flex-wrap gap-2 mt-4">
          <Text className="text-sm text-gray-500">Compétences:</Text>
          {application.candidate.skills?.map((skill) => (
            <View key={skill.id} className="px-2 py-1 bg-blue-100 rounded">
              <Text className="text-sm text-blue-800">{skill.name}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row flex-wrap gap-2 mt-4">
          <Text className="text-sm text-gray-500">Certifications:</Text>
          {application.candidate.certifications?.map((certification) => (
            <View
              key={certification.id}
              className="px-2 py-1 bg-blue-100 rounded"
            >
              <Text className="text-sm text-blue-800">
                {certification.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const OverlayLabelLeft = () => (
  <View className="items-center justify-center flex-1">
    <X size={50} color="red" />
  </View>
);

const OverlayLabelRight = () => (
  <View className="items-center justify-center flex-1">
    <Check size={50} color="green" />
  </View>
);

export default function ApplicationsList({
  jobId,
  onBack,
}: ApplicationsListProps) {
  const {
    applications: companyJobPosts,
    isLoadingApplications: isLoadingJobPosts,
  } = useJobPost();
  const { updateApplicationState, isUpdatingApplicationState } =
    useApplication();
  const { createMatch, isCreatingMatch } = useMatch();

  const job = useMemo(
    () => companyJobPosts?.find((job) => job.id === jobId),
    [companyJobPosts, jobId]
  );

  const pendingApplications = useMemo(() => {
    return job?.applications?.filter((app) => app.state === "pending") || [];
  }, [job]);

  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const swiperRef = useRef<SwiperCardRefType>(null);

  React.useEffect(() => {
    setIsAllSwiped(pendingApplications.length === 0 && !isLoadingJobPosts);
  }, [pendingApplications, isLoadingJobPosts]);

  const handleSwipe = (direction: "left" | "right", cardIndex: number) => {
    if (cardIndex >= pendingApplications.length) return;

    const application = pendingApplications[cardIndex];
    if (!application) return;

    if (direction === "right") {
      console.log(
        "Swipe Right - Processing Match for Application ID:",
        application.id
      );
      createMatch(
        {
          application_id: parseInt(application.id, 10),
          candidate_id: parseInt(application.candidate.id, 10),
          job_post_id: parseInt(jobId, 10),
        },
        {
          onSuccess: () => {
            console.log(`Match créé pour la candidature ${application.id}`);
            Toast.show({
              type: "success",
              text1: "Match!",
              text2: `Match créé avec ${application.candidate.user.first_name}.`,
            });
          },
          onError: (error) => {
            console.error("Error creating match:", error);
            Toast.show({
              type: "error",
              text1: "Erreur",
              text2: "Impossible de créer le match.",
            });
          },
        }
      );
    } else {
      console.log(
        "Swipe Left - No state change for Application ID:",
        application.id
      );
    }

    // Advance index regardless of success/error for swiper animation
    if (direction === "left") {
      swiperRef.current?.swipeLeft();
    } else if (direction === "right") {
      swiperRef.current?.swipeRight();
    }
  };

  if (isLoadingJobPosts) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text>Chargement des candidatures...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-4">
          <ArrowLeft size={24} color="#6366f1" />
        </Pressable>
        <Text className="text-xl font-semibold">
          {job?.title} (En attente: {pendingApplications.length})
        </Text>
      </View>

      <View className="relative flex-1">
        {!isAllSwiped ? (
          <>
            <View className="flex-1 pt-4">
              <Swiper
                ref={swiperRef}
                data={pendingApplications}
                renderCard={(application: Application, cardIndex: number) => (
                  <ApplicationCard application={application} />
                )}
                onSwipeLeft={(cardIndex: number) =>
                  handleSwipe("left", cardIndex)
                }
                onSwipeRight={(cardIndex: number) =>
                  handleSwipe("right", cardIndex)
                }
                onSwipedAll={() => setIsAllSwiped(true)}
                onIndexChange={(newIndex: number) => {
                  setIndex(newIndex);
                }}
                cardStyle={{
                  width: "90%",
                  height: "75%",
                }}
                disableTopSwipe={true}
                loop={false}
                OverlayLabelLeft={OverlayLabelLeft}
                OverlayLabelRight={OverlayLabelRight}
              />
            </View>

            <View className="absolute bottom-0 left-0 right-0 z-50">
              <View className="flex-row items-center w-full p-4 justify-evenly">
                <Pressable onPress={() => swiperRef.current?.swipeLeft()}>
                  <X size={28} color="red" />
                </Pressable>
                <Text className="text-gray-600">
                  Swipez les cartes pour les classer
                </Text>
                <Pressable onPress={() => swiperRef.current?.swipeRight()}>
                  <Check size={28} color="green" />
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <View className="flex flex-col items-center justify-center w-full h-full">
            <Text className="mb-4 text-lg text-center text-gray-600">
              {job?.applications?.length === 0
                ? "Il n'y a pas encore de candidature pour ce poste."
                : "Plus aucune candidature en attente à traiter."}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
