import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Briefcase,
  Building2,
  User,
  MessageSquare,
  Users,
} from "lucide-react-native";
import { TabNavigatorProps } from "@/types/navigation";

// Public Components
import HomePage from "@/app/index";
import Login from "@/app/(auth)/login";
import Register from "@/app/(auth)/register";
// Components Profile
import Profile from "@/app/(protected)/index";
// Components Messages
import Messages from "@/app/(protected)/messages";
// Components Candidate
import MyApplications from "@/app/(protected)/candidate/MyApplications";
import JobOffers from "@/app/(protected)/candidate/jobOffers";
import CandidateHome from "@/app/(protected)/candidate";
// Components Recruiter
import RecruiterHome from "@/app/(protected)/recruiter";
import Jobs from "@/app/(protected)/recruiter/jobs";
import Applications from "@/app/(protected)/recruiter/Applications";

const Tab = createBottomTabNavigator();

function PublicTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366f1", // Couleur indigo pour l'état actif
        tabBarInactiveTintColor: "#94a3b8", // Couleur grise pour l'état inactif
      }}
    >
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          title: "Accueil",
        }}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarIcon: ({ color, size }) => <LogIn size={size} color={color} />,
          title: "Connexion",
        }}
      />
      <Tab.Screen
        name="Register"
        component={Register}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserPlus size={size} color={color} />
          ),
          title: "Inscription",
        }}
      />
    </Tab.Navigator>
  );
}

function CandidateTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen
        name="CandidateHome"
        component={CandidateHome}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          title: "Accueil",
        }}
      />
      <Tab.Screen
        name="Applications"
        component={MyApplications}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
          title: "Mes candidatures",
        }}
      />
      <Tab.Screen
        name="JobOffers"
        component={JobOffers}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Briefcase size={size} color={color} />
          ),
          title: "Offres d'emploi",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
          title: "Messages",
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: "red", color: "white" },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          title: "Profil",
        }}
      />
    </Tab.Navigator>
  );
}

function RecruiterTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen
        name="RecruiterHome"
        component={RecruiterHome}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          title: "Accueil",
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={Jobs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Building2 size={size} color={color} />
          ),
          title: "Offres d'emploi",
        }}
      />
      <Tab.Screen
        name="Applications"
        component={Applications}
        options={{
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          title: "Candidatures",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
          title: "Messages",
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: "red", color: "white" },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          title: "Profil",
        }}
      />
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
