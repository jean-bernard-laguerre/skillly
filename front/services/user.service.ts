import instance from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

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
