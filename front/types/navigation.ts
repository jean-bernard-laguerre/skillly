import { ReactNode } from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export interface TabNavigatorProps {
  role: "candidate" | "recruiter" | null;
}

export interface DrawerNavigatorProps {
  children: ReactNode;
}

export type TabParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Messages: undefined;
  Profile: undefined;
  Applications: undefined;
  JobOffers: undefined;
  Jobs: undefined;
  CandidateHome: undefined;
  RecruiterHome: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
