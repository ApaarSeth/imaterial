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
  RfqMat,
  AddRFQ
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
  @Input() rfq: AddRFQ;
  @Output() updatedRfq = new EventEmitter<AddRFQ>();

  userId: 1;
  searchProject: string = null;
  searchMaterial: string = null;
  materialCounter = 0;
  buttonName: string = "addQueryMakes";
  projectSelectedMaterials: RfqMaterialResponse[] = [];

  materialForms: FormGroup;
  rfqMat: RfqMat;
  displayedColumns: string[] = [
    "Material Name",
    "Required Date",
    "Requested Qty",
    "Estimated Qty",
    "Estimated Rate",
    "Quantity",
    "Makes"
  ];
  rfqId: any;
  rfqData: AddRFQ;
  message: string;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (history.state.rfqData) {
      this.rfqData = history.state.rfqData.data;
      this.projectSelectedMaterials =
        history.state.rfqData.data.rfqProjectsList;
      this.updatedRfq.emit(this.rfqData);
      // this.stepperForm.get("qty").setValue(history.state.rfqData.data);
    }
    // if (this.stepperForm.get("mat").value) {
    //   this.rfqData = this.stepperForm.get("mat").value;
    //   this.projectSelectedMaterials = this.stepperForm.get(
    //     "mat"
    //   ).value.rfqProjectsList;
    // }
    this.formsInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (this.stepperForm.get("mat").value) {
    //   this.projectSelectedMaterials = this.stepperForm.get(
    //     "mat"
    //   ).value.rfqProjectsList;
    // }
    if (this.rfq) {
      this.rfqData = this.rfq;
      this.projectSelectedMaterials = this.rfq.rfqProjectsList;
      this.formsInit();
    }
    // if (this.projectSelectedMaterials) {
    //   this.formsInit();
    // }
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
    this.materialForms.valueChanges.subscribe(val => {
      this.materialAdded();
    });
  }

  makesUpdate(data: string[], grpIndex: number) {
    const forms = this.materialForms.get("forms") as FormArray;
    if (data.length <= 4) {
      forms.controls[grpIndex].get("makes").setValue(data);
    } else {
      this.message = "Only 4 brands allowed";
    }
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
  getFormStatus() {
    return this.materialForms;
  }
  materialAdded() {
    const formValues = this.materialForms.value.forms;
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
      this.rfqData.rfqProjectsList = checkedMaterials;
      this.updatedRfq.emit(this.rfqData);
    }
  }
}
