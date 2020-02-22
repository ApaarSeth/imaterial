export interface SendRfqObj {
  dueDate: Date;
  projectList: ProjectRfqObj[];
}
export interface ProjectRfqObj {
  projectId: number;
  projectName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  gst: string;
  materialList: MaterialRfqObj[];
}

export interface MaterialRfqObj {
  materialName: string;
  materialId: number;
  rfqBrandList: BrandRfqObj[];
  //rfqDetailId: number;
  materialQuantity: number;
  materialUnit: string;
  materialIgst: number;
  materialSgst: number;
  materialCgst: number;
  materialIGSTFlag: boolean;
  materialGst?: number;
}

export interface BrandRfqObj {
  brandName: string;
  brandId: string;
  brandRate: number;
  brandAmount: number;
  brandRateFlag: boolean;
  rfqDetailId: number;
}
