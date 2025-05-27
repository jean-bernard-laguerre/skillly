import React, { useState, useMemo, useRef, useCallback } from "react";
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

  const job = useMemo(
    () => companyJobPosts?.find((job) => job.id === jobId),
    [companyJobPosts, jobId]
  );

  const pendingApplications = useMemo(() => {
    return job?.applications?.filter((app) => app.state === "pending") || [];
  }, [job]);

  React.useEffect(() => {
    setIsAllSwiped(pendingApplications.length === 0 && !isLoadingJobPosts);
  }, [pendingApplications, isLoadingJobPosts]);

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

  const renderCard = useCallback((application: Application) => {
    return <ApplicationCard application={application} />;
  }, []);

  const OverlayLabelLeft = useCallback(
    () => (
      <View className="items-center justify-center flex-1 border-4 border-red-500 bg-red-500/20 rounded-xl">
        <View className="p-4 bg-red-500 rounded-full">
          <X size={40} color="white" />
        </View>
        <Text className="mt-2 text-xl font-bold text-red-500">PASSER</Text>
      </View>
    ),
    []
  );

  const OverlayLabelRight = useCallback(
    () => (
      <View className="items-center justify-center flex-1 border-4 border-green-500 bg-green-500/20 rounded-xl">
        <View className="p-4 bg-green-500 rounded-full">
          <Check size={40} color="white" />
        </View>
        <Text className="mt-2 text-xl font-bold text-green-500">MATCH</Text>
      </View>
    ),
    []
  );

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
                ref={ref}
                cardStyle={{
                  width: "90%",
                  height: "75%",
                }}
                data={pendingApplications}
                renderCard={renderCard}
                onIndexChange={(index) => {
                  setIndex(index);
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

            <View className="absolute bottom-0 left-0 right-0 z-50">
              <View className="flex-row items-center w-full p-4 justify-evenly">
                <Pressable
                  onPress={() => {
                    handleSwipe("left", index);
                    ref.current?.swipeLeft();
                  }}
                >
                  <X size={28} color="red" />
                </Pressable>
                <Text className="text-gray-600">
                  Swipez les cartes pour les classer
                </Text>
                <Pressable
                  onPress={() => {
                    handleSwipe("right", index);
                    ref.current?.swipeRight();
                  }}
                >
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
