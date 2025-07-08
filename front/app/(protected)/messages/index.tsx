import { View, Text } from "react-native";
import { useAuth } from "@/context/AuthContext";
import CandidateMessages from "./CandidateMessages";
import RecruiterMessages from "./RecruiterMessages";

export default function Messages() {
  const { role } = useAuth();

  if (role === "candidate") {
    return <CandidateMessages />;
  } else if (role === "recruiter") {
    return <RecruiterMessages />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Accès non autorisé</Text>
    </View>
  );
}
