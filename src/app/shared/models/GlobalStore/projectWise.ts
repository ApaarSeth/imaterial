export interface ProjectWise{
  globalStoreProjectObj: ProjectwiseObj[];
  offset: number;
  pageNo: number;
  totalCount: number;
}

export interface ProjectwiseObj{
  projectMaterialList: projectwiseMaterialObj[]; 
  projectName: string;
}

export interface projectwiseMaterialObj{
  deliveredQty: number;
  directDeliveredQty: number;
  dueDate: Date;
  estimatedPrice: number;
  estimatedQty: number;
  indentQnt: number;
  issuedQty: number;
  materialCode: string;
  materialGroup: string;
  materialId: number;
  materialName: string;
  materialUnit: string;
  poAvailableQty: number;
  projectId: number;
  projectName: string;
}