import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { Observable, of } from "rxjs";
import { DataSource } from "@angular/cdk/table";
import { MatTableDataSource } from "@angular/material/table";
import { Data, ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { ProjectDetails, ProjetPopupData } from "src/app/shared/models/project-details";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { MatDialog, MatSnackBar, MatSort, MatCheckbox } from "@angular/material";
import { BomService } from "src/app/shared/services/bom/bom.service";
import { Subcategory, Materials } from "src/app/shared/models/subcategory-materials";
import { IssueToIndentDialogComponent } from "src/app/shared/dialogs/issue-to-indent/issue-to-indent-dialog.component";
import { Projects } from "src/app/shared/models/GlobalStore/materialWise";
import { DeleteBomComponent } from "src/app/shared/dialogs/delete-bom/delete-bom.component";
import { GlobalLoaderService } from "src/app/shared/services/global-loader.service";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { AddRFQ, RfqMat } from "src/app/shared/models/RFQ/rfq-details";
import { PermissionService } from "src/app/shared/services/permission.service";
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';

@Component({
  selector: "app-bom-table",
  templateUrl: "./bom-table.component.html",
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0", visibility: "hidden" })),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
    ])
  ]
})
export class BomTableComponent implements OnInit {
  projectId: number;
  projectData = {} as ProjectDetails;
  subcategoryData: Subcategory[] = [];
  subcategories: Subcategory[] = [];
  addRfq: AddRFQ;
  columnsToDisplay = ["materialName", "estimatedQty", "indentedQuantity", "issueToProject", "availableStock", "customColumn"];

  innerDisplayedColumns = ["materialName", "estimatedQty", "indentedQuantity", "issueToProject", "availableStock", "customColumn"];
  dataSource: MatTableDataSource<Subcategory>;
  sortedData: MatTableDataSource<Subcategory>;
  expandedElement: Subcategory | null;
  orgId: number;
  checkedSubcategory: Subcategory[] = [];
  permissionObj: {
    projectStoreFlag: boolean;
    globalStoreFlag: boolean;
    rfqFlag: boolean;
    purchaseOrderFlag: boolean;
    usersFlag: boolean;
    supplierFlag: boolean;
    projectEdit: boolean;
  };

     public BomDetailsashboardTour: GuidedTour = {
        tourId: 'bom-details-tour',
        useOrb: false,
        
        steps: [
            {
                title: 'Raise Indent',
                selector: '.raise-indent-btn',
                content: 'Select materials from the bill of materials for which the indents has to be raised.',
                orientation: Orientation.Left
                
            },
            {
                title: 'Create RFQ',
                selector:'.create-rfq-btn',
                content: 'Select material from the bill of materials and add it in RFQ to receive the quotes.',
                 orientation: Orientation.Left
            },
            {
              title:'Issue to Indent',
              selector:'.issue-to-indent-icon',
              content: 'Click here to issue the available stock of material to the indents raised.',
                 orientation: Orientation.Left
            }
        ]
    };


  constructor(
    private permissionService: PermissionService,
    private rfqService: RFQService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private bomService: BomService,

    private loading: GlobalLoaderService,
     private guidedTourService: GuidedTourService
  ) {
    setTimeout(() => {
            this.guidedTourService.startTour(this.BomDetailsashboardTour);
        }, 1000);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.orgId = Number(localStorage.getItem("orgId"));
    this.getProject(this.projectId);
    this.getMaterialWithQuantity();
    this.permissionObj = this.permissionService.checkPermission();
    // if (this.permissionObj.rfqFlag) {
    //   this.columnsToDisplay.push("availableStock");
    //   this.innerDisplayedColumns.push("availableStock");
    // }
    //this.product = history.state.projectDetails;
  }

