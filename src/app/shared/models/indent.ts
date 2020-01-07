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
