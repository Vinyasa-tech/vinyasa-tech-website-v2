export interface CareerJob {
  id: string;
  databaseId: number;
  title: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  qualifications: string[];
  isActive: boolean;
}

export type ApplicationStatus =
  | "Submitted"
  | "Under Review"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Offer";

export interface Qualification {
  course: string;
  collegeName: string;
  year: string;
}

export interface CareerApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  candidateEmail: string;
  candidateName: string;
  phone?: string;
  qualifications?: Qualification[];
  experience?: string;
  technicalSkills?: string[];
  resumeName?: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface DemoCandidate {
  name: string;
  email: string;
}