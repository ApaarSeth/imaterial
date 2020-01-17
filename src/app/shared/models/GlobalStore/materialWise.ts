export interface GlobalStoreMaterial {
  GlobalMaterial: GlobalMaterial;
  GlobalProject: GlobalProject[];
}

export interface GlobalMaterial {
  id: number;
  status: 0;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  materialId: number;
  materialCode: string;
  projectId: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  materialCustomFlag: null;
  materialCustomID: null;
  materialSubGroup: string;
  requestedQuantity: number;
  materialSpecs: null;
  checked: boolean;
  estimatedQty: number;
  estimatedPrice: null;
  matCount: number;
  sum?: number;
  nearDueDate?: string;
  availableQuantity?: null;
}
export interface GlobalProject {
  IndentMaterial: IndentMaterial[];
  Projects: Projects;
}

export interface IndentMaterial {
  id: number;
  status: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  indentMaterialID: number;
  indentID: number;
  materialID: number;
  dueDate: string;
  quantity: number;
  sum: number;
  materialUnit: string;
  comments: string;
  materialCount: number;
}
export interface Projects {
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
  sum?: number;
  nearDueDate?: string;
  indentMaterials?: IndentMaterial[];
}
