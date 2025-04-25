import React from "react";
import { useAuth } from "@/context/AuthContext";
import CandidateProfile from "./candidate/Profile";
import RecruiterProfile from "./recruiter/Profile";

export default function Profile() {
  const { role } = useAuth();

  if (role === "candidate") {
    return <CandidateProfile />;
  } else if (role === "recruiter") {
    return <RecruiterProfile />;
  }

  return null;
}
