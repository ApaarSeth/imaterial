import { AdvSearchOption, AdvSearchData, AdvSearchConfig } from '../../../shared/models/adv-search.model';
import { forkJoin } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq.service";
import { RfqList } from "src/app/shared/models/RFQ/rfq-details";
import { Router } from "@angular/router";
import { CommonService } from 'src/app/shared/services/commonService';
import { Subscription } from 'rxjs';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-rfq-detail",
  templateUrl: "./rfq-detail.component.html"
})
export class RfqDetailComponent implements OnInit {
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

  searchConfig: AdvSearchConfig;

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
    this.getSearchReady();
  }

  getSearchReady(): void {

    const options: AdvSearchOption[] = [
      {
        name: "Project Name",
        type: 'MULTI_SELECT_SEARCH',
        key: "projectIDList"
      }, {
        name: "Supplier Name",
        type: 'MULTI_SELECT_SEARCH',
        key: "supplierIDList"
      }, {
        name: "Material Name",
        type: 'MULTI_SELECT_SEARCH',
        key: "materialCodeList"
      }, {
        name: "Raised By",
        type: 'MULTI_SELECT_SEARCH',
        key: "userIDList"
      }, {
        name: "RFP Status",
        type: 'MULTI_SELECT',
        key: "rfqStatus"
      }, {
        name: "Raised Date",
        type: 'DATE',
        key: {
          "from": "rfqRaisedStartDate",
          "to": "rfqRaisedEndDate"
        }
      }, {
        name: "Expiry Date",
        type: 'DATE',
        key: {
          "from": "rfqExpiryStartDate",
          "to": "rfqExpiryEndDate"
        }
      }

    ]

    forkJoin([
      this.advSearchService.getProjects(this.orgId, this.userId), this.advSearchService.getSuppliers(this.orgId), this.advSearchService.getMaterials(), this.advSearchService.getAllUsers(this.orgId)]).toPromise().then(res => {
        options[0].data = res[0] as AdvSearchData[];
        options[1].data = res[1] as AdvSearchData[];
        options[2].data = res[2] as AdvSearchData[];
        options[3].data = res[3] as AdvSearchData[];
        options[4].data = this.advSearchService.getRFPBids() as AdvSearchData[];
        options[5].data = this.advSearchService.getRaisedDates() as AdvSearchData[];
        options[6].data = this.advSearchService.getRaisedDates() as AdvSearchData[];

        this.searchConfig = {
          title: "Advance Search",
          type: "RFQ",
          options
        }

      })

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


  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  applyFilter(filterValue: string) {
    this.submittedRfqList.filter = filterValue.trim().toLowerCase();
    this.nonSubmittedRfqList.filter = filterValue.trim().toLowerCase();
  }

  viewRfq(element: RfqList) {
    if (element.rfqStatus === 0) {
      this.router.navigate(["../../rfq/createRfq", element.rfqId]);
    } else {
      this.router.navigate(["../../rfq/rfq-view", element.rfqId]);
    }
  }

  createRfq() {
    this.router.navigate(["/rfq/createRfq"]);
  }

  openFilter() {
    this.isFilter = true;
  }

  closeFilter() {
    this.isFilter = false;
  }

  applySearch(data) {
    this.getRFQDetails({ data });
    this.isFilter = false;
  }

  applyExport(data) {
    this.rfqService.postRFQExport(this.orgId, data).then(res => {
      if (res.data.url) {
        window.open(res.data.url);
      }
    });
    this.isFilter = false;
  }

}
