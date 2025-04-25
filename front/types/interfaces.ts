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
  candidate: User;
  jobPost: JobPost;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface JobSelectorProps {
  jobs: JobPost[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  type: "applications" | "matches";
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
  user: User | null;
  setUser: (user: User | null) => void;
  handleLogOut: () => void;
  loading: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  skills?: Skill[];
  role: "candidate" | "recruiter";
}

export type HandleRedirect = (role: "candidate" | "recruiter" | null) => void;

// Components
export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: ComponentProps<typeof Link>["href"];
};

export type ParallaxScrollViewProps = PropsWithChildren<{
  headerBackgroundColor?: string;
  headerImage?: any;
  headerHeight?: number;
}>;

// Skills
export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // Champs spécifiques aux candidats
  bio?: string;
  experienceYears?: number;
  preferedContract?: string;
  preferedJob?: string;
  location?: string;
  availability?: string;
  resumeID?: number;
  certifications?: number[];
  skills?: number[];
  // Champs spécifiques aux recruteurs
  title?: string;
  company?: number;
  newCompany?: {
    CompanyName: string;
    SIRET: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Certification {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export interface Match {
  id: string;
  user: User;
  jobPost: JobPost;
  createdAt: string;
}

export interface JobPost {
  id: string;
  title: string;
  location: string;
  contract_type: string;
  salary_range: string;
  expiration_date: string;
  skills?: Skill[];
  certifications?: Certification[];
  applications?: Application[];
  matches?: Match[];
}

export interface CreateJobPostDTO {
  description: string;
  title: string;
  location: string;
  contract_type: "CDI" | "CDD";
  salary_range: string;
  expiration_date: string;
  skills: number[];
  certifications: number[];
}
