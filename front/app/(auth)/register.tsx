import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import CandidateSignup from "./signup/candidate";
import RecruiterSignup from "./signup/recruiter";
import { useAuth } from "@/lib/hooks/useAuth";

type UserType = "candidate" | "recruiter" | null;

export default function Register() {
  const [userType, setUserType] = useState<UserType>(null);
  const { registerCandidate, registerRecruiter } = useAuth();

  const handleQuickSignup = (role: "candidate" | "recruiter") => {
    if (role === "candidate") {
      registerCandidate({
        firstName: "John",
        lastName: "Doe",
        email: "candidate@mail.com",
        password: "test1234",
        bio: "Développeur passionné",
        location: "Paris",
        skills: [],
        certifications: [],
      });
    } else {
      registerRecruiter({
        firstName: "Jane",
        lastName: "Smith",
        email: "recruiter@mail.com",
        password: "test1234",
        newCompany: {
          CompanyName: "Tech Company",
          SIRET: "123456789",
        },
      });
    }
  };

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

            <View className="mt-8">
              <Text className="mb-4 text-center text-gray-500">
                Inscription rapide
              </Text>
              <View className="space-y-4">
                <Pressable
                  className="p-4 bg-purple-500 rounded-lg"
                  onPress={() => handleQuickSignup("candidate")}
                >
                  <Text className="text-lg text-center text-white">
                    Candidat Test
                  </Text>
                </Pressable>

                <Pressable
                  className="p-4 bg-orange-500 rounded-lg"
                  onPress={() => handleQuickSignup("recruiter")}
                >
                  <Text className="text-lg text-center text-white">
                    Recruteur Test
                  </Text>
                </Pressable>
              </View>
            </View>
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
