import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as MatchService from "@/services/match.service";
import { useAuth } from "@/context/AuthContext";

export const useMatch = () => {
  const queryClient = useQueryClient();
  const { role } = useAuth();

  // Query pour récupérer les matchs du candidat
  const {
    data: candidateMatches,
    isLoading: isLoadingCandidateMatches,
    error: candidateMatchesError,
    refetch: refetchCandidateMatches,
  } = useQuery({
    queryKey: ["candidateMatches"],
    queryFn: MatchService.getCandidateMatches,
    enabled: role === "candidate",
  });

  const {
    mutate: createMatch,
    isPending: isCreatingMatch,
    error: createMatchError,
  } = useMutation({
    mutationFn: MatchService.createMatch,
    onSuccess: () => {
      // Invalidate queries that should be refreshed after a match is created
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["candidateMatches"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });

  return {
    candidateMatches,
    isLoadingCandidateMatches,
    candidateMatchesError,
    refetchCandidateMatches,
    createMatch,
    isCreatingMatch,
    createMatchError,
  };
};
