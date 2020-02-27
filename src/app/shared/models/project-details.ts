import { ValidatorFn, AbstractControl } from '@angular/forms';

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
}

export interface ProjetPopupData {
  isDelete?: boolean;
  isEdit: boolean;
  detail?: ProjectDetails;
}

export interface ProjectIds {
  projectIds?: Array<Number>;
}


export class DateValidators {
    static dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const date1 = c.get(dateField1).value;
            const date2 = c.get(dateField2).value;
            if ((date1 !== null && date2 !== null) && date1 > date2) {
                return validatorField;
            }
            return null;
        };
    }
}