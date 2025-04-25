import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";

export default function Profile() {
  const { user } = useAuth();

  const { logout } = useAuthMutation();

  return (
    <View className="items-center justify-center flex-1 p-5">
      <Image
        className="w-[150px] h-[150px] rounded-full mb-5"
        source={{ uri: "https://picsum.photos/seed/987654321/150/150" }}
      />
      <Text className="mb-2 text-2xl font-bold">
        {user?.first_name} {user?.last_name}
      </Text>
      <Text className="mb-2 text-gray-600">{user?.email}</Text>
      <Text className="text-base text-center">
        Recruteur chez XYZ Company. À la recherche de talents passionnés pour
        rejoindre notre équipe dynamique.
      </Text>
      <Pressable
        className="p-2 mt-5 bg-red-500 rounded-md"
        onPress={() => logout()}
      >
        <Text className="text-white">Se déconnecter</Text>
      </Pressable>
    </View>
  );
}
