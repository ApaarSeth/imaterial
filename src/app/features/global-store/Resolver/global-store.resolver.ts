import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { GlobalStoreService } from "src/app/shared/services/global-store.service";

@Injectable()

export class GlobalStoreResolver implements Resolve<any> {

  pageNo = 1;
  pageSize = 10;

  constructor(private globalStoreService: GlobalStoreService) { }

  resolve() {
    return this.globalStoreService.getMaterialWiseData(this.pageNo, this.pageSize).then(res => {
      return res;
    })
  }
}