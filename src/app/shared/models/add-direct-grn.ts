import { Subcategory } from './subcategory-materials';

export interface GrnFormMaterialList {
    materialName: string | Subcategory,
    materialUnit: string,
    deliveredQty: number,
    index: number,
    pendingQty: number,
    materialUnitPrice: number,
    amount: number
}

export interface GrnMaterialList {
    materialName: string,
    materialId: number,
    materialUnit: string,
    deliveredQty: number,
    materialUnitPrice: number,
    amount: number
}

