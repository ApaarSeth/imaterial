export interface GlobalStoreObj{
  globalStoreMaterialObj: MaterialwiseObj;
  offset: number;
  pageNo: number;
  totalCount: number;
}

export class MaterialCommonObj{
  deliveredQty: number;
  directDeliveredQty: number;
  estimatedQty: number;
  indentQnt: number;
  issuedQty: number;
  materialGroup: string;
  materialName: string;
  materialUnit: string;
  poAvailableQty: number;
  dueDate: Date;
}

export interface MaterialwiseObj extends MaterialCommonObj{
  projectMaterialList: ProjectMaterialObj;
}

export interface ProjectMaterialObj extends MaterialCommonObj{
  estimatedPrice: number;
  materialCode: string;
  materialId: number;
  projectId: number;
  projectName: string;
  isIndent?: boolean;
}

export interface IndentObj{
  MaterialId: number;
  dueDate: Date;
  intendedQnt: number;
  issuedQnt: number;
}