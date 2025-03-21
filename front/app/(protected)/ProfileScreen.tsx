import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";

const ProfileScreen: React.FC = () => {
  const { handleLogOut } = useAuth();
  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{ uri: "https://via.placeholder.com/150" }}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.bio}>
        Software Engineer at XYZ Company. Passionate about technology and open
        source.
      </Text>
      <Pressable
        className="p-2 mt-5 bg-red-500 rounded-md"
        onPress={handleLogOut}
      >
        <Text className="text-white">Se déconnecter</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProfileScreen;
