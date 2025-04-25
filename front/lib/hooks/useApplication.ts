import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ApplicationService from "@/services/application.service";
import { useAuth } from "@/context/AuthContext";

export const useApplication = () => {
  const queryClient = useQueryClient();
  const { role } = useAuth();

  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: ApplicationService.getMyApplications,
    enabled: role === "candidate",
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

  const {
    mutate: updateApplicationState,
    isPending: isUpdatingApplicationState,
    error: updateApplicationStateError,
  } = useMutation({
    mutationFn: ({
      applicationId,
      state,
    }: {
      applicationId: string;
      state: "pending" | "matched" | "rejected" | "accepted";
    }) => ApplicationService.updateApplicationState(applicationId, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
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
    updateApplicationState,
    isUpdatingApplicationState,
    updateApplicationStateError,
  };
};
