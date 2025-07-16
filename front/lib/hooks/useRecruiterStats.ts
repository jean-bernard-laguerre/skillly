import { useMemo } from "react";
import { isToday, isThisWeek } from "@/utils/dateFormatter";

export interface RecruiterStatsData {
  jobPosts?: any[];
  applications?: any[];
  matches?: any[];
  user?: any;
}

export interface RecruiterStats {
  userName: string;
  companyName: string;
  activeJobPosts: number;
  totalJobPosts: number;
  newApplications: number;
  totalApplications: number;
  pendingApplications: number;
  currentMatches: number;
  newJobsThisWeek: number;
}

export const useRecruiterStats = ({
  jobPosts,
  applications,
  matches,
  user,
}: RecruiterStatsData): RecruiterStats => {
  return useMemo(() => {
    const userName = user?.first_name || "Recruteur";
    const companyName =
      user?.profile_recruiter?.company?.company_name || "Votre entreprise";

    // Date d'aujourd'hui pour les calculs
    const today = new Date().toDateString();

    // Offres actives (non expirées)
    const activeJobPosts =
      jobPosts?.filter((job) => {
        const expirationDate = new Date(job.expiration_date).toDateString();
        return new Date(expirationDate) >= new Date(today);
      }).length || 0;

    // Total des offres
    const totalJobPosts = jobPosts?.length || 0;

    // Extraire toutes les applications des job posts
    const allApplications =
      applications?.flatMap((jobPost) => jobPost.applications || []) || [];

    // Nouvelles candidatures (reçues aujourd'hui)
    const newApplications =
      allApplications.filter((app) => isToday(app.created_at)).length || 0;

    // Total des candidatures
    const totalApplications = allApplications.length || 0;

    // Candidatures en attente
    const pendingApplications =
      allApplications.filter((app) => app.state === "pending").length || 0;

    // Matches actuels - extraire des job posts avec matches
    const allMatches =
      matches?.flatMap((jobPost) => jobPost.matches || []) || [];
    const currentMatches = allMatches.length || 0;

    // Nouvelles offres créées cette semaine
    const newJobsThisWeek =
      jobPosts?.filter((job) => isThisWeek(job.created_at)).length || 0;

    return {
      userName,
      companyName,
      activeJobPosts,
      totalJobPosts,
      newApplications,
      totalApplications,
      pendingApplications,
      currentMatches,
      newJobsThisWeek,
    };
  }, [jobPosts, applications, matches, user]);
};
