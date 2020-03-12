import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/projectDashboard/project.service";
import { AddRFQ } from "../../models/RFQ/rfq-details";
import { RFQService } from "../../services/rfq/rfq.service";

@Component({
  selector: "add-rfq-double-confirmation-dialog",
  templateUrl: "add-rfq-double-confirmation-component.html"
})
export class AddRFQConfirmationComponent implements OnInit {
  rfqDetails: AddRFQ;
  selectBuildsupplyAsSupplier: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<AddRFQConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rfqService: RFQService
  ) { }

  ngOnInit() {
    this.rfqDetails = this.data;
  }

  close(data) {
    this.dialogRef.close(data);
  }

  addRFQ() {
    (<AddRFQ>this.data.dataKey).selectBuildsupplyAsSupplier = this.selectBuildsupplyAsSupplier
    this.rfqService.addRFQ(this.data.dataKey).then(res => {
      this.close(res);
    });
  }
}
