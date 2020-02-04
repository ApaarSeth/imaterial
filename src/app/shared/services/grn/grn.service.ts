import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { GRNDetails, GRN } from '../../models/grn';

@Injectable({
    providedIn: "root"
})
export class GRNService {
    constructor(private dataService: DataService) { }

    getGRNDetails(grnId: Number) {
        return this.dataService.getRequest(API.GETGRNDETAILS(grnId)).then(res => {
            console.log("grn details", res);
            return res;
        });
    }

    viewGRN(organizationId: Number, purchaseOrderId: Number) {
        return this.dataService.getRequest(API.VIEWGRN(organizationId, purchaseOrderId)).then(res => {
            // console.log("view grn", res);
            return res;
        });
    }

    addGRN(organizationId: Number, purchaseOrderId: Number, grn: GRN[]) {
        return this.dataService.sendPostRequest(API.ADDGRN(organizationId, purchaseOrderId), grn).then(res => {
            console.log("ahsghafs", res);
        });
    }

}
