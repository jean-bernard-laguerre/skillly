import React from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import CandidateProfile from "./candidate/Profile";
import RecruiterProfile from "./recruiter/Profile";

export default function Profile() {
  const { role } = useAuth();
  console.log("ROLE", role);

  if (role === "candidate") {
    return <CandidateProfile />;
  } else if (role === "recruiter") {
    return <RecruiterProfile />;
  }

  return null;
}
