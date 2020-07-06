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
}