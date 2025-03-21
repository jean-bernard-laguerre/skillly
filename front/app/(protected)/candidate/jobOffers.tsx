import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Heart, X } from "lucide-react-native";
import { JobCard, SwippedState, OverlayLabelProps } from "@/types/interfaces";

const Card = ({ card }: { card: JobCard }) => (
  <View className="flex-[0.9] rounded-lg shadow-lg justify-center items-center bg-white">
    <Text className="text-3xl font-bold text-center text-black">
      {card.title}
    </Text>
    <Text className="text-xl font-medium text-center text-black">
      {card.description}
    </Text>
  </View>
);

const OverlayLabel = ({ color }: OverlayLabelProps) => {
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
  const swiperRef = React.useRef<Swiper<JobCard>>(null);
  const [swipped, setSwipped] = useState<SwippedState>({
    left: [],
    right: [],
  });
  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const cards: JobCard[] = [
    {
      title: "Card 1",
      description: "This is a card",
    },
    {
      title: "Card 2",
      description: "This is another card",
    },
    {
      title: "Card 3",
      description: "This is a card",
    },
    {
      title: "Card 4",
      description: "This is another card",
    },
    {
      title: "Card 5",
      description: "This is a card",
    },
    {
      title: "Card 6",
      description: "This is another card",
    },
    {
      title: "Card 7",
      description: "This is a card",
    },
    {
      title: "Card 8",
      description: "This is another card",
    },
    {
      title: "Card 9",
      description: "This is a card",
    },
    {
      title: "Card 10",
      description: "This is another card",
    },
  ];

  const handleSwipe = (swipe: "left" | "right", card: JobCard) => {
    setIndex((prev) => prev + 1);
    setSwipped((prev: SwippedState) => ({
      ...prev,
      [swipe]: [...prev[swipe], card],
    }));
  };

  useEffect(() => {
    console.log(swipped);
  }, [swipped]);

  return (
    <View className="flex-1">
      <View className="flex-[0.9]">
        <Swiper
          ref={swiperRef}
          cards={cards}
          cardIndex={index}
          renderCard={(card) => <Card card={card} />}
          onSwipedLeft={(cardIndex) => {
            handleSwipe("left", cards[cardIndex]);
          }}
          onSwipedRight={(cardIndex) => {
            handleSwipe("right", cards[cardIndex]);
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
          <Text className="text-white">
            Plus aucune carte à swiper, vous avez swipé toutes les cartes
          </Text>
          <Text className="text-white">Cartes swipées: </Text>
          <View className="flex-row justify-between w-1/2">
            <View className="flex-col items-center justify-center">
              <Text className="text-white">Left:</Text>
              {swipped.left.map((card) => (
                <Text key={card.title} className="text-white">
                  {card.title}
                </Text>
              ))}
            </View>
            <View className="flex-col items-center justify-center">
              <Text className="text-white">Right:</Text>
              {swipped.right.map((card) => (
                <Text key={card.title} className="text-white">
                  {card.title}
                </Text>
              ))}
            </View>
          </View>
          <TouchableOpacity
            className="bg-black justify-center items-center rounded-lg p-2.5 mt-5 border border-white"
            onPress={() => {
              setSwipped({ left: [], right: [] });
              setIsAllSwiped(false);
              setIndex(0);
              swiperRef.current?.jumpToCardIndex(0);
            }}
          >
            <Text className="text-white">Recommencer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
