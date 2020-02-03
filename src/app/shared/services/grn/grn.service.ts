import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { GRNDetails } from '../../models/grn';

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

    postGRNDetails(organizationId: Number, purchaseOrderId: Number, grnDetails: GRNDetails[]) {
        return this.dataService.sendPostRequest(API.POSTGRNDETAILS(organizationId, purchaseOrderId), grnDetails).then(res => {
            console.log("ahsghafs", res);
        });
    }

}
