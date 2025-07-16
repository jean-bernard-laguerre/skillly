import { Dimensions } from "react-native";
import { useState, useEffect } from "react";

const { height: initialScreenHeight, width: initialScreenWidth } =
  Dimensions.get("window");

export interface ScreenSize {
  width: number;
  height: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isVerySmallScreen: boolean;
  isLandscape: boolean;
}

export interface ResponsiveConfig {
  // Spacing et dimensions
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  // Typography
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  // Components
  button: {
    height: number;
    borderRadius: number;
    padding: number;
  };

  card: {
    padding: number;
    margin: number;
    borderRadius: number;
    maxContentHeight: number;
  };

  header: {
    height: number;
    padding: number;
    titleSize: number;
    subtitleSize: number;
  };

  // Icons
  iconSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  // Layout helpers
  showSecondaryInfo: boolean;
  maxItemsInRow: number;
  compactMode: boolean;
}

export const useResponsive = (): ScreenSize & { config: ResponsiveConfig } => {
  const [screenData, setScreenData] = useState(() => {
    const { height, width } = Dimensions.get("window");
    return { height, width };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenData({ height: window.height, width: window.width });
    });

    return () => subscription?.remove();
  }, []);

  const { height: screenHeight, width: screenWidth } = screenData;

  // Classifications d'écran
  const isVerySmallScreen = screenHeight < 650;
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;
  const isLargeScreen = screenHeight >= 850;
  const isLandscape = screenWidth > screenHeight;

  // Configuration adaptative
  const config: ResponsiveConfig = {
    spacing: {
      xs: isVerySmallScreen ? 4 : isSmallScreen ? 6 : 8,
      sm: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
      md: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
      lg: isVerySmallScreen ? 16 : isSmallScreen ? 18 : 20,
      xl: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
    },

    fontSize: {
      xs: isVerySmallScreen ? 10 : 11,
      sm: isVerySmallScreen ? 12 : 13,
      md: isVerySmallScreen ? 14 : 15,
      lg: isVerySmallScreen ? 16 : 17,
      xl: isVerySmallScreen ? 18 : 19,
      xxl: isVerySmallScreen ? 20 : 22,
    },

    button: {
      height: isVerySmallScreen ? 40 : isSmallScreen ? 44 : 48,
      borderRadius: 8,
      padding: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
    },

    card: {
      padding: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
      margin: isVerySmallScreen ? 8 : isSmallScreen ? 10 : 12,
      borderRadius: 12,
      maxContentHeight: isVerySmallScreen
        ? screenHeight * 0.6
        : isSmallScreen
        ? screenHeight * 0.7
        : screenHeight * 0.8,
    },

    header: {
      height: isVerySmallScreen ? 60 : isSmallScreen ? 70 : 80,
      padding: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
      titleSize: isVerySmallScreen ? 18 : isSmallScreen ? 20 : 22,
      subtitleSize: isVerySmallScreen ? 13 : isSmallScreen ? 14 : 15,
    },

    iconSize: {
      xs: isVerySmallScreen ? 14 : 16,
      sm: isVerySmallScreen ? 18 : 20,
      md: isVerySmallScreen ? 22 : 24,
      lg: isVerySmallScreen ? 28 : 32,
    },

    showSecondaryInfo: !isVerySmallScreen,
    maxItemsInRow: isVerySmallScreen ? 2 : isSmallScreen ? 3 : 4,
    compactMode: isVerySmallScreen || isSmallScreen,
  };

  return {
    width: screenWidth,
    height: screenHeight,
    isVerySmallScreen,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isLandscape,
    config,
  };
};
