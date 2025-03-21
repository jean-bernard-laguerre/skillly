import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Check, X, User, ArrowLeft } from "lucide-react-native";
import Swiper from "react-native-deck-swiper";
import { Application, ApplicationsListProps } from "@/types/interfaces";

const ApplicationCard = ({ application }: { application: Application }) => (
  <View className="flex-[0.9] rounded-lg shadow-lg justify-center items-center bg-white p-4">
    <View className="w-full">
      <View className="flex-row items-center mb-4">
        <User size={24} color="#6366f1" className="mr-2" />
        <Text className="text-xl font-semibold">
          {application.candidateName}
        </Text>
      </View>
      <Text className="mb-2 text-lg text-gray-600">{application.jobTitle}</Text>
      <Text className="text-sm text-gray-500">{application.date}</Text>
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
  applications,
  onStatusChange,
  onBack,
}: ApplicationsListProps) {
  const swiperRef = React.useRef<Swiper<Application>>(null);
  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(applications.length === 0);

  const handleSwipe = (direction: "left" | "right", cardIndex: number) => {
    const application = applications[cardIndex];
    if (direction === "left") {
      onStatusChange(application.id, "rejected");
    } else {
      onStatusChange(application.id, "accepted");
    }
    setIndex((prev) => prev + 1);
  };

  return (
    <View className="flex-1">
      <View className="relative flex-1 ">
        {/* Retour à la liste des offres */}
        <View className="absolute top-0 left-0 right-0 z-[51]">
          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={onBack}
          >
            <ArrowLeft size={24} color="#6366f1" className="mr-2" />
            <Text className="font-medium text-indigo-600">
              Retour aux offres
            </Text>
          </TouchableOpacity>
        </View>

        {!isAllSwiped ? (
          <>
            {/* CANDIDATURES */}
            <View className="flex-1 pt-16">
              <Swiper
                ref={swiperRef}
                cards={applications}
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

            {/* Boutons pour accepter ou refuser une candidature */}
            <View className="absolute bottom-0 left-0 right-0 z-50">
              <View className="flex-row items-center w-full p-4 justify-evenly">
                <TouchableOpacity
                  onPress={() => swiperRef.current?.swipeLeft()}
                >
                  <X size={28} color="red" />
                </TouchableOpacity>
                <Text className="text-gray-600">
                  Swipez les cartes pour les classer
                </Text>
                <TouchableOpacity
                  onPress={() => swiperRef.current?.swipeRight()}
                >
                  <Check size={28} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black z-[50]">
            <Text className="mb-4 text-center text-white">
              Plus aucune candidature à traiter
            </Text>
            {applications.length > 0 && (
              <TouchableOpacity
                className="px-6 py-3 bg-white rounded-lg"
                onPress={() => {
                  setIsAllSwiped(false);
                  setIndex(0);
                  swiperRef.current?.jumpToCardIndex(0);
                }}
              >
                <Text className="font-medium text-black">Recommencer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
