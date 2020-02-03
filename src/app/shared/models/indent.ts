export interface IndentVO {
  indentId: number;
  materialId: number;
  projectId: number;
  requestStatus: number;
  dueDate: Date;
  quantity: number;
  unit: number;
  comments: string;
  createdAt: Date;
  createdBy: string;
  materialCount: number;
}

export interface AllIndentListVO {
  ongoingIndentList: Array<IndentVO>;
  completedIndentList: Array<IndentVO>;
}

export interface SingleIndentDetails {
  materialId: number,
  indentId: number,
  projectId: number,
  indentName: string,
  dueDate: string,
  quantity: number,
  materialCode: string,
  materialName: string,
  materialSubGroup: string,
  materialSpecs: string,
  materialGroup: string,
  materialUnit: string,
  availableStock: number,
  issuedQuantity: number,
  issuedDate: string,
  deliveredQuantity: number,
  deliveredDate: string
}