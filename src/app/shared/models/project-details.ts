export interface ProjectDetails {
    addressLine1: string;
    addressLine2: string;
    area: string;
    city: string;
    cost: number;
    country: string;
    pinCode: number;
    state: string;
    type: string;
    projectId: number;
    projectName: string;
    userId: number;
}


export interface ProjetPopupData {
    isDelete?: boolean;
    isEdit: boolean;
    detail?:ProjectDetails
}