import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { ProjectDetails, } from "src/app/shared/models/project-details";
import { BomService } from "src/app/shared/services/bom/bom.service";
import { Subcategory, Materials } from "src/app/shared/models/subcategory-materials";
import { MatDialog } from "@angular/material/dialog";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatSort } from '@angular/material/sort';

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
    columnsToDisplay = ["materialName", 'materialUnit', "estimatedQty", "estimatedRate"];
    innerDisplayedColumns = ["materialName", 'materialUnit', "estimatedQty", "estimatedRate"];
    dataSource: MatTableDataSource<Subcategory>;
    sortedData: MatTableDataSource<Subcategory>;
    expandedElement: Subcategory | null;
    orgId: number;
    checkedSubcategory: Subcategory[] = [];
    userId: number;
    role: string;
    allProjectsList: ProjectDetails[] = [];
    projectMaterialsList: Materials[] = [];
    @ViewChild('allCh', { static: false }) allCh;
    searchText: string = null;
    selectProjectType: string;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    constructor(
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        public dialog: MatDialog,
        private bomService: BomService
    ) {
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.projectId = params["id"];
        });
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
        this.getProject(this.projectId);
        this.getAllProjects();
    }

    /**
     * @description get current project info using projectId
     * @param id projectId
     */
    getProject(id: number) {
        this.projectService.getProject(this.orgId, id).then(data => {
            this.projectData = data.data;
        });
    }

    /**
     * @description to get all projects
     */
    getAllProjects() {
        this.projectService.getProjects(this.orgId, this.userId).then(res => {
            if (res.data) {
                //to filter the selected project from the list of all projects
                this.allProjectsList = res.data.filter(project => project.projectName !== this.projectData.projectName)
            }
        })
    }

    /**
     * @description to get all materials of selected project in dropdown
     * @param projectId project id of selected project in dropdown list
     */
    getProjectMaterials(projectId?: number, type?: string) {
        this.selectProjectType = type;
        this.bomService.getMaterialWithQuantity(this.orgId, projectId).then(res => {
            if(res.data){
                this.projectMaterialsList = res.data;
                this.dataSource = new MatTableDataSource(res.data);
                setTimeout(() => {
                    this.dataSource.sort = this.sort;
                    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
                        if (typeof data[sortHeaderId] === 'string') {
                        return data[sortHeaderId].toLocaleLowerCase();
                        }  
                        return data[sortHeaderId];
                    };
                });
            }
        })
    }

    /**
     * @description will execute when select or deselect any material
     * @param ch checkbox checked or not
     * @param element selected material data
     */
    getElemenetChecked(ch: MatCheckbox, element: any, type: string) {
        if (type === 'SelectAll') {
            if (ch.checked) {
                element.filteredData.forEach(opt => {
                    opt.checked = true;
                    this.checkedSubcategory.push(opt);
                });
            } else {
                element.filteredData.forEach(opt => {
                    opt.checked = false;
                    this.checkedSubcategory = [];
                });
            }
        } else {
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
    copySelectedMaterials() {
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
            if (res.status === 1) {
                this.router.navigate(['/project-dashboard/bom/' + this.projectId + '/bom-detail']);
            }
        })
    }

    searchProject(e) {
        this.allProjectsList.filter(proj => proj.projectName === e.value);
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
}
