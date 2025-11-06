export type UUID = string;

export type Role = "USER" | "ADMIN" | "TESTER";

export interface User {
  id: UUID;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  homeUse: boolean;
  workUse: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  householdId?: UUID | null;
  workplaceId?: UUID | null;
  refreshToken?: string | null;
}

export interface Household {
  id: UUID;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Room {
  id: UUID;
  name: string;
  householdId: UUID;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Workplace {
  id: UUID;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Section {
  id: UUID;
  name: string;
  workplaceId: UUID;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Container {
  id: UUID;
  name: string;
  number?: number;
  image?: string | null;
  roomId?: UUID | null;
  sectionId?: UUID | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Obj {
  id: UUID;
  name: string;
  quantity: number;
  category?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  containersId: UUID;
}

export interface HouseholdRelations extends Household {
  users?: User[];
  rooms?: Room[];
}

export interface WorkplaceRelations extends Workplace {
  users?: User[];
  sections?: Section[];
}

export interface RoomContainers extends Room {
  containers?: Container[];
}

export interface SectionContainers extends Section {
  containers?: Container[];
}

export interface ContainerObjects extends Container {
  objects?: Obj[];
}
