import { ScrollView, View } from "react-native";
import { ParallaxScrollViewProps } from "@/types/interfaces";

export default function ParallaxScrollView({
  children,
  headerBackgroundColor = "#fff",
  headerImage,
  headerHeight = 200,
}: ParallaxScrollViewProps) {
  return (
    <ScrollView>
      <View
        style={{ height: headerHeight, backgroundColor: headerBackgroundColor }}
      >
        {headerImage}
      </View>
      {children}
    </ScrollView>
  );
}
