import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";

interface Card {
  title: string;
  description: string;
}

interface SwippedState {
  left: Card[];
  right: Card[];
}

const Card = ({ card }: { card: Card }) => (
  <View style={styles.card}>
    <Text style={[styles.text, styles.title]}>{card.title}</Text>
    <Text style={[styles.desc, styles.text]}>{card.description}</Text>
  </View>
);

const OverlayLabel = ({ color }: { color: string }) => {
  if (color === "red") {
    return (
      <View style={styles.overlayLabel}>
        <IconSymbol size={50} name="xmark" color={color} />
      </View>
    );
  } else {
    return (
      <View style={styles.overlayLabel}>
        <IconSymbol size={50} name="heart" color={color} />
      </View>
    );
  }
};

export default function JobOffers() {
  const swiperRef = React.useRef<Swiper<Card>>(null);
  const [swipped, setSwipped] = useState<SwippedState>({
    left: [],
    right: [],
  });
  const [index, setIndex] = useState(0);
  const [isAllSwiped, setIsAllSwiped] = useState(false);
  const cards = [
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

  const handleSwipe = (swipe: "left" | "right", card: Card) => {
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
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
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
      <View style={styles.bottomContainer}>
        <View style={styles.info}>
          <TouchableOpacity onPress={() => swiperRef.current?.swipeLeft()}>
            <IconSymbol size={28} name="xmark" color="red" />
          </TouchableOpacity>
          <Text>Swipez les cartes pour les classer</Text>
          <TouchableOpacity onPress={() => swiperRef.current?.swipeRight()}>
            <IconSymbol size={28} name="heart" color="blue" />
          </TouchableOpacity>
        </View>
      </View>
      {isAllSwiped && (
        <View style={styles.swipped}>
          <Text>
            Plus aucune carte à swiper, vous avez swipé toutes les cartes
          </Text>
          <Text>Cartes swipées: </Text>
          <View style={styles.Table}>
            <View style={styles.left}>
              <Text>Left:</Text>
              {swipped.left.map((card) => (
                <Text key={card.title}>{card.title}</Text>
              ))}
            </View>
            <View style={styles.right}>
              <Text>Right:</Text>
              {swipped.right.map((card) => (
                <Text key={card.title}>{card.title}</Text>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSwipped({ left: [], right: [] });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: "flex",
    // backgroundColor: "black",
    // // alignItems: "center",
    // justifyContent: "center",
  },
  swiperContainer: {
    flex: 0.9,
  },
  bottomContainer: {
    flex: 0.1,
    alignItems: "center",
    zIndex: 100,
  },

  swipped: {
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "black",
  },

  info: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  card: {
    flex: 0.9,
    borderRadius: 8,
    shadowRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    backgroundColor: "transparent",
    color: "black",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 20,
    fontWeight: "500",
  },

  Table: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  left: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayLabel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1000,
  },

  button: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "white",
  },
});
