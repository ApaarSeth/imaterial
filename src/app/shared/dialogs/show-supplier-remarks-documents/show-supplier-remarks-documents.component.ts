import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/projectDashboard/project.service";
import { FieldRegExConst } from "../../constants/field-regex-constants";
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';
import { Router } from '@angular/router';
import { AppNavigationService } from '../../services/navigation.service';
import { FacebookPixelService } from '../../services/fb-pixel.service';

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
  selector: "show-supplier-remarks-documents-dialog",
  templateUrl: "show-supplier-remarks-documents.component.html"
})
export class ShowSupplierRemarksandDocs implements OnInit {

  form: FormGroup;
  startDate = new Date(1990, 0, 1);
  endDate = new Date(2021, 0, 1);
  minDate = new Date();
  projectDetails: ProjectDetails;
  orgId: number;
  userId: number;
  selectedConstructionUnit: String;
  startstring: string;
  sameStartEndDate: boolean = false;
  endstring: string;
  localImg: string | ArrayBuffer;
  city: string;
  state: string;
  validPincode: boolean = null;
  pincodeLength: number;
  imageFileSizeError: string = "";
  imageFileSize: boolean = false;

  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<ShowSupplierRemarksandDocs>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private _uploadImageService: DocumentUploadService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private navService: AppNavigationService,
    private fbPixel: FacebookPixelService
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

}