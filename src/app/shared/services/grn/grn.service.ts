import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { GRNDetails, GRN, GRNList } from '../../models/grn';

@Injectable({
    providedIn: "root"
})
export class GRNService {
    constructor(private dataService: DataService) { }

    getGRNDetails(grnId: Number) {
        return this.dataService.getRequest(API.GETGRNDETAILS(grnId)).then(res => {
            return res;
        });
    }

    viewGRN(organizationId: Number, purchaseOrderId: Number) {
        return this.dataService.getRequest(API.VIEWGRN(organizationId, purchaseOrderId)).then(res => {
            return res;
        });
    }

    addGRN(grn: GRNList) {
        return this.dataService.sendPostRequest(API.ADDGRN, grn).then(res => {
            return res;
        });
    }

    downloadGrnTempelate(projectId) {
        return this.dataService.getRequest(API.GRNDOWNLOADTEMPELATE(projectId))
    }

    uploadGrnTempelate(data, projectId) {
        return this.dataService.sendPostRequest(API.GRNUPLOADTEMPELATE(projectId), data)
    }

    getAllGRNData(projectIds){
        return this.dataService.getRequest(API.GET_ALL_GRN, projectIds).then(res => res);
    }
}
