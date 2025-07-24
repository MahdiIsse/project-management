export type Workspace = {
  id: string;
  title: string;
  description?: string | null;
  color?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  ownerId?: string | null;
  position: number;
};