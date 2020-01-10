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
  checked: boolean;
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
}

export interface categoryNestedLevel {
  pid: string;
  materialGroup: string;
  child: material[];
}
