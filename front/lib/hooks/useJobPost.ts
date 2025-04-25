import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as JobPostService from "@/services/jobPost.service";
import { JobPost } from "@/types/interfaces";
import { useAuth } from "@/context/AuthContext";

export const useJobPost = () => {
  const queryClient = useQueryClient();
  const { role } = useAuth();

  // Query pour récupérer les offres d'emploi de l'entreprise (uniquement pour les recruteurs)
  const {
    data: jobPosts,
    isLoading: isLoadingJobPosts,
    error: jobPostsError,
    refetch: refetchJobPosts,
  } = useQuery({
    queryKey: ["jobPosts"],
    queryFn: JobPostService.getCompanyJobPosts,
    enabled: role === "recruiter",
  });

  // Query pour récupérer les offres d'emploi pour les candidats
  const {
    data: candidateJobPosts,
    isLoading: isLoadingCandidateJobPosts,
    error: candidateJobPostsError,
    refetch: refetchCandidateJobPosts,
  } = useQuery({
    queryKey: ["candidateJobPosts"],
    queryFn: JobPostService.getCandidateJobPosts,
    enabled: role === "candidate",
  });

  // Query pour récupérer les candidatures (uniquement pour les recruteurs)
  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: JobPostService.getCompanyApplications,
    enabled: role === "recruiter",
  });

  // Query pour récupérer les matches (uniquement pour les recruteurs)
  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: matchesError,
    refetch: refetchMatches,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: JobPostService.getCompanyMatches,
    enabled: role === "recruiter",
  });

  // Mutation pour créer une nouvelle offre d'emploi (uniquement pour les recruteurs)
  const {
    mutate: createJobPost,
    isPending: isCreatingJobPost,
    error: createJobPostError,
  } = useMutation({
    mutationFn: JobPostService.createJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
    },
  });

  return {
    jobPosts,
    isLoadingJobPosts,
    jobPostsError,
    refetchJobPosts,
    createJobPost,
    isCreatingJobPost,
    createJobPostError,
    applications,
    isLoadingApplications,
    applicationsError,
    refetchApplications,
    matches,
    isLoadingMatches,
    matchesError,
    refetchMatches,
    candidateJobPosts,
    isLoadingCandidateJobPosts,
    candidateJobPostsError,
    refetchCandidateJobPosts,
  };
};
