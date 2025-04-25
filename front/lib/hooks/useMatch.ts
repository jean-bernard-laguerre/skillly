import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as MatchService from "@/services/match.service";

export const useMatch = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createMatch,
    isPending: isCreatingMatch,
    error: createMatchError,
  } = useMutation({
    mutationFn: MatchService.createMatch,
    onSuccess: () => {
      // Invalidate queries that should be refreshed after a match is created
      // For example, invalidate applications and matches for the recruiter view
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      // Potentially invalidate candidate's applications/matches view too if applicable
      // queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });

  return {
    createMatch,
    isCreatingMatch,
    createMatchError,
  };
};
