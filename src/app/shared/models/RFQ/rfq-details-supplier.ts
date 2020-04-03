export interface SendRfqObj {
  dueDate: Date;
  quoteValidTill: Date;
  projectList: ProjectRfqObj[];
  terms?: any
}
export interface ProjectRfqObj {
  projectId: number;
  projectName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode?: string,
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
  Igst?: number;
  validGst?: boolean;
  materialCgst: number;
  materialIGSTFlag: boolean;
  materialGst?: number;
  fullfilmentDate?: string;
}

export interface BrandRfqObj {
  brandName: string;
  brandId: string;
  brandRate: number;
  brandAmount: number;
  brandRateFlag: boolean;
  validBrand?:boolean;
  rfqDetailId: number;
  tempRate?: number;
}
