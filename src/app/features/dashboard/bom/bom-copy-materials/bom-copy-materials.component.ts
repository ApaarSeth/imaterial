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
import { Subcategory, Materials, CopyMaterials } from "src/app/shared/models/subcategory-materials";
import { IssueToIndentDialogComponent } from "src/app/shared/dialogs/issue-to-indent/issue-to-indent-dialog.component";
import { Projects } from "src/app/shared/models/GlobalStore/materialWise";
import { DeleteBomComponent } from "src/app/shared/dialogs/delete-bom/delete-bom.component";
import { GlobalLoaderService } from "src/app/shared/services/global-loader.service";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { AddRFQ, RfqMat } from "src/app/shared/models/RFQ/rfq-details";
import { PermissionService } from "src/app/shared/services/permission.service";
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { permission } from 'src/app/shared/models/permissionObject';
import { AddMyMaterialBomComponent } from 'src/app/shared/dialogs/add-my-material-Bom/add-my-material-bom.component';
import { IndentService } from 'src/app/shared/services/indent/indent.service';
import { AddGrnComponent } from 'src/app/shared/dialogs/add-grn/add-grn.component';
import { CommonService } from 'src/app/shared/services/commonService';
import { UploadImageComponent } from 'src/app/shared/dialogs/upload-image/upload-image.component';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';

@Component({
    selector: "bom-copy-materials",
    templateUrl: "./bom-copy-materials.component.html",
    animations: [
        trigger("detailExpand", [
            state("collapsed", style({ height: "0px", minHeight: "0", visibility: "hidden" })),
            state("expanded", style({ height: "*", visibility: "visible" })),
            transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
        ])
    ]
})
export class BomCopyMaterialComponent implements OnInit {
    projectId: number;
    projectData = {} as ProjectDetails;
    subcategoryData: Subcategory[] = [];
    subcategories: Subcategory[] = [];
    addRfq: AddRFQ;
    columnsToDisplay = ["materialName", 'unit', "estimatedQty", "unitRate"];
    innerDisplayedColumns = ["materialName", 'unit', "estimatedQty", "unitRate"];
    dataSource: MatTableDataSource<Subcategory>;
    sortedData: MatTableDataSource<Subcategory>;
    expandedElement: Subcategory | null;
    orgId: number;
    checkedSubcategory: Subcategory[] = [];
    permissionObj: permission;
    isMobile: boolean;
    userId: number;
    role: string;
    allProjectsList: ProjectDetails[] = [];
    projectMaterialsList: Materials[] = [];
    @ViewChild('allCh', { static: false }) allCh;
    searchText: string = null;

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
                selector: '.create-rfq-btn',
                content: 'Select material from the bill of materials and add it in RFQ to receive the quotes.',
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
        this.getAllProjects();
    }

    /**
     * @description to get all projects
     */
    getAllProjects(){
        this.projectService.getProjects(this.orgId, this.userId).then(res => {
            if(res.data){
                //to filter the selected project from the list of all projects
                this.allProjectsList = res.data.filter(project => project.projectName !== this.projectData.projectName)
            }
        })
    }

    /**
     * @description to get all materials of selected project in dropdown
     * @param projectId project id of selected project in dropdown list
     */
    getProjectMaterials(projectId: number){
        this.bomService.getMaterialWithQuantity(this.orgId, projectId).then(res => {
            this.projectMaterialsList = res.data;
            this.dataSource = new MatTableDataSource(res.data);
        })
    }

    /**
     * @description will execute when select or deselect any material
     * @param ch checkbox checked or not
     * @param element selected material data
     */
    getElemenetChecked(ch: MatCheckbox, element: any, type: string) {
        if(type === 'SelectAll'){
            if(ch.checked){
                element.filteredData.forEach(opt => {
                    opt.checked = true;
                    this.checkedSubcategory.push(opt);
                });
            }else{
                element.filteredData.forEach(opt => {
                    opt.checked = false;
                    this.checkedSubcategory = [];
                });
            }
        }else{
            if (ch.checked) {
                element.checked = true;
                this.checkedSubcategory.push(element);
            } else {
                this.allCh.checked = false;
                element.checked = false;
                this.checkedSubcategory = this.checkedSubcategory.filter(sub => {
                    return sub.materialId !== element.materialId;
                });
            }
        }
    }

    /**
     * @description after click on copy button, add all selected materials in existing project 
     */
    copySelectedMaterials(){
        let data = [];
        this.checkedSubcategory.forEach(mat => {
            const selectedMaterialData = {
                "materialId": null,
                "materialMasterId": null,
                "estimatedQty": mat.estimatedQty,
                "materialCode": mat.materialCode,
                "materialName": mat.materialName,
                "materialGroup": mat.materialGroup,
                "materialUnit": mat.materialUnit,
                "estimatedRate": mat.estimatedRate,
                "checked": mat.checked
            }
            data.push(selectedMaterialData);
        });

        this.bomService.sumbitCategory(this.userId, this.projectId, data).then(res => {
            if(res.status === 1){
                this.router.navigate(['/project-dashboard/bom/'+this.projectId+'/bom-detail']);
            }
        })
    }

    searchProject(e){
        this.allProjectsList.filter(proj => proj.projectName === e.value);
        console.log(this.allProjectsList);
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

            this.getProject(this.projectId);
            this.dataSource = new MatTableDataSource(this.subcategoryData);
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

    issueToIndent(materialId, projectId): void {
        if (IssueToIndentDialogComponent) {
            const dialogRef = this.dialog.open(IssueToIndentDialogComponent, {
                width: "1200px",
                data: { materialId: materialId, projectId: projectId }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.getMaterialWithQuantity();
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
}
