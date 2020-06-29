import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ProjetPopupData, ProjectDetails } from "../../models/project-details";
import { Router } from '@angular/router';
import { UserService } from '../../services/userDashboard/user.service';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { AddProjectComponent } from '../add-project/add-project.component';

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
        private _userService: UserService,
        private _projectService: ProjectService
    ) { }

    ngOnInit() {
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
        // this.data = this.data;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    radioChange(event) {
        const id = event.value;
        const project = Object.entries(this.data).flat().filter(op => op.projectId === id);
        if (project[0].matCount === 0 || project[0].matCount === null) {
            this._router.navigate([`project-dashboard/bom/${project[0].projectId}`]);
        } else {
            this._router.navigate([`project-dashboard/bom/${project[0].projectId}/bom-detail`]);
        }
        this.closeDialog();
    }

    addProject() {

        this.closeDialog();

        let data = {
            isEdit: false,
            isDelete: false
        };

        const dialogRef = this._dialog.open(AddProjectComponent, {
            width: "1000px",
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            this._router.navigate(['/dashboard']);
        });
    }
}