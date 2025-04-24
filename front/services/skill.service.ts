import instance from "./api";
import { Skill } from "@/types/interfaces";

export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await instance.get("/skill");
  return response.data;
};

export const getSkillsByCategory = async (
  category: string
): Promise<Skill[]> => {
  const response = await instance.get(`/skills/category/${category}`);
  return response.data;
};

export const createSkill = async (skill: Partial<Skill>): Promise<Skill> => {
  const response = await instance.post("/skills", skill);
  return response.data;
};

export const updateSkill = async (
  id: number,
  skill: Partial<Skill>
): Promise<Skill> => {
  const response = await instance.put(`/skills/${id}`, skill);
  return response.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
  await instance.delete(`/skills/${id}`);
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
