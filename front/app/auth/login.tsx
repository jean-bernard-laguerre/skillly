import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { setRole, setUser } = useAuth();

  const handleLogin = (role: "candidate" | "recruiter") => {
    setRole(role);
    if (role === "candidate") {
      setUser({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      });
      router.replace("/(protected)/candidate");
    } else if (role === "recruiter") {
      setUser({
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
      });
      router.replace("/(protected)/recruiter");
    }
  };

  return (
    <View className="items-center justify-center flex-1">
      <Text className="mb-4 text-2xl font-bold">Connexion 🔐</Text>
      <Button
        title="Se connecter en Candidat"
        onPress={() => handleLogin("candidate")}
      />
      <View className="h-4" />
      <Button
        title="Se connecter en Recruteur"
        onPress={() => handleLogin("recruiter")}
      />
    </View>
  );
}
