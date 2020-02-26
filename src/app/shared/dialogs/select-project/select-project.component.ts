import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ProjetPopupData } from "../../models/project-details";
import { Router } from '@angular/router';

@Component({
    selector: "select-project",
    templateUrl: "select-project.component.html"
})

export class SelectProjectComponent implements OnInit {

    orgId: number;
    userId: number;

    constructor(
        private dialogRef: MatDialogRef<SelectProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
        private _router: Router
    ) { }

    ngOnInit() {
        this.orgId = Number(localStorage.getItem("orgId"));
        this.userId = Number(localStorage.getItem("userId"));
        console.log(this.data);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    radioChange(event) {
        const id = event.value;

        const project = Object.entries(this.data).flat().filter(op => op.projectId === id);
        
        if(project[0].matCount === 0){
            this._router.navigate([`bom/${project[0].projectId}`]);
        }else{
            this._router.navigate([`bom/${project[0].projectId}/bom-detail`]);
        }

        this.closeDialog();

    }
}