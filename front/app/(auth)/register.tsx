import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import CandidateSignup from "./signup/candidate";
import RecruiterSignup from "./signup/recruiter";

type UserType = "candidate" | "recruiter" | null;

export default function Register() {
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <View className="flex-1 p-4">
      {!userType ? (
        <View className="items-center justify-center flex-1">
          <Text className="mb-8 text-2xl font-bold">
            Choisissez votre profil
          </Text>

          <View className="w-full max-w-xs space-y-4">
            <Pressable
              className="p-4 bg-blue-500 rounded-lg"
              onPress={() => setUserType("candidate")}
            >
              <Text className="text-lg text-center text-white">
                Je suis un candidat
              </Text>
            </Pressable>

            <Pressable
              className="p-4 bg-green-500 rounded-lg"
              onPress={() => setUserType("recruiter")}
            >
              <Text className="text-lg text-center text-white">
                Je suis un recruteur
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="flex-1">
          <Pressable
            className="w-24 p-2 mb-4 bg-gray-200 rounded-lg"
            onPress={() => setUserType(null)}
          >
            <Text className="text-center">Retour</Text>
          </Pressable>

          {userType === "candidate" ? <CandidateSignup /> : <RecruiterSignup />}
        </View>
      )}
    </View>
  );
}
