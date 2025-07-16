import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

export interface SwipeGestureConfig {
  threshold?: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap?: () => void;
}

export const useSwipeGestures = ({
  threshold = 100,
  onSwipeLeft,
  onSwipeRight,
  onTap,
}: SwipeGestureConfig) => {
  // Valeurs animées
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const isSwipeDisabled = useSharedValue(false);

  // Fonction pour animer la sortie de la card
  const animateCardExit = (
    direction: "left" | "right",
    callback: () => void
  ) => {
    const exitX = direction === "left" ? -400 : 400;

    translateX.value = withSpring(exitX, { damping: 15 });
    opacity.value = withSpring(0, { damping: 15 });

    setTimeout(() => {
      callback();
      // Réinitialiser pour la prochaine card
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 1;
    }, 300);
  };

  // Gestionnaire de gestes
  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isSwipeDisabled.value) return;
      scale.value = withSpring(0.95);
    })
    .onUpdate((event) => {
      if (isSwipeDisabled.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5; // Réduire le mouvement vertical
    })
    .onEnd((event) => {
      if (isSwipeDisabled.value) return;
      scale.value = withSpring(1);

      if (Math.abs(event.translationX) > threshold) {
        // Swipe détecté
        const direction = event.translationX > 0 ? "right" : "left";

        if (direction === "right") {
          runOnJS(animateCardExit)("right", onSwipeRight);
        } else {
          runOnJS(animateCardExit)("left", onSwipeLeft);
        }
      } else {
        // Retour à la position initiale
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const tapGesture = Gesture.Tap().onStart(() => {
    // Ne pas déclencher le tap si un swipe est en cours
    if (Math.abs(translateX.value) < 10 && onTap) {
      runOnJS(onTap)();
    }
  });

  // Composition des gestes
  const composedGestures = Gesture.Simultaneous(panGesture, tapGesture);

  // Styles animés pour la card
  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Styles des overlays
  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-150, -50, 0],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    ),
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, 50, 150],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    ),
  }));

  // Fonction pour désactiver temporairement le swipe
  const disableSwipe = (duration = 100) => {
    isSwipeDisabled.value = true;
    setTimeout(() => {
      isSwipeDisabled.value = false;
    }, duration);
  };

  return {
    // Gestes
    composedGestures,
    // Styles animés
    animatedCardStyle,
    leftOverlayStyle,
    rightOverlayStyle,
    // Utilitaires
    disableSwipe,
    animateCardExit: (direction: "left" | "right", callback: () => void) =>
      animateCardExit(direction, callback),
  };
};
