import { ValidatorFn, AbstractControl } from '@angular/forms';
import { CountryCode } from './currency';

export interface ProjectDetails {
  addressLine1: string;
  addressLine2: string;
  area: number;
  city: string;
  cost: number;
  country: string;
  pinCode: string;
  state: string;
  type: string;
  projectId: number;
  projectName: string;
  userId: number;
  organizationId: number;
  addressShortname: string;
  addressType: string;
  createdAt: Date;
  createdBy: string;
  endDate: Date;
  gstNo: string;
  lowStockMaterialCount: string;
  materialCount: number;
  openIndentCount: number;
  pincode: string;
  primaryAddress: number;
  projectAddressId: number;
  purchaseOrderId?: number;
  purchaseOrderCost: string;
  purchaseOrderCount: string;
  startDate: Date;
  unit: string;
  matCount: number;
  checked?: boolean;
  imageUrl?: string;
  imageFileName?: string;
  callingCode?: string;
  costUnit?: string;
  countryId: number;
  selected?: boolean;
}

export interface ProjetPopupData {
  isDelete?: boolean;
  isEdit: boolean;
  detail?: ProjectDetails;
  countryList?: CountryCode[];
}

export interface ProjectIds {
  projectIds?: Array<Number>;
}

export interface AllCTCReportData{
  awardedAmount: number;
  deliveredAmount: number;
  estimatedAmount: number;
  paidAmount: number;
  projectDataList: AllCTCProjectData[];
  projectedCost: number;
}

export interface AllCTCProjectData{
  projectId: number;
  projectName: string;
  estimatedAmount: number;
  awardedAmount: number;
  deliveredAmount: number;
  paidAmount: number;
  projectedCost: number;
  materialCategoryDataList: MaterialCategoryDataList[];
}

export interface MaterialCategoryDataList{
  materialCategoryName: string;
  materialUnit: string;
  estimatedAmount: number;
  awardedAmount: number;
  deliveredAmount: number;
  projectedCost: number;
  materialCTCDataList: MaterialCTCDataList[];
}

export interface MaterialCTCDataList{
  materialCode: string;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  projectId: number;
  projectName: string;
  estimatedAmount: number;
  awardedAmount: number;
  deliveredAmount: number;
  pendingAmount: number;
  projectedCTC: number;
}

export class DateValidators {
  static dateLessThan(dateField1: string, dateField2: string, validatorField: { [ key: string ]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [ key: string ]: boolean } | null => {
      const date1 = c.get(dateField1).value;
      const date2 = c.get(dateField2).value;
      if ((date1 !== null && date2 !== null) && date1 > date2) {
        return validatorField;
      }
      return null;
    };
  }
}