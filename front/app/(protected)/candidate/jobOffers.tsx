import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Heart, X } from "lucide-react-native";
import { JobPost } from "@/types/interfaces";
import { useJobPost } from "@/lib/hooks/useJobPost";
import { useApplication } from "@/lib/hooks/useApplication";
import Toast from "react-native-toast-message";

const Card = ({ card }: { card: JobPost }) => (
  <View className="flex-[0.9] rounded-lg shadow-lg justify-center items-center bg-white p-4">
    <Text className="mb-2 text-2xl font-bold text-center text-black">
      {card.title}
    </Text>
    <Text className="mb-2 text-lg text-gray-600">{card.location}</Text>
    <Text className="mb-2 text-lg text-gray-600">{card.contract_type}</Text>
    <Text className="mb-4 text-lg text-gray-600">{card.salary_range}</Text>
    <View className="flex-row flex-wrap gap-2">
      {card.skills?.map((skill) => (
        <View key={skill.id} className="px-2 py-1 bg-blue-100 rounded">
          <Text className="text-sm text-blue-800">{skill.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

const OverlayLabel = ({ color }: { color: string }) => {
  if (color === "red") {
    return (
      <View className="flex-1 justify-center items-center absolute z-[1000]">
        <X size={50} color={color} />
      </View>
    );
  } else {
    return (
      <View className="flex-1 justify-center items-center absolute z-[1000]">
        <Heart size={50} color={color} />
      </View>
    );
  }
};

export default function JobOffers() {
  const { candidateJobPosts, isLoadingCandidateJobPosts } = useJobPost();
  const {
    applications,
    isLoadingApplications,
    createApplication,
    isCreatingApplication,
  } = useApplication();
  const swiperRef = React.useRef<Swiper<JobPost>>(null);
  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);

  // Filtrer les offres déjà postulées
  const availableJobs = React.useMemo(() => {
    if (!candidateJobPosts || !applications) return [];
    const appliedJobIds = applications.map((app) => app.job_post_id);
    return candidateJobPosts.filter((job) => !appliedJobIds.includes(job.id));
  }, [candidateJobPosts, applications]);

  const handleSwipe = (swipe: "left" | "right", card: JobPost) => {
    setIndex((prev) => prev + 1);
    if (swipe === "right") {
      // TODO: Calculer le score en fonction des compétences du candidat
      const score = 90;
      createApplication(
        { jobOfferId: card.id, score },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: "Candidature envoyée",
              text2: `Votre candidature pour ${card.title} a été envoyée avec succès`,
            });
          },
          onError: () => {
            Toast.show({
              type: "error",
              text1: "Erreur",
              text2: "Une erreur est survenue l'envoi de votre candidature",
            });
          },
        }
      );
    }
  };

  if (isLoadingCandidateJobPosts || isLoadingApplications) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Chargement des offres...</Text>
      </View>
    );
  }

  if (availableJobs.length === 0) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="mb-4 text-lg text-gray-600">
          Aucune nouvelle offre disponible
        </Text>
        <Text className="text-sm text-gray-500">
          Vous avez déjà postulé à toutes les offres disponibles
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-[0.9]">
        <Swiper
          ref={swiperRef}
          cards={availableJobs}
          cardIndex={index}
          renderCard={(card) => <Card card={card} />}
          onSwipedLeft={(cardIndex) => {
            handleSwipe("left", availableJobs[cardIndex]);
          }}
          onSwipedRight={(cardIndex) => {
            handleSwipe("right", availableJobs[cardIndex]);
          }}
          onSwipedAll={() => {
            setIsAllSwiped(true);
          }}
          cardVerticalMargin={50}
          stackSize={4}
          stackScale={10}
          stackSeparation={15}
          verticalSwipe={false}
          animateOverlayLabelsOpacity
          animateCardOpacity
          backgroundColor="transparent"
          overlayLabels={{
            left: {
              element: <OverlayLabel color="red" />,
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              element: <OverlayLabel color="blue" />,
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: "black",
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
        />
      </View>
      <View className="flex-[0.1] items-center z-[100]">
        <View className="flex-row w-full justify-evenly">
          <TouchableOpacity onPress={() => swiperRef.current?.swipeLeft()}>
            <X size={28} color="red" />
          </TouchableOpacity>
          <Text>Swipez les cartes pour les classer</Text>
          <TouchableOpacity onPress={() => swiperRef.current?.swipeRight()}>
            <Heart size={28} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
      {isAllSwiped && (
        <View className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black">
          <Text className="mb-4 text-white">Plus aucune offre à swiper</Text>
          <TouchableOpacity
            className="bg-white justify-center items-center rounded-lg p-2.5"
            onPress={() => {
              setIsAllSwiped(false);
              setIndex(0);
              swiperRef.current?.jumpToCardIndex(0);
            }}
          >
            <Text>Recommencer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
