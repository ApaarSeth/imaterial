import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatChipInputEvent } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { stringify } from "querystring";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  RfqMat,
  RfqMaterialResponse
} from "src/app/shared/models/RFQ/rfq-details";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";

// chip static data
export interface Fruit {
  name: string;
}

@Component({
  selector: "rfq",
  templateUrl: "./quantity-makes.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class RFQQuantityMakesComponent implements OnInit {
  userId: 1;
  searchText: string = null;
  materialCounter = 0;
  buttonName: string = "addQueryMakes";
  checkedMaterialsList: RfqMaterialResponse[];
  materialForms: FormGroup;
  rfqMat: RfqMat;
  displayedColumns: string[] = [
    "Material Name",
    "Required Date",
    "Requested Quantity",
    "Estimated Quantity",
    "Estimated Rate",
    "Quantity",
    "Makes"
  ];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkedMaterialsList = history.state.checkedMaterials;
    if (this.checkedMaterialsList) {
      this.formsInit();
    }
  }
  setButtonName(name: string) {
    this.buttonName = name;
  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  formsInit() {
    console.log("form init", this.checkedMaterialsList);

    const temp = 0;
    const frmArr = this.checkedMaterialsList
      .map((subCat, i) => {
        if (i !== 0) {
          subCat.prevMatListLength = this.checkedMaterialsList[
            i - 1
          ].projectMaterialList.length;
        }
        return subCat.projectMaterialList.map(item => {
          return this.formBuilder.group({
            estimatedRate: [item.estimatedRate],
            quantity: [item.quantity, Validators.required],
            makes: [],
            projId: [item.projectId],
            matId: [item.materialId]
          });
        });
      })
      .flat();
    this.materialForms = this.formBuilder.group({});
    this.materialForms.addControl("forms", new FormArray(frmArr));
  }

  showIndent() {
    const formValues = this.materialForms.value.forms;
    console.log("form valueeee", formValues);
    this.checkedMaterialsList.forEach((subCat, i) => {
      subCat.projectMaterialList.forEach((project, j) => {
        formValues.forEach((val, k) => {
          if (
            project.projectId === val.projId &&
            project.materialId === val.matId
          ) {
            this.checkedMaterialsList[i].projectMaterialList[j].estimatedRate =
              val.estimatedRate;
            this.checkedMaterialsList[i].projectMaterialList[j].quantity =
              val.quantity;
            this.checkedMaterialsList[i].projectMaterialList[j].makes =
              val.makes;
          } else {
            return;
          }
        });
      });
    });
    let checkedMaterials = this.checkedMaterialsList;
    if (checkedMaterials) {
      this.router.navigate(["/rfq/suppliers"], {
        state: { checkedMaterials }
      });
    }
  }

  makesUpdate(data: string[], grpIndex: number) {

    const forms = this.materialForms.get("forms") as FormArray;
    forms.controls[grpIndex].get("makes").setValue(data);

  }


  openDialog(data: RfqMaterialResponse): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(AddAddressDialogComponent, {
        width: "1200px",
        data
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
}
