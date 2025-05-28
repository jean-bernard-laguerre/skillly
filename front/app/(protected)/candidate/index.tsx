// import { View, Text, Pressable } from "react-native";
// import { useAuth } from "@/context/AuthContext";

// export default function CandidateHome() {
//   const { handleLogOut } = useAuth();
//   return (
//     <View className="items-center justify-center flex-1">
//       <Text className="mb-2 text-2xl font-bold">Espace Candidat 🎯</Text>
//       <Text className="text-gray-600">Bienvenue sur votre espace candidat</Text>
//       <Pressable
//         className="p-2 mt-5 bg-red-500 rounded-md"
//         onPress={() => handleLogOut()}
//       >
//         <Text className="text-white">Se déconnecter</Text>
//       </Pressable>
//     </View>
//   );
// }

/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useRef } from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  type ImageSourcePropType,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";

const IMAGES = [
  { uri: "https://picsum.photos/seed/1748434707950/300/300" },
  { uri: "https://picsum.photos/seed/1748434707951/300/300" },
  { uri: "https://picsum.photos/seed/1748434707952/300/300" },
  { uri: "https://picsum.photos/seed/1748434707953/300/300" },
  { uri: "https://picsum.photos/seed/1748434707954/300/300" },
  { uri: "https://picsum.photos/seed/1748434707955/300/300" },
];

const App = () => {
  const ref = useRef<SwiperCardRefType>(null);

  const renderCard = useCallback((image: ImageSourcePropType) => {
    return (
      <View style={styles.renderCardContainer}>
        <Image
          source={image}
          style={styles.renderCardImage}
          resizeMode="cover"
          {...(Platform.OS === "android" && { fadeDuration: 0 })}
        />
      </View>
    );
  }, []);
  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: "rgba(0, 255, 0, 0.3)",
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelLeft = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: "rgba(255, 0, 0, 0.3)",
          },
        ]}
      />
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.subContainer}>
        <Swiper
          ref={ref}
          cardStyle={styles.cardStyle}
          data={IMAGES}
          renderCard={renderCard}
          onSwipeRight={(cardIndex) => {
            console.log("Right:", cardIndex);
          }}
          onSwipeLeft={(cardIndex) => {
            console.log("Left:", cardIndex);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            ref.current?.swipeLeft();
          }}
        >
          <AntDesign name="close" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { height: 60, marginHorizontal: 10 }]}
          onPress={() => {
            ref.current?.swipeBack();
          }}
        >
          <AntDesign name="reload1" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            ref.current?.swipeTop();
          }}
        >
          <AntDesign name="arrowup" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            ref.current?.swipeRight();
          }}
        >
          <AntDesign name="heart" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardStyle: {
    width: "95%",
    height: "75%",
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    borderRadius: 15,
    height: "75%",
    width: "100%",
  },
  renderCardImage: {
    height: "100%",
    width: "100%",
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayLabelContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
