import instance from "./api";
import { User } from "@/types/interfaces"; // Garder l'interface User si elle est déjà utilisée

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await instance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await instance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur ${id}:`,
      error
    );
    throw error;
  }
};

export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  try {
    const response = await instance.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
};

// Interface pour le DTO d'ajout/mise à jour (PATCH)
interface UpdateUserSkillsPayload {
  skills?: number[];
  certifications?: number[];
}

// Ajouter des compétences/certifications à un utilisateur (PATCH)
export const addUserSkills = async (
  userId: number,
  payload: UpdateUserSkillsPayload
): Promise<void> => {
  await instance.patch(`/user/me/skills`, payload);
};

// Supprimer des compétences/certifications à un utilisateur (DELETE)
export const deleteUserSkill = async (
  userId: number,
  payload: UpdateUserSkillsPayload
): Promise<void> => {
  await instance.delete(`/user/me/skills/`, payload);
};
