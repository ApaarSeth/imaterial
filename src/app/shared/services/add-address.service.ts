import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { API } from "../constants/configuration-constants";
import { Address } from "../models/RFQ/rfq-details";

@Injectable({
  providedIn: "root"
})
export class AddAddressService {
  constructor(private dataService: DataService) { }

  postAddAddress(type: string, id: number, address: Address) {
    return this.dataService
      .sendPostRequest(API.POSTADDADDRESS(type, id), address)
      .then(res => {
        return res;
      });
  }

  postEditAddress(addressId: number, address: Address) {
    return this.dataService
      .sendPostRequest(API.POSTEDITADDRESS(addressId), address)
      .then(res => {
        return res;
      });
  }

  getPoAddAddress(type: string, id: number) {
    return this.dataService.getRequest(API.GETPOADDADDRESS(type, id));
  }
}
