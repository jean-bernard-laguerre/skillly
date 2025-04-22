import React from "react";
import { View, Text } from "react-native";

const MyApplications = () => {
  return (
    <View className="items-center justify-center flex-1 bg-gray-100">
      <Text className="mb-5 text-2xl font-bold">Mes candidatures</Text>
      <Text className="text-gray-600">Voici vos candidatures</Text>
    </View>
  );
};

export default MyApplications;
