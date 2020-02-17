import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import {
  RfqMaterialResponse,
  RfqMat
} from "src/app/shared/models/RFQ/rfq-details";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";

@Component({
  selector: "app-rfq-quantity-makes",
  templateUrl: "./rfq-quantity-makes.component.html"
})
export class RfqQuantityMakesComponent implements OnInit {
  @Input() projectMaterialsList: RfqMaterialResponse[];
  @Output() quantityAndMakes = new EventEmitter<RfqMaterialResponse[]>();
  @Input() stepperForm: FormGroup;

  userId: 1;
  searchText: string = null;
  materialCounter = 0;
  buttonName: string = "addQueryMakes";
  projectSelectedMaterials: RfqMaterialResponse[];
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

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log("this.projectMaterialsList", this.projectMaterialsList);
    this.projectSelectedMaterials = this.projectMaterialsList;
    if (this.projectSelectedMaterials) {
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
    console.log("form init", this.projectSelectedMaterials);
    const temp = 0;
    const frmArr = this.projectSelectedMaterials
      .map((subCat, i) => {
        if (i !== 0) {
          subCat.prevMatListLength = this.projectSelectedMaterials[
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
    this.projectSelectedMaterials.forEach((subCat, i) => {
      subCat.projectMaterialList.forEach((project, j) => {
        formValues.forEach((val, k) => {
          if (
            project.projectId === val.projId &&
            project.materialId === val.matId
          ) {
            this.projectSelectedMaterials[i].projectMaterialList[
              j
            ].estimatedRate = val.estimatedRate;
            this.projectSelectedMaterials[i].projectMaterialList[j].quantity =
              val.quantity;
            this.projectSelectedMaterials[i].projectMaterialList[j].makes =
              val.makes;
          } else {
            return;
          }
        });
      });
    });
    let checkedMaterials = this.projectSelectedMaterials;
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
      dialogRef.afterClosed().subscribe(result => {});
    }
  }
  materialAdded() {
    const formValues = this.materialForms.value.forms;
    console.log("form valueeee", this.projectSelectedMaterials);
    this.projectSelectedMaterials.forEach((project, i) => {
      project.projectMaterialList.forEach((material, j) => {
        formValues.forEach((val, k) => {
          if (
            material.projectId === val.projId &&
            material.materialId === val.matId
          ) {
            this.projectSelectedMaterials[i].projectMaterialList[
              j
            ].estimatedRate = val.estimatedRate;
            this.projectSelectedMaterials[i].projectMaterialList[j].quantity =
              val.quantity;
            this.projectSelectedMaterials[i].projectMaterialList[j].makes =
              val.makes;
          } else {
            return;
          }
        });
      });
    });
    let checkedMaterials = this.projectSelectedMaterials;
    if (checkedMaterials) {
      this.quantityAndMakes.emit(checkedMaterials);
    }
  }
}
