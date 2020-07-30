import { Component, OnInit } from '@angular/core';
import { ProjectDetails } from 'src/app/shared/models/project-details';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'selector-name',
    templateUrl: 'grn.component.html'
})

export class GrnComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder) { }
    allProjects: ProjectDetails[];
    projectIds: number[] = [];
    searchProject: string = ''
    form: FormGroup;

    ngOnInit() {
        this.allProjects = this.activatedRoute.snapshot.data.projectsList;
        this.formInit()
    }

    formInit() {
        this.form = this.formBuilder.group({
            selectedProject: [''],
            amountDisplay: ['Full figures']
        });
    }

    choosenProject() {
        this.projectIds = [];
        this.projectIds = this.form.value.selectedProject.map(
            selectedProject => String(selectedProject.projectId)
        );
        this.sendProjectSuppierData();
    }

    sendProjectSuppierData() {
        const obj = {
            "projectIdList": this.projectIds,
        }
        // this.reportService.getSupplierLiabilityReport(obj).then(res => {
        //     this.supplierLiabiltyReportData = res;
        // })
    }
}
