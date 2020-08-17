import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
    ProjectDetails,
    ProjetPopupData
} from "src/app/shared/models/project-details";
import { AddProjectComponent } from 'src/app/shared/dialogs/add-project/add-project.component';
import { DoubleConfirmationComponent } from 'src/app/shared/dialogs/double-confirmation/double-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { SingleIndentDetails } from 'src/app/shared/models/indent';
import { IndentService } from 'src/app/shared/services/indent/indent.service';

@Component({
    selector: "single-indent-details",
    templateUrl: "./single-indent-details.component.html"
})
export class SingleIndentDetailsComponent implements OnInit {

    product: ProjectDetails;
    projectId: number;
    indentId: number;
    singleIndentDetails: SingleIndentDetails;

    displayedColumns: string[] = [
        "Material Name",
        "Requested Quantity",
        "Issued Quantity",
        "Requested Date"
    ];
    orgId: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        private dialog: MatDialog,
        private indentService: IndentService
    ) { }

    ngOnInit() {
        this.orgId = Number(localStorage.getItem("orgId"))
        this.route.params.subscribe(params => {
            this.projectId = params["id"];
            this.indentId = params["indentId"];
        });
        this.getProject(this.projectId);
        this.getSingleIndentDetails(this.indentId);
    }

    getSingleIndentDetails(indentId: number) {
        this.indentService.getSingleIndent(indentId).then(data => {
            this.singleIndentDetails = data.data;
        });
    }

    getProject(id: number) {
        this.projectService.getProject(this.orgId, id).then(data => {
            this.product = data.data;
        });
    }

    editProject() {
        const data: ProjetPopupData = {
            isEdit: true,
            isDelete: false,
            detail: this.product
        };

        this.openDialog(data);
    }

    deleteProject() {
        const data: ProjetPopupData = {
            isEdit: false,
            isDelete: true,
            detail: this.product
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
                .then(result => {
                });
        } else if (data.isDelete == true) {
            const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
                width: "500px",
                data
            });

            dialogRef
                .afterClosed()
                .toPromise()
                .then(result => {
                });
        }
    }
}
