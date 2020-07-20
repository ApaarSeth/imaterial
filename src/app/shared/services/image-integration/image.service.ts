import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";

@Injectable({
  providedIn: "root"
})

export class ImageService {
  constructor(private dataService: DataService) { }

  uploadImage(data) {
    return this.dataService.sendPostRequest(API.UPLOAD_IMAGE, data).then(res => res);
  }

  getSelectedImages(projectId: number, materialId: number){
    return this.dataService.getRequest(API.VIEW_IMAGES(projectId, materialId));
  }

  getRfqUploadedImages(rfqId: number, materialId: number){
    return this.dataService.getRequest(API.GET_ALL_RFQ_IMAGES(rfqId, materialId));
  }

  getSupplierUploadedImages(rfqId: number, materialId: number, supplierId: number){
    return this.dataService.getRequest(API.GET_SUPPLIER_IMAGES(rfqId, materialId, supplierId));
  }

  downloadImage(data){
    return this.dataService.getRequest(API.DOWNLOAD_IMAGE, data).then(res => res);
  }

  uploadPOImage(data){
    return this.dataService.sendPostRequest(API.PO_ADD_IMAGES, data).then(res => res);
  }
}