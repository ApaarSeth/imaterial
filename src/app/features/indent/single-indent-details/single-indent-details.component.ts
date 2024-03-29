import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectDetails, ProjetPopupData } from "../../../shared/models/project-details";
import { SingleIndentDetails } from "../../../shared/models/indent";
import { ProjectService } from "../../../shared/services/project.service";
import { MatDialog } from "@angular/material/dialog";
import { IndentService } from "../../../shared/services/indent.service";
import { AddProjectComponent } from "../../../shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../../../shared/dialogs/double-confirmation/double-confirmation.component";

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
}
