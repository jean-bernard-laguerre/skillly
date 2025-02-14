import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Public Components
import HomePage from "@/app";
import Login from "@/app/auth/login";
import Register from "@/app/auth/register";
// Components Candidate
import Dashboard from "@/app/(protected)/candidate/dashboard";
import JobOffers from "@/app/(protected)/candidate/jobOffers";
import CandidateHome from "@/app/(protected)/candidate";
// Components Recruiter
import RecruiterHome from "@/app/(protected)/recruiter";
import Jobs from "@/app/(protected)/recruiter/jobs";

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  role: "candidate" | "recruiter" | null;
}

function PublicTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Register} />
    </Tab.Navigator>
  );
}

function CandidateTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={CandidateHome} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Job Offers" component={JobOffers} />
    </Tab.Navigator>
  );
}

function RecruiterTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={RecruiterHome} />
      <Tab.Screen name="Jobs" component={Jobs} />
    </Tab.Navigator>
  );
}

export default function TabNavigator({ role }: TabNavigatorProps) {
  if (role === "candidate") {
    return <CandidateTabNavigator />;
  } else if (role === "recruiter") {
    return <RecruiterTabNavigator />;
  } else {
    return <PublicTabNavigator />;
  }
}
