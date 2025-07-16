import { Dimensions } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export interface AdaptiveStylesConfig {
  cardMargin: number;
  cardPadding: number;
  sectionMargin: number;
  progressPadding: number;
  buttonSpacing: number;
  buttonSize: number;
  iconSize: number;
  showLegend: boolean;
  legendPadding: number;
}

export const useAdaptiveStyles = (): AdaptiveStylesConfig => {
  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;
  const isLargeScreen = screenHeight >= 850;

  return {
    // Marges et paddings adaptatifs
    cardMargin: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
    cardPadding: isSmallScreen ? 12 : isMediumScreen ? 16 : 18,
    sectionMargin: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
    progressPadding: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
    buttonSpacing: isSmallScreen ? 20 : isMediumScreen ? 28 : 32,
    buttonSize: isSmallScreen ? 45 : isMediumScreen ? 48 : 50,
    iconSize: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
    // Légende adaptative
    showLegend: !isSmallScreen, // Masquer la légende sur petits écrans
    legendPadding: isSmallScreen ? 8 : isMediumScreen ? 12 : 20,
  };
};
