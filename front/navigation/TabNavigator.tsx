import { useAuth } from "@/context/AuthContext";
import CustomTabBar from "@/navigation/CustomTabBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Briefcase,
  Home,
  LogIn,
  MessageSquare,
  User,
  UserPlus,
  Users,
} from "lucide-react-native";
import React from "react";

// Public Components
import Login from "@/app/(auth)/login";
import Register from "@/app/(auth)/register";
import HomePage from "@/app/index";
// Components Profile
import Profile from "@/app/(protected)/index";
// Components Messages
import Messages from "@/app/(protected)/messages";
// Components Candidate
import CandidateHome from "@/app/(protected)/candidate";
import MyApplications from "@/app/(protected)/candidate/MyApplications";
import JobOffers from "@/app/(protected)/candidate/jobOffers";
// Components Recruiter
import RecruiterHome from "@/app/(protected)/recruiter";
import Applications from "@/app/(protected)/recruiter/Applications";
import Jobs from "@/app/(protected)/recruiter/jobs";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { role, loading } = useAuth();

  if (role === "candidate") {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6366f1",
          tabBarInactiveTintColor: "#94a3b8",
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="CandidateHome"
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
          name="MyApplications"
          component={MyApplications}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} />
            ),
            title: "Candidatures",
          }}
        />
        <Tab.Screen
          name="JobOffers"
          component={JobOffers}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Briefcase size={size} color={color} />
            ),
            title: "Offres",
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Messages}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MessageSquare size={size} color={color} />
            ),
            tabBarBadge: 1,
            title: "Messages",
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

  if (role === "recruiter") {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6366f1",
          tabBarInactiveTintColor: "#94a3b8",
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="RecruiterHome"
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
              <Briefcase size={size} color={color} />
            ),
            title: "Offres",
          }}
        />
        <Tab.Screen
          name="Applications"
          component={Applications}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} />
            ),
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
            tabBarBadge: 1,
            title: "Messages",
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

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="HomePage"
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
