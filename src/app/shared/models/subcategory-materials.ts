import { MatTableDataSource } from "@angular/material/table";

export interface Subcategory {
  materialID: number;
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
  sum: number;
  requestedQuantity: number;
  checked: boolean;
  issueToProject: number;
  availableStock: number;

  // materials?: Materials[] | MatTableDataSource<Materials>;
}

export interface Materials {
  materialID: number;
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
  sum: number;
  requestedQuantity: number;
  checked: boolean;
  issueToProject: number;
  availableStock: number;
}
