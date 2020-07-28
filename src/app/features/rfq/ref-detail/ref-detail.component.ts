import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqList } from "src/app/shared/models/RFQ/rfq-details";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
  selector: "app-ref-detail",
  templateUrl: "./ref-detail.component.html"
})
export class RefDetailComponent implements OnInit {
  userId: number;
  constructor(private router: Router, private rfqService: RFQService, private commonService: CommonService) { }
  // submittedRfqList: RfqList[];
  nonSubmittedRfqListTemp: RfqList[];
  submittedRfqListTemp: RfqList[];

  isMobile: boolean;

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
    this.isMobile = this.commonService.isMobile().matches;
    let orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.rfqService.rfqDetail(orgId, {}).then(res => {
      this.submittedRfqList = new MatTableDataSource(res.data.submittedRfqList);
      this.nonSubmittedRfqList = new MatTableDataSource(
        res.data.nonSubmittedRfqList
      );
      this.nonSubmittedRfqListTemp = res.data.nonSubmittedRfqList;
      this.submittedRfqListTemp = res.data.submittedRfqList;

      this.submittedRfqList.filterPredicate = (data, filterValue) => {
        const dataStr =
          (data.rfqName != null) ? data.rfqName.toLowerCase() : '' +
            data.createdAt.toString() +
            // data.rfqDueDate.toString() +
            data.projectCount.toString() +
            data.materialCount.toString();
        return dataStr.indexOf(filterValue) != -1;
      };

      this.nonSubmittedRfqList.filterPredicate = (data, filterValue) => {
        if (data) {
          const dataStr =
            (data.rfqName != null) ? data.rfqName.toLowerCase() : '' +
              data.createdAt.toString() +
              //  data.rfqDueDate.toString() +
              data.projectCount.toString() +
              data.materialCount.toString();
          return dataStr.indexOf(filterValue) != -1;
        }
      };
    });
    this.getNotifications();
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  applyFilter(filterValue: string) {
    this.submittedRfqList.filter = filterValue.trim().toLowerCase();
    this.nonSubmittedRfqList.filter = filterValue.trim().toLowerCase();
  }

  viewRfq(element: RfqList) {
    if (element.rfqStatus === 0) {
      this.router.navigate([ "../../rfq/createRfq", element.rfqId ]);
    } else {
      this.router.navigate([ "../../rfq/rfq-view", element.rfqId ]);
    }
  }

  createRfq() {
    this.router.navigate([ "/rfq/createRfq" ]);
  }

}
