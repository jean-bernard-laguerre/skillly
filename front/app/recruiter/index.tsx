import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function RecruiterDashboard() {
  const { handleLogOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Espace Recruteur 🚀
      </Text>
      <Button title="Se déconnecter" onPress={handleLogOut} />
    </View>
  );
}
