import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as CertificationService from "@/services/certification.service";
import { Certification } from "@/types/interfaces";

export const useCertifications = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les certifications
  const { data: certifications, isLoading: isLoadingCertifications } = useQuery(
    {
      queryKey: ["certifications"],
      queryFn: CertificationService.getAllCertifications,
    }
  );

  // Récupérer les certifications par catégorie
  const useCertificationsByCategory = (category: string) => {
    return useQuery({
      queryKey: ["certifications", "category", category],
      queryFn: () => CertificationService.getCertificationsByCategory(category),
      enabled: !!category, // Ne s'exécute que si une catégorie est fournie
    });
  };

  // Créer une nouvelle certification
  const { mutate: createCertification, isPending: isCreatingCertification } =
    useMutation({
      mutationFn: CertificationService.createCertification,
      onSuccess: () => {
        // Invalider et refetch la liste des certifications
        queryClient.invalidateQueries({ queryKey: ["certifications"] });
      },
    });

  // Mettre à jour une certification
  const { mutate: updateCertification, isPending: isUpdatingCertification } =
    useMutation({
      mutationFn: ({
        id,
        certificationData,
      }: {
        id: number;
        certificationData: Partial<Certification>;
      }) => CertificationService.updateCertification(id, certificationData),
      onSuccess: (_, { id }) => {
        // Invalider la liste des certifications et la certification spécifique
        queryClient.invalidateQueries({ queryKey: ["certifications"] });
        queryClient.invalidateQueries({ queryKey: ["certifications", id] });
      },
    });

  // Supprimer une certification
  const { mutate: deleteCertification, isPending: isDeletingCertification } =
    useMutation({
      mutationFn: CertificationService.deleteCertification,
      onSuccess: (_, id) => {
        // Invalider la liste des certifications et la certification spécifique
        queryClient.invalidateQueries({ queryKey: ["certifications"] });
        queryClient.invalidateQueries({ queryKey: ["certifications", id] });
      },
    });

  return {
    // Données
    certifications,
    isLoadingCertifications,

    // Mutations
    createCertification,
    isCreatingCertification,
    updateCertification,
    isUpdatingCertification,
    deleteCertification,
    isDeletingCertification,

    // Hooks spécifiques
    useCertificationsByCategory,
  };
};
