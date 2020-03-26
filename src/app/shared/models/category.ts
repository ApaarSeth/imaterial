export interface categoryLevel {
  id: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  pid: string;
  materialCode: string;
  discription: string;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  basePrice: number;
  gst: number;
  alias: string;
  Specs: null;
  checked?: boolean;
}

export interface material {
  id: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  pid: string;
  materialCode: string;
  discription: string;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  basePrice: number;
  gst: number;
  alias: string;
  Specs: null;
  estimatedQty?: number;
  estimatedRate?: number;
  materialId?: number;
  treadId: number;
  tradeName: string;
  tradeList: string[]
}

export interface categoryNestedLevel {
  tradeName: string;
  groupName: string;
  materialList: material[];
  allNull?: boolean;
}
