import type { Timestamp } from 'firebase/firestore';

export type OpportunityStage =
  | 'Lead Novo'
  | 'Contato Realizado'
  | 'Proposta Enviada'
  | 'Negociação';

export type OpportunityStatus = 'Em Andamento' | 'Ganho' | 'Perdido' | 'Pausado';

export type ActivityType = 'Ligação' | 'Reunião' | 'E-mail' | 'Visita';

export type UserRole = 'Vendas' | 'Supervisor' | 'Administrador';

export interface UserModel {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Timestamp;
}

export interface CompanyModel {
  name: string;
  cnpj: string;
  segment?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  phone2?: string;
  phone3?: string;
  email?: string;
  website?: string;
  createdAt: Timestamp;
  createdBy: string;
}

export type WithID<T> = T & { id: string };

export interface OpportunityModel {
  companyId: string;
  ownerId: string;
  pipelineId: string;
  title: string;
  stage: OpportunityStage;
  description?: string;
  status: OpportunityStatus;
  value?: number;
  products?: string[];
  createdAt: Timestamp;
  closedAt?: Timestamp;
  createdBy: string;
  lastUpdatedAt: Timestamp;
}

export interface ActivityModel {
  userId: string;
  opportunityId: string;
  companyId: string;
  type: ActivityType;
  description?: string;
  ocurredAt: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
}

export interface FileModel {
  id: string; // Unique identifier for the file
  companyId: string; // Foreign key to company
  opportunityId: string; // Foreign key to opportunity
  name: string; // Original filename (e.g., "contract.pdf")
  storagePath: string; // Path in Firebase Storage (e.g., "projects/project_abc123/contract.pdf")
  downloadUrl: string; // Public download URL from Firebase Storage
  uploadedBy: string; // User ID who uploaded the file
  uploadedAt: Timestamp; // Firestore Timestamp
  version: number; // Version number for tracking updates
}

export interface UserDailyStatsModel {
  userId: string;
  date: string; // Format: 'YYYY-MM-DD'
  calls: number;
  emails: number;
  meetings: number;
  opportunitiesCreated: number;
  opportunitiesClosedWon: number;
  opportunitiesClosedLost: number;
  activitiesCompleted: number;
}

export interface OrgMonthlyStatsModel {
  month: string; // Format: 'YYYY-MM'
  totalOpportunities: number;
  totalClosedWon: number;
  totalClosedLost: number;
  totalRevenue: number;
  totalActivities: number;
}