  getMaterialWithQuantity() {
    this.loading.show();
    this.bomService.getMaterialWithQuantity(this.orgId, this.projectId).then(res => {
      this.subcategories = [...res.data];
      console.log(this.subcategories);
      this.subcategories.forEach(subcategory => {
        if (subcategory.materialSpecs && Array.isArray(subcategory.materialSpecs) && subcategory.materialSpecs.length) {
          this.subcategoryData = [
            // ...this.subcategoryData,
            {
              ...subcategory,
              materialSpecs: new MatTableDataSource(subcategory.materialSpecs)
            }
          ];
        } else {
          this.subcategoryData = this.subcategories;
        }
      });
      this.getProject(this.projectId);
      this.dataSource = new MatTableDataSource(this.subcategoryData);
      // this.dataSource = res.data;
      // this.dataSource.sort = this.sort;
      this.loading.hide();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  toggleRow(element: Subcategory) {
    element.materialSpecs && (element.materialSpecs as MatTableDataSource<Materials>).data.length
      ? (this.expandedElement = this.expandedElement === element ? null : element)
      : null;
    this.cd.detectChanges();
  }

  getProject(id: number) {
    this.projectService.getProject(this.orgId, id).then(data => {
      this.projectData = data.data;
    });
  }
  raiseIndent() {
    let projectDetails = this.projectData;
    // this.checkedSubcategory = this.subcategoryData.filter(sub => {
    //   if (sub.checked === true) {
    //     return sub;
    //   }
    // });
    if (this.checkedSubcategory.length) {
      let checkedList = this.checkedSubcategory;
      this.router.navigate(["/indent/" + this.projectId], {
        state: { checkedList }
      });
    }
  }
  getElemenetChecked(ch: MatCheckbox, element: Subcategory) {
    if (ch.checked) {
      element.checked = true;
      this.checkedSubcategory.push(element);
    } else {
      element.checked = false;
      this.checkedSubcategory = this.checkedSubcategory.filter(sub => {
        return sub.materialId !== element.materialId;
      });
    }
  }

  createRfq() {
    // this.checkedSubcategory = this.subcategoryData.filter(sub => {
    //   if (sub.checked === true) {
    //     return sub;
    //   }
    // });
    let materialList: RfqMat[] = [];
    this.checkedSubcategory.forEach((category: Subcategory, i) => {
      let mat: RfqMat = {};
      mat.projectId = category.projectId;
      mat.materialId = category.materialId;
      mat.materialName = category.materialName;
      mat.requestedQty = category.requestedQuantity;
      mat.estimatedQty = category.estimatedQty;
      mat.dueDate = category.dueDate;
      mat.materialUnit = category.materialUnit;
      materialList.push(mat);
    });
    let projectId = materialList[0].projectId;
    this.addRfq = {
      id: null,
      status: null,
      createdBy: null,
      createdAt: null,
      lastUpdatedBy: null,
      lastUpdatedAt: null,
      rfqId: null,
      rfq_status: null,
      rfqName: null,
      dueDate: null,
      supplierId: null,
      supplierDetails: null,
      rfqProjectsList: [
        {
          projectId: projectId,
          projectName: this.projectData.projectName,
          defaultAddress: {
            projectId: this.projectData.projectId,
            projectName: this.projectData.projectName,
            addressID: this.projectData.projectAddressId,
            addressShortname: this.projectData.addressShortname,
            addressLine1: this.projectData.addressShortname,
            addressLine2: this.projectData.addressLine2,
            city: this.projectData.city,
            state: this.projectData.state,
            pinCode: this.projectData.pinCode,
            country: this.projectData.country,
            gstNo: this.projectData.gstNo,
            addressType: this.projectData.addressType,
            projectAddressId: this.projectData.projectAddressId,
            projectdefaultAddressId: this.projectData.projectAddressId,
            primaryAddress: this.projectData.primaryAddress
          },
          projectMaterialList: [],
          projectAddressList: null,
          prevMatListLength: null
        }
      ],
      documentsList: null,
      terms: null
    };
    this.addRfq.rfqProjectsList[0].projectMaterialList = materialList;
    this.rfqService.addRFQ(this.addRfq).then(res => {
      this.router.navigate(["/rfq/createRfq", res.data.rfqId], {
        state: { rfqData: res, selectedIndex: 1 }
      });
      console.log(res.data);
    });
  }

  viewIndent() {
    this.router.navigate(["/indent/" + this.projectId + "/indent-detail"]);
  }

  editProject() {
    const data: ProjetPopupData = {
      isEdit: true,
      isDelete: false,
      detail: this.projectData
    };

    this.openDialog(data);
  }

  deleteProject() {
    const data: ProjetPopupData = {
      isEdit: false,
      isDelete: true,
      detail: this.projectData
    };

    this.openDialog(data);
  }

  openDialog(data: ProjetPopupData): void {
    if (data.isDelete == false) {
      const dialogRef = this.dialog.open(AddProjectComponent, {
        width: "1000px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => { });
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => { });
    }
  }
  addMaterial() {
    this.router.navigate(["/bom/" + this.projectId]);
  }

  issueToIndent(materialId, projectId): void {
    if (IssueToIndentDialogComponent) {
      const dialogRef = this.dialog.open(IssueToIndentDialogComponent, {
        width: "1200px",
        data: { materialId: materialId, projectId: projectId }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getMaterialWithQuantity();
        console.log("The dialog was closed");
      });
    }
  }

  openDeleteDialog(materialId, projectId): void {
    if (IssueToIndentDialogComponent) {
      const dialogRef = this.dialog.open(DeleteBomComponent, {
        width: "800px",
        data: { materialId: materialId, projectId: projectId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data == "close") {
          console.log("The dialog was closed");
        } else {
          this.getMaterialWithQuantity();
          console.log("The dialog was closed");
        }
      });
    }
  }

  deleteBom(materialId, projectId, disabledStatus) {
    if (disabledStatus != true) {
      this.openDeleteDialog(materialId, projectId);
    }
  }
}
