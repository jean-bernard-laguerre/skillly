import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

export default function TestScreen() {
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

  // function handleSwipe qui met dans swipped les cards qu'on a swippe en fonction du côté du swipe

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
      <Swiper
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
        showSecondCard={true}
        stackSize={4}
        stackScale={10}
        stackSeparation={15}
        verticalSwipe={false}
        animateOverlayLabelsOpacity
        animateCardOpacity
        overlayLabels={{
          left: {
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
      ></Swiper>
      {/* si toutes les cartes ont été swipées, afficher les cartes swipées */}
      {isAllSwiped && (
        <ThemedView style={styles.swipped}>
          <ThemedText>
            Plus aucune carte à swiper, vous avez swipé toutes les cartes
          </ThemedText>
          <ThemedText>Cartes swipées: </ThemedText>
          <ThemedView style={styles.Table}>
            <ThemedView style={styles.left}>
              <ThemedText>Left:</ThemedText>
              {swipped.left.map((card) => (
                <ThemedText key={card.title}>{card.title}</ThemedText>
              ))}
            </ThemedView>
            <ThemedView style={styles.right}>
              <ThemedText>Right:</ThemedText>
              {swipped.right.map((card) => (
                <ThemedText key={card.title}>{card.title}</ThemedText>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: "flex",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  // swipped doit apparaitre doucement
  swipped: {
    display: "flex",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "red",
  },

  card: {
    flex: 0.45,
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
});
