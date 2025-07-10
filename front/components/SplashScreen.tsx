import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

// Import direct de ton SVG comme composant !
import SkilllyLogo from "../assets/images/skillly_logo.svg";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Animation values - séparées pour éviter les conflits
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const logoRotation = useSharedValue(0);

  // Séparation : translation sur le conteneur externe, rotation/scale sur le conteneur interne
  const logoContainerTranslateX = useSharedValue(0); // Translation du conteneur
  const backgroundOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(200); // Texte commence hors écran à droite
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Phase 1 : Apparition du logo sur fond blanc (0-300ms)
    logoOpacity.value = withTiming(1, { duration: 300 });

    // Phase 2 : Animation du logo - rotation + scale (800ms-2200ms)
    setTimeout(() => {
      logoRotation.value = withSequence(
        withTiming(360, { duration: 800 }), // Rotation complète
        withTiming(360, { duration: 0 }) // Reste à 360°
      );

      logoScale.value = withSequence(
        withTiming(1.3, { duration: 400 }), // Grandit
        withTiming(1, { duration: 400 }) // Rétrécit à la normale
      );
    }, 800);

    // Phase 3 : Apparition du fond dégradé (2200ms-2800ms)
    setTimeout(() => {
      backgroundOpacity.value = withTiming(1, { duration: 600 }); // Fond apparaît
    }, 2200);

    // Phase 4 : Effet de poussée - Logo + Texte (2500ms-3100ms)
    setTimeout(() => {
      // Animation simultanée pour l'effet de poussée
      logoContainerTranslateX.value = withTiming(-80, { duration: 600 }); // Conteneur logo pousse vers la gauche
      textOpacity.value = withTiming(1, { duration: 400 }); // Texte apparaît
      textTranslateX.value = withTiming(40, { duration: 600 }); // Texte pousse depuis la droite
    }, 2500);

    // Phase 5 : Disparition complète
    setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setIsVisible)(false);
          runOnJS(onFinish)();
        }
      });
    }, 4500);
  }, []);

  // Styles d'animation séparés
  const logoContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: logoContainerTranslateX.value }, // Seulement la translation sur le conteneur
    ],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value }, // Seulement scale et rotation sur le logo
      { rotate: `${logoRotation.value}deg` },
    ],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: textTranslateX.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Fond blanc initial */}
      <View style={styles.whiteBackground} />

      {/* Image de fond qui apparaît plus tard */}
      <Animated.View
        style={[styles.gradientContainer, backgroundAnimatedStyle]}
      >
        <ImageBackground
          source={require("../assets/images/splashScreenBg.png")}
          style={styles.gradient}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Conteneur externe pour la translation du logo */}
        <Animated.View style={logoContainerAnimatedStyle}>
          {/* Conteneur interne pour rotation/scale du logo */}
          <Animated.View style={logoAnimatedStyle}>
            <SkilllyLogo width={80} height={80} />
          </Animated.View>
        </Animated.View>

        {/* Texte */}
        <Animated.Text style={[styles.title, textAnimatedStyle]}>
          SKILLLY
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  whiteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 4,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    position: "absolute", // Position absolue pour éviter les conflits
  },
});
