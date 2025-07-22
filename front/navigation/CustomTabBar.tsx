import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationVisibility } from "@/context/NavigationVisibilityContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";

const { width } = Dimensions.get("window");
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isNavigationVisible } = useNavigationVisibility();
  const { totalUnreadCount } = useUnreadMessages();

  // Ne pas afficher la navigation si elle est masquée
  if (!isNavigationVisible) {
    return null;
  }

  return (
    <SafeAreaView
      style={[
        {
          zIndex: 1000,
          backgroundColor: "transparent",
        }
      ]}
      edges={["bottom"]}
    >
      <LinearGradient
        colors={["rgba(242, 242, 242, 0.3)", "rgba(242, 242, 242, 0)", "#4717F6"]}
        locations={[0, 0.7, 1]}
        start={{ x: -12, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={style.container}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          // Déterminer si c'est l'onglet Messages et s'il y a des messages non lus
          const isMessagesTab =
            route.name === "Messages" || route.name === "messages";

          // S'assurer que badgeCount est toujours un nombre
          let badgeCount = 0;
          if (isMessagesTab) {
            badgeCount = totalUnreadCount || 0;
          } else if (options.tabBarBadge) {
            if (typeof options.tabBarBadge === "number") {
              badgeCount = options.tabBarBadge;
            } else {
              const parsed = parseInt(String(options.tabBarBadge));
              badgeCount = isNaN(parsed) ? 0 : parsed;
            }
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5)}
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                style.tabDefault,
                index === 0 && { justifyContent: "flex-start" },
                index === state.routes.length - 1 && {
                  justifyContent: "flex-end",
                },
              ]}
            >
              {isFocused ? (
                <LinearGradient
                  colors={[
                    "rgb(132, 100, 249)",
                    "rgb(242, 242, 242)",
                    "rgba(242, 242, 242, 0.1)",
                  ]}
                  locations={[0, 0.8, 1]}
                  start={{ x: -12, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={style.tabItem}
                >
                  {options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color: "#4717F6",
                      size: 26,
                    })}
                  <Animated.Text
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {String(label || "")}
                  </Animated.Text>
                </LinearGradient>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 8,
                  }}
                >
                  {options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color: "rgba(255, 255, 255, 0.7)",
                      size: 24,
                    })}
                </View>
              )}
              {typeof badgeCount === "number" && badgeCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: isFocused ? -2 : 2,
                    right: -2,
                    backgroundColor: "#EF4444",
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {badgeCount > 99 ? "99+" : String(badgeCount || 0)}
                  </Text>
                </View>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </LinearGradient>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    width: "auto",
    /* height: 56, */
    alignSelf: "center",
    /* bottom: 8, */
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    gap: 4,
  },
  tabDefault: {
    flexDirection: "row",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,

    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 8,
    marginHorizontal: 0,
  },
});
