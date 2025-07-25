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
  candidate: {
    id: string;
    user_id: string;
    user: User;
    skills?: Skill[];
    certifications?: Certification[];
    bio?: string;
    experience_year?: number;
    prefered_contract?: string;
    prefered_job?: string;
    location?: string;
    availability?: string;
    resume_id?: number;
  };
  job_post_id: string;
  job_post: JobPost;
  state: "pending" | "matched" | "rejected" | "accepted";
  created_at: string;
  score?: number;
}

export interface JobSelectorProps {
  jobs: JobPost[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  type: "applications" | "matches";
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
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
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "candidate" | "recruiter";
  profile_candidate?: {
    bio: string;
    experienceYears: number;
    preferedContract: string;
    preferedJob: string;
    location: string;
    availability: string;
    resumeID: number;
    certifications: Certification[];
    skills: Skill[];
  };
  profile_recruiter?: {
    title: string;
    companyID: number;
    role: "admin" | "member";
    company?: {
      id: number;
      company_name: string;
      description?: string;
      industry?: string;
      web_site?: string;
      location?: string;
      logo?: string;
      size?: string;
      siret?: string;
    };
  };
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
  candidate: {
    id: string;
    user_id: string;
    user: User;
    skills?: Skill[];
    certifications?: Certification[];
  };
  jobPost: JobPost;
  matched_at: string;
}
export interface JobPost {
  id: string;
  title: string;
  location: string;
  contract_type: string;
  salary_range: string;
  expiration_date: string;
  created_at: string;
  skills?: Skill[];
  certifications?: Certification[];
  applications?: Application[];
  matches?: Match[];
  company?: { company_name?: string };
  description?: string;
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

export interface Chatroom {
  id: string;
  name: string;
  created_at: string;
  participants?: {
    candidate: any;
    recruiter: any;
  };
  jobPost?: any;
  lastMessage?: {
    content: string;
    sender: string;
    sent_at: string;
  };
}

export interface Message {
  sender: string;
  content: string;
  sent_at: string;
  room: string;
}
