import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { setRole } = useAuth();

  const handleLogin = (role: string) => {
    setRole(role);
    router.replace("/candidate");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Connexion 🔐
      </Text>
      <Button
        title="Se connecter en Candidat"
        onPress={() => handleLogin("candidate")}
      />
      <View style={{ height: 10 }} />
      <Button
        title="Se connecter en Recruteur"
        onPress={() => handleLogin("recruiter")}
      />
    </View>
  );
}
