import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  PODetailLists,
  PurchaseOrder
} from "src/app/shared/models/po-details/po-details-list";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { ProjetPopupData } from "src/app/shared/models/project-details";
import { DeleteDraftedPoComponent } from "src/app/shared/dialogs/delete-drafted-po/delete-drafted-po.component";
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { POService } from 'src/app/shared/services/po/po.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { permission } from 'src/app/shared/models/permissionObject';

@Component({
  selector: "po-detail-list",
  templateUrl: "./po-detail-list.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class PODetailComponent implements OnInit {
  poDetails: MatTableDataSource<PODetailLists>;

  poDraftedDetails: MatTableDataSource<PurchaseOrder>;
  poApprovalDetails: MatTableDataSource<PurchaseOrder>;
  acceptedRejectedPOList: MatTableDataSource<PurchaseOrder>;

  poDetailsTemp: PurchaseOrder[] = [];

  poDraftedDetailsTemp: PurchaseOrder[] = [];

  poApprovalDetailsTemp: PurchaseOrder[] = [];

  acceptedRejectedPOListTemp: PurchaseOrder[] = [];

  displayedColumns = [
    "PO Number",
    "Raised Date",
    "Supplier Name",
    "Total Material",
    "PO Amount",
    "Action"
  ];

  public PODetailTour: GuidedTour = {
    tourId: 'po-detail-tour',
    useOrb: false,

    steps: [
      {
        title: 'Create P.O.',
        selector: '.create-po-btn',
        content: 'Click here to create a purchase order by selecting the materials from a project.',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    }
  };
  userId: number;
  orgId: number;
  permissionObj: permission;
  constructor(
    private activatedRoute: ActivatedRoute,
    private poDetailService: POService,
    private permissionService: PermissionService,
    private route: Router,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    const role = localStorage.getItem("role")
    this.permissionObj = this.permissionService.checkPermission(role);
    this.PoData();
    this.getNotifications();
  }
  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  setLocalStorage() {
    const popovers = {
      "userId": this.userId,
      "moduleName": "po",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('po', '1');
      }
    })
  }

  PoData() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));

    this.poDetails = new MatTableDataSource(
      this.activatedRoute.snapshot.data.poDetailList
    );

    this.acceptedRejectedPOList = new MatTableDataSource(
      this.activatedRoute.snapshot.data.poDetailList.acceptedRejectedPOList
    );

    this.poDraftedDetails = new MatTableDataSource(
      this.activatedRoute.snapshot.data.poDetailList.draftedPOList
    );
    this.poApprovalDetails = new MatTableDataSource(
      this.activatedRoute.snapshot.data.poDetailList.sendForApprovalPOList
    );

    this.poDetailsTemp = this.activatedRoute.snapshot.data.poDetailList;
    this.poDraftedDetailsTemp = this.activatedRoute.snapshot.data.poDetailList.draftedPOList;
    this.poApprovalDetailsTemp = this.activatedRoute.snapshot.data.poDetailList.sendForApprovalPOList;
    this.acceptedRejectedPOListTemp = this.activatedRoute.snapshot.data.poDetailList.acceptedRejectedPOList;
    if (this.poApprovalDetailsTemp || this.poDraftedDetailsTemp || this.acceptedRejectedPOListTemp) {
      if ((localStorage.getItem('po') == "null") || (localStorage.getItem('po') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.PODetailTour);
        }, 1000);
      }
    }
    this.acceptedRejectedPOList = new MatTableDataSource(
      this.activatedRoute.snapshot.data.poDetailList.acceptedRejectedPOList
    );

    this.acceptedRejectedPOList.filterPredicate = (data, filterValue) => {
      const dataStr =
        data.approvedOn +
        data.poAmount.toString() +
        data.poName +
        data.poNumber.toString() +
        data.totalMaterials.toString() +
        data.poStatus +
        data.approvedBy;
      return dataStr.indexOf(filterValue) != -1;
    };

    this.poDraftedDetails.filterPredicate = (data, filterValue) => {
      const dataStr =
        data.approvedOn +
        data.poAmount.toString() +
        data.poName +
        data.poNumber.toString() +
        data.totalMaterials.toString() +
        data.poStatus +
        data.approvedBy;
      return dataStr.indexOf(filterValue) != -1;
    };

    this.poApprovalDetails.filterPredicate = (data, filterValue) => {
      const dataStr =
        data.approvedOn +
        data.poAmount.toString() +
        data.poName +
        data.poNumber.toString() +
        data.totalMaterials.toString() +
        data.poStatus +
        data.approvedBy;
      return dataStr.indexOf(filterValue) != -1;
    };

  }

  viewPO(purchaseOrderId) {
    this.route.navigate(["../../po/po-generate/" + purchaseOrderId + "/view"]);
  }
  viewPODEdit(purchaseOrderId) {
    this.route.navigate(["../../po/po-generate/" + purchaseOrderId + "/edit"]);
  }
  applyFilter(filterValue: string) {
    this.acceptedRejectedPOList.filter = filterValue.trim().toLowerCase();
    this.poDraftedDetails.filter = filterValue.trim().toLowerCase();
    this.poApprovalDetails.filter = filterValue.trim().toLowerCase();
  }

  deleteDraftedPo(element) {
    this.openDialogDeactiveUser({
      isEdit: false,
      isDelete: true,
      detail: element
    } as ProjetPopupData);
  }

  openDialogDeactiveUser(data: ProjetPopupData): void {
    const dialogRef = this.dialog.open(DeleteDraftedPoComponent, {
      width: "800px",
      data
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((data) => {
        this.poDetailService.getPODetails(this.orgId).then(data => {
          this.poDraftedDetails = new MatTableDataSource(data.data.draftedPOList);
          this.poDraftedDetailsTemp = data.data.draftedPOList
        });
        this.PoData();
      });
  }
  downloadPo(purchaseOrderId){
      this.poDetailService.downloadPo(purchaseOrderId).then(res => res);
  }
}
