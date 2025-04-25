import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as JobPostService from "@/services/jobPost.service";
import { JobPost } from "@/types/interfaces";

export const useJobPost = () => {
  const queryClient = useQueryClient();

  // Query pour récupérer les offres d'emploi de l'entreprise
  const {
    data: jobPosts,
    isLoading: isLoadingJobPosts,
    error: jobPostsError,
    refetch: refetchJobPosts,
  } = useQuery({
    queryKey: ["jobPosts"],
    queryFn: JobPostService.getCompanyJobPosts,
  });

  // Query pour récupérer les candidatures
  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: JobPostService.getCompanyApplications,
  });

  // Query pour récupérer les matches
  const {
    data: matches,
    isLoading: isLoadingMatches,
    error: matchesError,
    refetch: refetchMatches,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: JobPostService.getCompanyMatches,
  });

  // Mutation pour créer une nouvelle offre d'emploi
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
  };
};
