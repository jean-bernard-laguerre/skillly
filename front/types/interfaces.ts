import { PropsWithChildren, ComponentProps } from "react";
import {
  StyleProp,
  ViewStyle,
  OpaqueColorValue,
  ViewProps,
  TextProps,
} from "react-native";
import { SymbolWeight } from "expo-symbols";
import { IconSymbolName } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";

// Jobs and Applications
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
}

export interface JobSelectorProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  applications: Application[];
}

export interface ApplicationsListProps {
  applications: Application[];
  onStatusChange: (id: string, status: "accepted" | "rejected") => void;
  onBack: () => void;
}

// Job Offers
export interface JobCard {
  title: string;
  description: string;
}

export interface SwippedState {
  left: JobCard[];
  right: JobCard[];
}

// UI Components
export interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}

export interface ThemedTextProps {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
}

export interface ThemedViewProps {
  lightColor?: string;
  darkColor?: string;
}

export interface OverlayLabelProps {
  color: string;
}

// Auth
export interface AuthContextType {
  role: "candidate" | "recruiter" | null;
  setRole: (role: "candidate" | "recruiter" | null) => void;
  handleLogOut: () => void;
  loading: boolean;
}

export interface HandleRedirect {
  (role: string | null): void;
}

// Components
export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: ComponentProps<typeof Link>["href"];
};

export type ParallaxScrollViewProps = PropsWithChildren<{
  headerBackgroundColor?: string;
  headerImage?: any;
  headerHeight?: number;
}>;
