import { MatTableDataSource } from "@angular/material/table";
import { ImageDocsLists } from "./PO/po-data";

export interface Subcategory {
  materialId: number;
  materialCode: string;
  projectId?: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedQty: number;
  estimatedRate: number;
  materialCustomFlag?: number;
  materialCustomId?: number;
  materialSubGroup?: string;
  materialSpecs?: Materials[] | MatTableDataSource<Materials>;
  sum?: number;
  requestedQuantity?: number;
  checked: boolean;
  issueToProject?: number;
  availableStock?: number;
  quantity?: number;
  dueDate?: Date;
  isApproved?: number;
  documentsList?: ImageDocsLists[];
  materialMasterId?: null;
  filteredData?: any;
}

export interface Materials {
  materialId: number;
  materialCode: string;
  projectID: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedQty: number;
  estimatedRate: number;
  materialCustomFlag: number;
  materialCustomID: number;
  materialSubGroup: string;
  materialSpecs?: Materials[] | MatTableDataSource<Materials>;
  sum?: number;
  requestedQuantity: number;
  checked: boolean;
  issueToProject: number;
  availableStock: number;
  documentsList: ImageDocsLists[];
  poAvailableQty?: number;
}

export interface QtyData {
  estimatedQty: number;
  materialCode: string;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedRate: null;
}

export interface CopyMaterials {
  materialId: null;
  materialMasterId: null;
  estimatedQty: number;
  materialCode: string;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedRate: number;
  checked: boolean;
  filteredData?: any;
}