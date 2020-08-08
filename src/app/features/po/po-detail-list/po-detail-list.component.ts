import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { DownloadData } from 'src/app/shared/models/PO/po-data';
import { PaymentRecordComponent } from 'src/app/shared/dialogs/payment-record/paymentRecord.component';
import { AppNotificationService } from 'src/app/shared/services/app-notification.service';
import { Subscription } from 'rxjs';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';

@Component({
  selector: "po-detail-list",
  templateUrl: "./po-detail-list.component.html",
  styleUrls: [ "../../../../assets/scss/main.scss" ]
})
export class PODetailComponent implements OnInit, OnDestroy {
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

  isMobile: boolean;
  poCount: number;

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
  subscriptions: Subscription[] = [];
  isFilter: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private poDetailService: POService,
    private permissionService: PermissionService,
    private route: Router,
    private notifier: AppNotificationService,
    private poService: POService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private commonService: CommonService,
    private advSearchService: AdvanceSearchService
  ) {
  }

  ngOnInit() {
    const role = localStorage.getItem("role")
    this.permissionObj = this.permissionService.checkPermission(role);
    this.isMobile = this.commonService.isMobile().matches;
    this.PoData();
    this.getNotifications();
    this.startSubscriptions();
  }

  startSubscriptions() {
    this.subscriptions.push(
      this.advSearchService.POFilterRequest$.subscribe(res => {
        this.poDetailService.getPODetails(res).then(data => {
          this.poDraftedDetails = new MatTableDataSource(data.data.draftedPOList);
          this.poCount = data.data.poCount;
          this.acceptedRejectedPOList = new MatTableDataSource(data.data.acceptedRejectedPOList);
          this.poApprovalDetails = new MatTableDataSource(data.data.sendForApprovalPOList);

          this.poDetailsTemp = data.data;
          this.poDraftedDetailsTemp = data.data.draftedPOList;
          this.poApprovalDetailsTemp = data.data.sendForApprovalPOList;
          this.acceptedRejectedPOListTemp = data.data.acceptedRejectedPOList;
        });
        this.isFilter = false;
      }),
      this.advSearchService.POFilterExportRequest$.subscribe(res => {
        this.poService.postPOExport(res).then(res => {
          if (res.data.url) {
            window.open(res.data.url);
          }
        });
        this.isFilter = false;
      })
    )
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

    this.poCount = this.activatedRoute.snapshot.data.poDetailList.poCount;

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
        data.supplierName.toLowerCase() +
        data.poNumber.toString().trim().toLowerCase() +
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
        data.supplierName.toLowerCase() +
        data.poNumber.toString().trim().toLowerCase() +
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
        data.supplierName.toLowerCase() +
        data.poNumber.toString().trim().toLowerCase() +
        data.totalMaterials.toString() +
        data.poStatus +
        data.approvedBy;
      return dataStr.indexOf(filterValue) != -1;
    };

  }

  viewPO(purchaseOrderId) {
    this.route.navigate([ "./po-generate/" + purchaseOrderId + "/view" ]);
  }
  viewPODEdit(purchaseOrderId) {
    this.route.navigate([ "./po-generate/" + purchaseOrderId + "/edit" ]);
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

  copyPo(poId: number) {
    this.poService.getCopyPo(poId).then(res => {
      if (res.statusCode === 201) {
        this.poDetailService.getPODetails({}).then(data => {
          this.poDraftedDetails = new MatTableDataSource(data.data.draftedPOList);
        });
        this.PoData();
        this.notifier.snack(res.message)
      } else {
        this.notifier.snack(res.message, 8000)
      }
    }).catch(err => {
      this.notifier.snack(err.message)
    })
  }

  viewGrn(purchaseOrderId) {
    this.route.navigate([ "po/view-grn/" + purchaseOrderId ]);
  }

  openPaymentRecord(poDetail: PurchaseOrder) {
    this.poService.paymentDetail(poDetail.purchaseOrderId).then(res => {
      let data = {
        poDetail,
        paymentDetail: res.data[ 0 ]
      }
      const dialogRef = this.dialog.open(PaymentRecordComponent, {
        width: "800px",
        data
      });
    })

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
        this.poDetailService.getPODetails({}).then(data => {
          this.poDraftedDetails = new MatTableDataSource(data.data.draftedPOList);
          this.poDraftedDetailsTemp = data.data.draftedPOList
        });
        this.PoData();
      });
  }
  downloadPo(purchaseOrderId) {
    this.poDetailService.downloadPo(purchaseOrderId).then(res => {
      this.downloadFile(res.data);
    });
  }
  downloadFile(data: DownloadData) {
    var win = window.open(data.url, '_blank');
    win.blur();
    setTimeout(win.focus, 0);
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
