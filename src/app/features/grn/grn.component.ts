import { Component, OnInit } from '@angular/core';
import { ProjectDetails } from 'src/app/shared/models/project-details';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GRNService } from 'src/app/shared/services/grn/grn.service';
import { AllProjectsGRNData } from 'src/app/shared/models/grn';
import { ShowDocumentComponent } from 'src/app/shared/dialogs/show-documents/show-documents.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'all-grn',
    templateUrl: 'grn.component.html'
})

export class GrnComponent implements OnInit {

    allProjects: ProjectDetails[];
    projectIds: number[] = [];
    searchProject: string = ''
    form: FormGroup;
    allProjectsGRNData: AllProjectsGRNData[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private _grnService: GRNService,
        private _dialog: MatDialog) { }

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

    getProjectGRNData() {
        const selectedIds = this.form.value.selectedProject.map(selectedProject => selectedProject);
        if(selectedIds.length > 0){
            const projectIds = {
                "ids": selectedIds
            }
            this._grnService.getAllGRNData(projectIds).then(res => {
                this.allProjectsGRNData = res;
            });
        }
    }

    openDocuments(data) {
        const dialogRef = this._dialog.open(ShowDocumentComponent, {
            width: "500px",
            data
        });
        dialogRef.afterClosed().toPromise().then(result => {
            if (result) {
                // this.getGRNDetails(this.poId);
            }
        });
    }
}
