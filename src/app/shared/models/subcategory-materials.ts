import { MatTableDataSource } from "@angular/material/table";

export interface Subcategory {
  materialId: number;
  materialCode: string;
  projectId: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedQty: number;
  estimatedRate: number;
  materialCustomFlag: number;
  materialCustomId: number;
  materialSubGroup: string;
  materialSpecs?: Materials[] | MatTableDataSource<Materials>;
  sum: number;
  requestedQuantity: number;
  checked: boolean;
  issueToProject: number;
  availableStock: number;
  quantity: number;
  dueDate: Date;
  isApproved?: number;

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
}

export interface QtyData {
  estimatedQty: number;
  materialCode: string;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedRate: null;
}
