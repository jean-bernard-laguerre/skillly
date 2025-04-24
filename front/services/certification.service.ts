import instance from "./api";
import { Certification } from "@/types/interfaces";

export const getAllCertifications = async (): Promise<Certification[]> => {
  const response = await instance.get("/certification");
  return response.data;
};

export const getCertificationsByCategory = async (
  category: string
): Promise<Certification[]> => {
  const response = await instance.get(`/certifications/category/${category}`);
  return response.data;
};

export const createCertification = async (
  certification: Partial<Certification>
): Promise<Certification> => {
  const response = await instance.post("/certifications", certification);
  return response.data;
};

export const updateCertification = async (
  id: number,
  certification: Partial<Certification>
): Promise<Certification> => {
  const response = await instance.put(`/certifications/${id}`, certification);
  return response.data;
};

export const deleteCertification = async (id: number): Promise<void> => {
  await instance.delete(`/certifications/${id}`);
};
