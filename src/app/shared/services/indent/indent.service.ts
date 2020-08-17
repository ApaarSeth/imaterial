import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { IndentVO } from "../../models/indent";
import { Subcategory } from '../../models/subcategory-materials';

@Injectable({
  providedIn: "root"
})
export class IndentService {
  constructor(private dataService: DataService) { }

  raiseIndentData: Subcategory[]

  raiseIndent(projectId: Number, indentData: IndentVO[]) {
    return this.dataService.sendPostRequest(
      API.RAISEINDENT(projectId),
      indentData
    );
  }

  getIndentList(projectId: Number, data) {
    return this.dataService.sendPostRequest(API.GETINDENTLIST(projectId), data);
  }

  getSingleIndent(indentId: Number) {
    return this.dataService.getRequest(API.GETSINGLEINDENT(indentId)).then(res => {
      return res;
    });
  }

  postIndentExport(data) {
    return this.dataService.sendPostRequest(API.POSTINDENTEXPORTREQUEST, data).then(res => {
      return res;
    });
  }

}
