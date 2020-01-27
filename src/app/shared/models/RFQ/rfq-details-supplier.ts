export interface SendRfqObj {
  projectId: number;
  projectName: string;
  materialList: MaterialRfqObj[];
}

export interface MaterialRfqObj {
  materialName: string;
  materialId: number;
  rfqBrandList: BrandRfqObj[];
  rfqDetailId: number;
}

export interface BrandRfqObj {
  brandName: string;
  brandId: string;
  brandRate: number;
  materialIgst: number;
  materialSgst: number;
  materialCgst: number;
}
