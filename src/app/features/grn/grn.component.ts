import { Component, OnInit } from '@angular/core';
import { ProjectDetails } from 'src/app/shared/models/project-details';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GRNService } from 'src/app/shared/services/grn.service';
import { AllProjectsGRNData } from 'src/app/shared/models/grn';
import { ShowDocumentComponent } from 'src/app/shared/dialogs/show-documents/show-documents.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'all-grn',
    templateUrl: 'grn.component.html'
})

export class GrnComponent implements OnInit {

    allProjects: ProjectDetails[];
    projectIds: number[] = [];
    searchProject: string = ''
    form: FormGroup;
    selectedIds: number[] = [];
    allProjectsGRNData: AllProjectsGRNData[] = [];
    noProjectDataFound: boolean;
    baseCurrency: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private _grnService: GRNService,
        private _dialog: MatDialog,
        private snackbar: MatSnackBar) { }

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
        this.selectedIds = this.form.value.selectedProject.map(selectedProject => selectedProject);
        if (this.selectedIds && this.selectedIds.length > 0) {
            const projectIds = {
                "ids": this.selectedIds
            }
            this._grnService.getAllGRNData(projectIds).then(res => {
                if (res.data !== "No data found") {
                    this.allProjectsGRNData = res.data;
                    this.noProjectDataFound = false;
                } else {
                    this.noProjectDataFound = true;
                    this.snackbar.open(res.data, "", {
                        duration: 2000,
                        panelClass: ["warning-snackbar"],
                        verticalPosition: "bottom"
                    });
                }
            });
        } else {
            this.allProjectsGRNData = [];
        }
    }

    openDocuments(data) {
        const dialogRef = this._dialog.open(ShowDocumentComponent, {
            width: "500px",
            data,
            panelClass: ['common-modal-style', 'show-docs-dialog']
        });
        dialogRef.afterClosed().toPromise().then(result => {
            if (result) {
                console.log(result);
            }
        });
    }
}
