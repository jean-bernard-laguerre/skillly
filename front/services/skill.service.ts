import instance from "./api";
import { Skill } from "@/types/interfaces";

export const getAllSkills = async (): Promise<Skill[]> => {
  try {
    const response = await instance.get("/skills");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    throw error;
  }
};

export const getSkillById = async (id: number): Promise<Skill> => {
  try {
    const response = await instance.get(`/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la compétence ${id}:`,
      error
    );
    throw error;
  }
};

export const createSkill = async (
  skillData: Omit<Skill, "id">
): Promise<Skill> => {
  try {
    const response = await instance.post("/skills", skillData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la compétence:", error);
    throw error;
  }
};

export const updateSkill = async (
  id: number,
  skillData: Partial<Skill>
): Promise<Skill> => {
  try {
    const response = await instance.put(`/skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la compétence ${id}:`,
      error
    );
    throw error;
  }
};

export const deleteSkill = async (id: number): Promise<void> => {
  try {
    await instance.delete(`/skills/${id}`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la compétence ${id}:`,
      error
    );
    throw error;
  }
};

// Fonctions spécifiques
export const getSkillsByCategory = async (
  category: string
): Promise<Skill[]> => {
  try {
    const response = await instance.get(`/skills/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des compétences de la catégorie ${category}:`,
      error
    );
    throw error;
  }
};
