import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ApplicationService from "@/services/application.service";

export const useApplication = () => {
  const queryClient = useQueryClient();

  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: ApplicationService.getMyApplications,
  });

  const {
    mutate: createApplication,
    isPending: isCreatingApplication,
    error: createApplicationError,
  } = useMutation({
    mutationFn: ({
      jobOfferId,
      score,
    }: {
      jobOfferId: string;
      score: number;
    }) => ApplicationService.createApplication(jobOfferId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });

  return {
    applications,
    isLoadingApplications,
    applicationsError,
    refetchApplications,
    createApplication,
    isCreatingApplication,
    createApplicationError,
  };
};
