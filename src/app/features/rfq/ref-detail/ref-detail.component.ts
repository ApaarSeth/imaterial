import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqList } from "src/app/shared/models/RFQ/rfq-details";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-ref-detail",
  templateUrl: "./ref-detail.component.html"
})
export class RefDetailComponent implements OnInit {
  constructor(private router: Router, private rfqService: RFQService) {}
  // submittedRfqList: RfqList[];
  nonSubmittedRfqListTemp: RfqList[];
  submittedRfqListTemp: RfqList[];

  submittedRfqList: MatTableDataSource<RfqList>;
  nonSubmittedRfqList: MatTableDataSource<RfqList>;

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
    let orgId = Number(localStorage.getItem("orgId"));
    this.rfqService.rfqDetail(orgId).then(res => {
      this.submittedRfqList = new MatTableDataSource(res.data.submittedRfqList);
      this.nonSubmittedRfqList = new MatTableDataSource(
        res.data.nonSubmittedRfqList
      );
      this.nonSubmittedRfqListTemp = res.data.nonSubmittedRfqList;
      this.submittedRfqListTemp = res.data.submittedRfqList;

      this.submittedRfqList.filterPredicate = (data, filterValue) => {
        const dataStr =
          data.rfqName +
          data.createdAt.toString() +
          data.rfqDueDate.toString() +
          data.projectCount.toString() +
          data.materialCount.toString();
        return dataStr.indexOf(filterValue) != -1;
      };

      this.nonSubmittedRfqList.filterPredicate = (data, filterValue) => {
        const dataStr =
          data.rfqName +
          data.createdAt.toString() +
          data.rfqDueDate.toString() +
          data.projectCount.toString() +
          data.materialCount.toString();
        return dataStr.indexOf(filterValue) != -1;
      };
    });
  }

  applyFilter(filterValue: string) {
    this.submittedRfqList.filter = filterValue.trim().toLowerCase();
    this.nonSubmittedRfqList.filter = filterValue.trim().toLowerCase();
  }

  viewRfq(element: RfqList) {
    if (element.rfqStatus === 0) {
      this.router.navigate(["../../rfq/createRfq"]);
    } else {
      this.router.navigate(["../../rfq/rfq-view", element.rfqId]);
    }
  }
}
