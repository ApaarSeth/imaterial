import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ProjetPopupData, ProjectDetails } from "../../models/project-details";
import { Router } from '@angular/router';
import { AddProjectComponent } from '../add-project/add-project.component';
import { CommonService } from '../../services/commonService';

@Component({
    selector: "select-project",
    templateUrl: "select-project.component.html"
})

export class SelectProjectComponent implements OnInit {

    orgId: number;
    userId: number;

    constructor(
        private dialogRef: MatDialogRef<SelectProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProjectDetails[] | ProjetPopupData[],
        private _router: Router,
        public _dialog: MatDialog,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    radioChange(event) {
        const id = event.value;
        const project = Object.entries(this.data).flat().filter(op => op.projectId === id);
        if (project[ 0 ].matCount === 0 || project[ 0 ].matCount === null) {
            this._router.navigate([ `project-dashboard/bom/${project[ 0 ].projectId}` ]);
        } else {
            this._router.navigate([ `project-dashboard/bom/${project[ 0 ].projectId}/bom-detail` ]);
        }
        this.closeDialog();
    }

    addProject() {
        this.closeDialog();
        this.commonService.getCountry().then(res => {
            let data = {
                isEdit: false,
                isDelete: false,
                countryList: res.data
            };
            const dialogRef = this._dialog.open(AddProjectComponent, {
                width: "1000px",
                data,
                panelClass: [ 'common-modal-style', 'add-project-dialog' ]
            });

            dialogRef.afterClosed().subscribe(result => {
                this._router.navigate([ '/dashboard' ]);
            });
        })
    }
}