import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "@/services";
import { Skill } from "@/types/interfaces";

export const useSkills = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les compétences
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: SkillService.getAllSkills,
  });

  // Récupérer les compétences par catégorie
  const useSkillsByCategory = (category: string) => {
    return useQuery({
      queryKey: ["skills", "category", category],
      queryFn: () => SkillService.getSkillsByCategory(category),
      enabled: !!category, // Ne s'exécute que si une catégorie est fournie
    });
  };

  // Créer une nouvelle compétence
  const { mutate: createSkill, isPending: isCreatingSkill } = useMutation({
    mutationFn: SkillService.createSkill,
    onSuccess: () => {
      // Invalider et refetch la liste des compétences
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  // Mettre à jour une compétence
  const { mutate: updateSkill, isPending: isUpdatingSkill } = useMutation({
    mutationFn: ({
      id,
      skillData,
    }: {
      id: number;
      skillData: Partial<Skill>;
    }) => SkillService.updateSkill(id, skillData),
    onSuccess: (_, { id }) => {
      // Invalider la liste des compétences et la compétence spécifique
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills", id] });
    },
  });

  // Supprimer une compétence
  const { mutate: deleteSkill, isPending: isDeletingSkill } = useMutation({
    mutationFn: SkillService.deleteSkill,
    onSuccess: (_, id) => {
      // Invalider la liste des compétences et la compétence spécifique
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills", id] });
    },
  });

  return {
    // Données
    skills,
    isLoadingSkills,

    // Mutations
    createSkill,
    isCreatingSkill,
    updateSkill,
    isUpdatingSkill,
    deleteSkill,
    isDeletingSkill,

    // Hooks spécifiques
    useSkillsByCategory,
  };
};
