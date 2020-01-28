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

//   export interface City {
//     value: string;
//     viewValue: string;
//   }

@Component({
  selector: "add-rfq-double-confirmation-dialog",
  templateUrl: "add-rfq-double-confirmation-component.html"
})
export class AddRFQConfirmationComponent implements OnInit {
  rfqDetails: AddRFQ;
  constructor(
    private dialogRef: MatDialogRef<AddRFQConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rfqService: RFQService
  ) {}

  ngOnInit() {
    this.rfqDetails = this.data;
    console.log("data", this.data);
  }

  close() {
    this.dialogRef.close();
  }

  addRFQ() {
    this.rfqService.addRFQ(this.data.dataKey).then(res => {
      res.data;
      this.close();
    });
  }
}