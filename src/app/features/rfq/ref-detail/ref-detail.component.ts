import { Component, OnInit, OnDestroy } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqList } from "src/app/shared/models/RFQ/rfq-details";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { CommonService } from 'src/app/shared/services/commonService';
import { Subscription } from 'rxjs';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';

@Component({
  selector: "app-ref-detail",
  templateUrl: "./ref-detail.component.html"
})
export class RefDetailComponent implements OnInit, OnDestroy {
  userId: number;
  constructor(
    private router: Router,
    private rfqService: RFQService,
    private commonService: CommonService,
    private advSearchService: AdvanceSearchService
  ) { }
  // submittedRfqList: RfqList[];
  nonSubmittedRfqListTemp: RfqList[];
  submittedRfqListTemp: RfqList[];

  isMobile: boolean;
  orgId: number;

  rfqCount: number;

  submittedRfqList: MatTableDataSource<RfqList>;
  nonSubmittedRfqList: MatTableDataSource<RfqList>;

  subscriptions: Subscription[] = [];

  isFilter: boolean;

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
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.getRFQDetails({ data: {} });
    this.getNotifications();
    this.startSubscriptions();
  }

  getRFQDetails(obj) {
    this.rfqService.rfqDetail(this.orgId, obj.data).then(res => {
      this.submittedRfqList = new MatTableDataSource(res.data.submittedRfqList);
      this.nonSubmittedRfqList = new MatTableDataSource(
        res.data.nonSubmittedRfqList
      );
      this.nonSubmittedRfqListTemp = res.data.nonSubmittedRfqList;
      this.submittedRfqListTemp = res.data.submittedRfqList;
      this.rfqCount = res.data.rfqCount;

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
  }

  startSubscriptions() {
    this.subscriptions.push(
      this.advSearchService.RFQFilterRequest$.subscribe(res => {
        this.getRFQDetails({ data: res });
        this.isFilter = false;
      }),
      this.advSearchService.RFQFilterExportRequest$.subscribe(res => {
        this.rfqService.postRFQExport(this.orgId, res).then(res => {
          if (res.data.url) {
            window.open(res.data.url);
          }
        });
        this.isFilter = false;
      })
    );
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

  ngOnDestroy() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  openFilter() {
    this.isFilter = true;
  }

  closeFilter() {
    this.isFilter = false;
  }

}
