import { Validators } from '@angular/forms';
import { CommonService } from './../../../../shared/services/commonService';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ProjectDetails } from "../../../../shared/models/project-details";
import { Subcategory, Materials } from "../../../../shared/models/subcategory-materials";
import { ProjectService } from "../../../../shared/services/project.service";
import { BomService } from "../../../../shared/services/bom.service";

@Component({
    selector: "bom-edit-materials",
    templateUrl: "./bom-edit-materials.component.html",
    animations: [
        trigger("detailExpand", [
            state("collapsed", style({ height: "0px", minHeight: "0", visibility: "hidden" })),
            state("expanded", style({ height: "*", visibility: "visible" })),
            transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
        ])
    ]
})
export class BomEditMaterialComponent implements OnInit {
    projectId: number;
    projectData = {} as ProjectDetails;
    dataSource = new MatTableDataSource<Subcategory>();
    expandedElement: Subcategory | null;
    orgId: number;
    userId: number;
    role: string;
    allProjectsList: ProjectDetails[] = [];
    projectMaterialsList: Materials[] = [];

    form: FormGroup;
    materialUnits: string[] = [];
    matData: any;
    isMobile: boolean;
    curencyCode: string;

    constructor(
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private projectService: ProjectService,
        public dialog: MatDialog,
        private bomService: BomService,
        private formBuilder: FormBuilder,
        private router: Router,
        private commonService: CommonService
    ) {
        this.bomService.getMaterialUnit().then(res => {
            this.materialUnits = res.data;
        });
    }
    ngOnInit() {
        this.matData = this.route.snapshot.data.editMaterialsData;
        this.curencyCode = localStorage.getItem('currencyCode');
        this.route.params.subscribe(params => {
            this.projectId = params[ "id" ];
        });
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
        this.dataSource = new MatTableDataSource(this.matData);
        this.isMobile = this.commonService.isMobile().matches;
        this.getProject(this.projectId);
        this.formInit();
    }

    formInit() {
        const matCtrl = new FormArray([]);
        this.matData.forEach(mat => {
            matCtrl.push(this.setMaterialArr(mat));
        })
        this.form = this.formBuilder.group({
            material: matCtrl
        })
        // this.form.get('material').valueChanges.subscribe(data => {
        //     console.log(this.form);
        // });
    }

    setMaterialArr(data) {
        return this.formBuilder.group({
            materialId: [ data.materialId ],
            materialName: [ data.materialName ],
            materialUnit: [ data.materialUnit ],
            estimatedQty: [ data.estimatedQty, Validators.compose([ Validators.min(data.poAvailableQty && data.poAvailableQty > 0 ? data.poAvailableQty : 0), Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/) ]) ],
            materialCode: [ data.materialCode ],
            materialGroup: [ data.materialGroup ],
            materialMasterId: [ data.materialMasterId ],
            estimatedRate: [ data.estimatedRate, Validators.compose([ Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/) ]) ],
            requestedQuantity: [ data.requestedQuantity ],
            issueToProject: [ data.issueToProject ],
            availableStock: [ data.availableStock ]
        });
    }

    update() {
        if (this.form.valid) {
            const finalData = this.form.get('material').value.map(item => ({ ...item, estimatedQty: new Number(item.estimatedQty), estimatedRate: new Number(item.estimatedRate) }))
            console.log(finalData);
            this.bomService
                .sumbitCategory(this.userId, this.projectId, finalData)
                .then(res => {
                    this.router.navigate([ "project-dashboard/bom/" + this.projectId + "/bom-detail" ]);
                });
        }
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

    toggleRow(element: Subcategory) {
        element.materialSpecs && (element.materialSpecs as MatTableDataSource<Materials>).data.length
            ? (this.expandedElement = this.expandedElement === element ? null : element)
            : null;
        this.cd.detectChanges();
    }

    getIsDisableSearchUnit(v1, v2, v3) {
        let result = false;
        if (v1 > 0 || v2 > 0 || v3 > 0) {
            result = true;
        }
        return result;
    }

}
