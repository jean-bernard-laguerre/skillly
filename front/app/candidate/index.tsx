import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function CandidateDashboard() {
  const { handleLogOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Espace Candidat 🎯
      </Text>
      <Button title="Se déconnecter" onPress={handleLogOut} />
    </View>
  );
}
