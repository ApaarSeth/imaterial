import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqList } from "src/app/shared/models/RFQ/rfq-details";

@Component({
  selector: "app-ref-detail",
  templateUrl: "./ref-detail.component.html"
})
export class RefDetailComponent implements OnInit {
  constructor(private rfqService: RFQService) {}
  openRfqList: RfqList[];
  closeRfqList: RfqList[];
  displayedColumns = [
    "RFQ Name",
    "Raised Date",
    "End Date",
    "Projects",
    "Total Material",
    "Total Supplier",
    "action1",
    "action2"
  ];
  ngOnInit() {
    let orgId=Number(localStorage.getItem("orgId"))
    this.rfqService.rfqDetail(orgId).then(res => {
      this.openRfqList = res.data.openRfqList;
      this.closeRfqList = res.data.closeRfqList;
    });
  }
}
