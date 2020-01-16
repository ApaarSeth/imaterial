import { GlobalMaterial, IndentMaterial } from "./materialWise";

export interface GlobalProject {
  ProjectGlobal: ProjectGlobal;
  GlobalMaterials: GlobalMaterials[];
}

export interface ProjectGlobal {
  id: number;
  status: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  projectId: number;
  organizationId: number;
  userID: number;
  projectName: string;
  type: string;
  area: number;
  cost: number;
  startDate: string;
  endDate: string;
  imageUrl: null;
  unit: string;
}

export interface GlobalMaterials {
  GlobalMaterial: GlobalMaterial;
  IndentMaterial: IndentMaterial[];
}
