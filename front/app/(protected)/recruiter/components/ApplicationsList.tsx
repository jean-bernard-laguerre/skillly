import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useJobPost } from "@/lib/hooks/useJobPost";
import Swiper from "react-native-deck-swiper";
import { Check, X, User, ArrowLeft } from "lucide-react-native";
import { Application } from "@/types/interfaces";

interface ApplicationsListProps {
  jobId: string;
  onBack: () => void;
}

const ApplicationCard = ({ application }: { application: Application }) => (
  <View className="flex-[0.9] rounded-lg shadow-lg justify-center items-center bg-white p-4">
    <View className="w-full">
      <View className="flex-row items-center mb-4">
        <User size={24} color="#6366f1" className="mr-2" />
        <Text className="text-xl font-semibold">
          {application.candidate.name}
        </Text>
      </View>
      <Text className="mb-2 text-lg text-gray-600">
        {application.jobPost.title}
      </Text>
      <Text className="text-sm text-gray-500">
        {new Date(application.createdAt).toLocaleDateString()}
      </Text>
      <View className="flex-row flex-wrap gap-2 mt-4">
        {application.candidate.skills?.map((skill) => (
          <View key={skill.id} className="px-2 py-1 bg-blue-100 rounded">
            <Text className="text-sm text-blue-800">{skill.name}</Text>
          </View>
        ))}
      </View>
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
        <Check size={50} color={color} />
      </View>
    );
  }
};

export default function ApplicationsList({
  jobId,
  onBack,
}: ApplicationsListProps) {
  const { applications } = useJobPost();
  const job = applications?.find((job) => job.id === jobId);
  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(
    job?.applications?.length === 0
  );
  const swiperRef = React.useRef<Swiper<Application>>(null);

  const handleSwipe = (direction: "left" | "right", cardIndex: number) => {
    const application = job?.applications?.[cardIndex];
    if (application) {
      // TODO: Implement status change
      console.log(
        `Application ${application.id} ${
          direction === "left" ? "rejected" : "accepted"
        }`
      );
    }
    setIndex((prev) => prev + 1);
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-4">
          <ArrowLeft size={24} color="#6366f1" />
        </Pressable>
        <Text className="text-xl font-semibold">{job?.title}</Text>
      </View>

      <View className="relative flex-1">
        {!isAllSwiped ? (
          <>
            <View className="flex-1 pt-4">
              <Swiper
                ref={swiperRef}
                cards={job?.applications || []}
                cardIndex={index}
                renderCard={(application) => (
                  <ApplicationCard application={application} />
                )}
                onSwipedLeft={(cardIndex) => handleSwipe("left", cardIndex)}
                onSwipedRight={(cardIndex) => handleSwipe("right", cardIndex)}
                onSwipedAll={() => setIsAllSwiped(true)}
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
                    title: "REFUSER",
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
                    element: <OverlayLabel color="green" />,
                    title: "ACCEPTER",
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
            <Text className="mb-4 text-center text-gray-600">
              {job?.applications && job.applications.length > 0
                ? "Plus aucune candidature à traiter"
                : "Il n'y a pas encore de candidature"}
            </Text>
            {job?.applications && job.applications.length > 0 && (
              <Pressable
                className="px-6 py-3 bg-blue-500 rounded-lg"
                onPress={() => {
                  setIsAllSwiped(false);
                  setIndex(0);
                  swiperRef.current?.jumpToCardIndex(0);
                }}
              >
                <Text className="font-medium text-white">Recommencer</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
