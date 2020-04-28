import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { API } from '../constants/configuration-constants';
@Injectable({
    providedIn: "root"
})
export class MyMaterialService {

    constructor(private dataService: DataService,
        private _router: Router) { }


    updateMyMaterial(data) {
        return this.dataService.sendPostRequest(API.UPDATEMYMATERIAL, data)
    }
}
