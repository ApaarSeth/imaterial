import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  AllUserDetails,
  UserDetailsPopUpData
} from "../../models/user-details";
import { UserService } from "../../services/userDashboard/user.service";
import { Router } from "@angular/router";
import { BomService } from "../../services/bom/bom.service";

export interface City {
  value: string;
  viewValue: string;
}

export interface ProjectType {
  type: string;
}

export interface Unit {
  value: string;
}

@Component({
  selector: "delete-bom-dialog",
  templateUrl: "delete-bom-component.html"
})
export class DeleteBomComponent implements OnInit {
  constructor(
    private bomService: BomService,
    private dialogRef: MatDialogRef<DeleteBomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {}

  deactivateBomService() {
    this.bomService
      .deleteMaterial(this.data.materialId, this.data.projectId)
      .then(res => res.data);
  }

  cancel() {
    this.dialogRef.close({ data: "close" });
  }

  deactivateMaterial() {
    this.bomService
      .deleteMaterial(this.data.materialId, this.data.projectId)
      .then(res => {
        res.data;
        this.dialogRef.close(this.deactivateBomService());
      });
  }
}
