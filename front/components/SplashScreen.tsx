import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  G,
  ClipPath,
  Rect,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

const SkilllyLogo = () => (
  <Svg width="80" height="80" viewBox="0 0 40 40" fill="none">
    <G clipPath="url(#clip0_220_2342)">
      <Path
        d="M32 0H8C3.58172 0 0 3.58172 0 8V32C0 36.4183 3.58172 40 8 40H32C36.4183 40 40 36.4183 40 32V8C40 3.58172 36.4183 0 32 0Z"
        fill="#4A90F4"
      />
      <G filter="url(#filter0_d_220_2342)">
        <Path
          d="M20.5533 35.4661C11.08 35.4661 5.75998 31.7328 5.75998 24.4528V24.1728H12.76V25.0128C12.76 27.9061 14.2066 29.0728 20.5533 29.0728C26.1533 29.0728 27.46 28.2328 27.46 26.1328C27.46 24.2194 26.3866 23.5194 23.1666 22.9594L14.3933 21.6994C8.79331 20.8128 5.47998 18.0128 5.47998 12.9261C5.47998 8.21278 9.30665 3.26611 19.8066 3.26611C29.42 3.26611 33.9 7.69945 33.9 14.2794V14.5594H26.8533V13.9061C26.8533 10.9194 25.3133 9.65945 19.1066 9.65945C14.0666 9.65945 12.5266 10.6394 12.5266 12.6461C12.5266 14.4661 13.5533 15.1194 16.1666 15.5861L24.94 16.9861C31.94 18.1061 34.46 21.5128 34.46 25.8061C34.46 30.8928 30.4933 35.4661 20.5533 35.4661Z"
          fill="url(#paint0_linear_220_2342)"
        />
      </G>
    </G>
    <Defs>
      <Filter
        id="filter0_d_220_2342"
        x="4.41331"
        y="3.26611"
        width="31.1133"
        height="34.3335"
        filterUnits="userSpaceOnUse"
      >
        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
        <FeColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <FeOffset dy="1.06667" />
        <FeGaussianBlur stdDeviation="0.533333" />
        <FeComposite in2="hardAlpha" operator="out" />
        <FeColorMatrix
          type="matrix"
          values="0 0 0 0 0.247059 0 0 0 0 0.317647 0 0 0 0 0.709804 0 0 0 1 0"
        />
        <FeBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_220_2342"
        />
        <FeBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_220_2342"
          result="shape"
        />
      </Filter>
      <SvgLinearGradient
        id="paint0_linear_220_2342"
        x1="20"
        y1="-8.66722"
        x2="20"
        y2="48.6661"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#50CDFE" />
        <Stop offset="0.504808" stopColor="#4FCCFE" />
        <Stop offset="1" stopColor="#5DE6DA" />
      </SvgLinearGradient>
      <ClipPath id="clip0_220_2342">
        <Rect width="40" height="40" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Sequence d'animations
    logoOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(500, withTiming(1, { duration: 800 }));
    textOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));

    // Disparition après 3 secondes
    const timer = setTimeout(() => {
      backgroundOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setIsVisible)(false);
          runOnJS(onFinish)();
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={["#4A90F4", "#50CDFE", "#5DE6DA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <SkilllyLogo />
          </Animated.View>

          <Animated.Text style={[styles.title, textAnimatedStyle]}>
            SKILLLY
          </Animated.Text>
        </View>
      </LinearGradient>
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
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 4,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
