import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { Observable, of } from "rxjs";
import { DataSource } from "@angular/cdk/table";
import { MatTableDataSource } from "@angular/material/table";
import { Data, ActivatedRoute, Router } from "@angular/router";
import { ProjectDetails, ProjetPopupData } from "../../../../shared/models/project-details";
import { Subcategory, Materials } from "../../../../shared/models/subcategory-materials";
import { AddRFQ, RfqMat } from "../../../../shared/models/RFQ/rfq-details";
import { permission } from "../../../../shared/models/permissionObject";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { PermissionService } from "../../../../shared/services/permission.service";
import { RFQService } from "../../../../shared/services/rfq.service";
import { ProjectService } from "../../../../shared/services/project.service";
import { MatDialog } from "@angular/material/dialog";
import { BomService } from "../../../../shared/services/bom.service";
import { IndentService } from "../../../../shared/services/indent.service";
import { GlobalLoaderService } from "../../../../shared/services/global-loader.service";
import { UserGuideService } from "../../../../shared/services/user-guide.service";
import { CommonService } from "../../../../shared/services/commonService";
import { AddMyMaterialBomComponent } from "../../../../shared/dialogs/add-my-material-Bom/add-my-material-bom.component";
import { AddGrnComponent } from "../../../../shared/dialogs/add-grn/add-grn.component";
import { AddGrnViaExcelComponent } from "../../../../shared/dialogs/addGrn-viaExcel/addGrnViaExcel.component";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatSort } from '@angular/material/sort';
import { AddProjectComponent } from "../../../../shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../../../../shared/dialogs/double-confirmation/double-confirmation.component";
import { IssueToIndentDialogComponent } from "../../../../shared/dialogs/issue-to-indent/issue-to-indent-dialog.component";
import { DeleteBomComponent } from "../../../../shared/dialogs/delete-bom/delete-bom.component";
import { ViewImageComponent } from "../../../../shared/dialogs/view-image/view-image.component";
import { UploadImageComponent } from "../../../../shared/dialogs/upload-image/upload-image.component";

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

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  projectId: number;
  projectData = {} as ProjectDetails;
  subcategoryData: Subcategory[] = [];
  subcategories: Subcategory[] = [];
  addRfq: AddRFQ;
  columnsToDisplay = ["materialName", 'materialUnit', "estimatedQty", "estimatedRate", "requestedQuantity", "issueToProject", "availableStock", "attachedImages", "customColumn"];
  innerDisplayedColumns = ["materialName", 'materialUnit', "estimatedQty", "estimatedRate", "requestedQuantity", "issueToProject", "availableStock", "attachedImages", "customColumn"];
  dataSource: MatTableDataSource<Subcategory>;
  sortedData: MatTableDataSource<Subcategory>;
  expandedElement: Subcategory | null;
  orgId: number;
  checkedSubcategory: Subcategory[] = [];
  permissionObj: permission;
  isMobile: boolean;

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
        title: 'Create RFP',
        selector: '.create-rfq-btn',
        content: 'Select material from the bill of materials and add it in RFP to receive the quotes.',
        orientation: Orientation.Left
      },
      {
        title: 'Issue to Indent',
        selector: '.issue-to-indent-icon',
        content: 'Click here to issue the available stock of material to the indents raised.',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    },
    completeCallback: () => {
      this.setLocalStorage()
    }
  };
  userId: number;
  role: string;

  constructor(
    private permissionService: PermissionService,
    private rfqService: RFQService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private bomService: BomService,
    private indentService: IndentService,
    private loading: GlobalLoaderService,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private commonService: CommonService
  ) {
  }
  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.getProject(this.projectId);
    this.getMaterialWithQuantity();
    const role = localStorage.getItem("role")
    this.permissionObj = this.permissionService.checkPermission(role);
  }


  setLocalStorage() {
    const popovers = {
      "userId": this.userId,
      "moduleName": "bomDashboard",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('bomDashboard', '1');
      }
    })
  }

  openAddMyMaterial() {
    let data = this.projectId
    const dialogRef = this.dialog.open(AddMyMaterialBomComponent, {
      width: "1400px",
      data,
      panelClass: ['common-modal-style', 'add-custom-material']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'done')
        this.getMaterialWithQuantity();
    })
  }


  getMaterialWithQuantity() {
    this.loading.show();
    this.bomService.getMaterialWithQuantity(this.orgId, this.projectId).then(res => {
      this.subcategories = res.data ? [...res.data] : null;
      if (this.subcategories) {
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
      }
      else {
        this.subcategoryData = null;
      }

      this.dataSource = new MatTableDataSource(this.subcategoryData);
      this.dataSource.sort = this.sort;

      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }

        return data[sortHeaderId];
      };

      // this.dataSource.sortingDataAccessor = (data, header) => data[header];
      this.getProject(this.projectId);
      this.loading.hide();
    });
  }

  openIssueTOIndent(element) {
    let check = Number(element.requestedQuantity) > 0 && Number(element.issueToProject) > 0 ? (Number(element.requestedQuantity) > Number(element.issueToProject) ? true : false) : true
    if (this.permissionObj.rfqFlag && check) {
      if (Number(element.availableStock) !== 0 || element.availableStock != null) {
        this.issueToIndent(element.materialId, this.projectId)
      }
    }
  }
  indentButtonColor(element) {
    let check = Number(element.requestedQuantity) > 0 && Number(element.issueToProject) > 0 ? (Number(element.requestedQuantity) > Number(element.issueToProject) ? true : false) : true
    if (this.permissionObj.rfqFlag && check) {
      if (element.availableStock === 0 || element.availableStock === null) {
        return '../../../../assets/images/issue_to_indent_disabled.png'
      }
      else {
        return '../../../../assets/images/issue_to_indent.png'
      }
    }
    else {
      return '../../../../assets/images/issue_to_indent_disabled.png'
    }
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
      if ((localStorage.getItem('bomDashboard') == "null") || (localStorage.getItem('bomDashboard') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.BomDetailsashboardTour);
        }, 1000);
      }
    });
  }

  openGrnDialog() {
    const dialogRef = this.dialog.open(AddGrnComponent, {
      width: "1000px",
      data: this.projectId,
      panelClass: ['common-modal-style', 'add-receipt-via-system']
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'success') {
        this.getMaterialWithQuantity()
      }
    })
  }

  openGrnViaExcelDialog() {
    const dialogRef = this.dialog.open(AddGrnViaExcelComponent, {
      width: "600px",
      data: this.projectId,
      panelClass: ['common-modal-style', 'create-receipt-excel']
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'success') {
        this.getMaterialWithQuantity()
      }
    })
  }

  raiseIndent() {
    if (this.checkedSubcategory.length) {
      let projectDetails = this.projectData;
      if (this.checkedSubcategory.length) {
        let checkedList = this.checkedSubcategory;
        this.indentService.raiseIndentData = checkedList;
        this.router.navigate(["/indent/" + this.projectId]);
      }
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
    if (this.checkedSubcategory.length) {
      let materialList: RfqMat[] = [];
      this.checkedSubcategory.forEach((category: Subcategory, i) => {
        let mat: RfqMat = {};
        mat.projectId = category.projectId;
        mat.materialId = category.materialId;
        mat.materialName = category.materialName;
        mat.requestedQty = category.requestedQuantity;
        mat.estimatedQty = category.estimatedQty;
        mat.estimatedRate = category.estimatedRate;
        mat.dueDate = category.dueDate;
        mat.fullfilmentDate = String(category.dueDate) === "" ? null : String(category.dueDate);
        mat.materialUnit = category.materialUnit;
        mat.documentList = category.documentsList;
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
        rfqStatus: null,
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
        if(res.data){
          this.router.navigate(["/rfq/createRfq", res.data.rfqId], {
            state: { rfqData: res, selectedIndex: 1 }
          });
        }
      });
    }

  }

  viewIndent() {
    this.router.navigate(["/indent/" + this.projectId + "/indent-detail"]);
  }


  addMaterial() {
    this.router.navigate(["/project-dashboard/bom/" + this.projectId]);
  }

  editMaterial() {
    this.router.navigate(["/project-dashboard/bom/" + this.projectId + "/edit-materials"]);
  }

  issueToIndent(materialId, projectId): void {
    if (IssueToIndentDialogComponent) {
      const dialogRef = this.dialog.open(IssueToIndentDialogComponent, {
        width: "1200px",
        data: { materialId: materialId, projectId: projectId },
        disableClose: true,
        panelClass: ['common-modal-style', "issue-to-indent-dialog"]
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== null) {
          this.getMaterialWithQuantity();
        }
      });
    }
  }

  openDeleteDialog(materialId, projectId): void {
    if (IssueToIndentDialogComponent) {
      const dialogRef = this.dialog.open(DeleteBomComponent, {
        width: "800px",
        data: { materialId: materialId, projectId: projectId },
        panelClass: ['common-modal-style', 'delete-bom']
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data == "close") {
        } else {
          this.getMaterialWithQuantity();
        }
      });
    }
  }

  deleteBom(materialId, projectId, disabledStatus) {
    if (disabledStatus != true) {
      this.openDeleteDialog(materialId, projectId);
    }
  }

  /**
   * function will call to open view image modal
   * @param id selected material id
   */
  viewAllImages(projectId, materialId) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      disableClose: true,
      width: "500px",
      panelClass: ['common-modal-style', 'view-image-modal'],
      data: {
        projectId,
        materialId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result);
      }
    });
  }

  uploadImage(selectedMaterial) {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      disableClose: true,
      width: "60vw",
      panelClass: ['common-modal-style', 'upload-image-modal'],
      data: selectedMaterial
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'addImages') {
        this.getMaterialWithQuantity();
      }
    });
  }
}
