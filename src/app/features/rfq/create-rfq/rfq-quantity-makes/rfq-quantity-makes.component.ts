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
  AddRFQ,
  Address
} from "src/app/shared/models/RFQ/rfq-details";
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, AbstractControl } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { AddAddressPoDialogComponent } from "src/app/shared/dialogs/add-address-po/add-addressPo.component";
import { CommonService } from 'src/app/shared/services/commonService';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { UploadImageComponent } from 'src/app/shared/dialogs/upload-image/upload-image.component';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';

@Component({
  selector: "app-rfq-quantity-makes",
  templateUrl: "./rfq-quantity-makes.component.html"
})
export class RfqQuantityMakesComponent implements OnInit {
  @Input() generatedRfq: AddRFQ;
  @Output() updatedRfq = new EventEmitter<AddRFQ>();
  userId: 1;
  searchProject: string = null;
  searchMaterial: string = null;
  materialCounter = 0;
  buttonName: string = "addQueryMakes";
  projectSelectedMaterials: RfqMaterialResponse[] = [];
  updatedAddress: Address;
  materialForms: FormGroup;
  rfqMat: RfqMat;
  displayedColumns: string[] = [
    "Material Name",
    "Estimated Qty",
    "Requested Qty",
    "Fullfillment Date",
    "Estimated Rate",
    "Quantity",
    "Makes",
    "Attached Images"
  ];
  rfqId: any;
  startDate: Date;
  rfqData: AddRFQ = {} as AddRFQ;
  message: string;
  lastupdateValue: any;
  valid: boolean = false;
  primaryCurrencyCode: string;
  minDate = new Date();
  isMobile: boolean;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private commonService: CommonService

  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.primaryCurrencyCode = localStorage.getItem('currencyCode')
    this.startDate = new Date();
    // this.formsInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.generatedRfq && changes.generatedRfq.currentValue) {
      this.rfqData = this.generatedRfq as AddRFQ;
      this.projectSelectedMaterials = this.rfqData.rfqProjectsList;
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
  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

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
          let fullfilmentDate = item.fullfilmentDate ? (new Date(item.fullfilmentDate) < new Date() ? null : item.fullfilmentDate) : null;
          return this.formBuilder.group({
            estimatedRate: [ item.estimatedRate, Validators.pattern(FieldRegExConst.RATES) ],
            quantity: [ item.quantity ? item.quantity : null, [ Validators.required, this.quantityCheck(item.estimatedQty) ] ],
            makes: [ item.makes ],
            fullfilmentDate: [ fullfilmentDate ],
            projId: [ item.projectId ],
            matId: [ item.materialId ],
          });
        });
      })
      .flat();
    this.materialForms = this.formBuilder.group(
      { forms: this.formBuilder.array(frmArr) }

    );
    //  this.materialForms.addControl("forms", new FormArray(frmArr));
    this.materialForms.valueChanges.subscribe(val => {
    })
  }

  dateCheck(): ValidatorFn {
    return (control: AbstractControl): { [ key: string ]: boolean } | null => {
      if (control.value) {
        if (new Date(control.value) < new Date()) {
          control.setValue(null)
          return { 'date Is useless': true };
        }
      }
      return null;
    }
  }

  getMaterialLength(): ValidatorFn {
    return (formGroup: FormGroup): { [ key: string ]: boolean } | null => {
      let checked = false;
      checked = (<FormArray>formGroup.get('forms')).controls.every((val: FormGroup) => {
        return Number(val.value.quantity) > 0
      })
      // for (let key of Object.keys((<FormArray>formGroup.get('forms')).controls)) {
      //   const control: FormArray = (<FormArray>formGroup.get('forms')).controls[key] as FormArray;
      //   checked = control.value.quantity > 0
      //   if (checked) {
      //     break;
      //   }
      // }
      // if (control.value) {
      //   checked++;
      // }

      if (!checked) {
        return {
          requireCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }


  quantityCheck(estimatedQty: number): ValidatorFn {
    return (control: AbstractControl): { [ key: string ]: boolean } | null => {
      if (estimatedQty < control.value) {
        this._snackBar.open(
          "Cannot add quantity greater than estimated qty",
          "",
          {
            duration: 2000,
            panelClass: [ "warning-snackbar" ],
            verticalPosition: "bottom"
          }
        );
        control.setValue(0)
        return { 'nameIsForbidden': true };
      }
      return null;
    }
  }

  makesUpdate(data: string[], grpIndex: number) {
    const forms = this.materialForms.get("forms") as FormArray;
    if (data.length <= 4) {
      forms.controls[ grpIndex ].get("makes").setValue(data);
    } else {
      this._snackBar.open(
        "Only 5 brands allowed",
        "",
        {
          duration: 2000,
          panelClass: [ "warning-snackbar" ],
          verticalPosition: "bottom"
        }
      );

    }
  }

  openDialog(data: RfqMaterialResponse): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(AddAddressPoDialogComponent, {
        width: "1200px",
        data: {
          roleType: "projectBillingAddressId",
          id: data.projectId
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        data.defaultAddress = result ? result[ 1 ].address : data.defaultAddress;
      });
    }
  }
  getFormStatus() {
    return this.materialForms;
  }


  materialAdded() {
    const formValues = this.materialForms.value.forms.map(material => {
      material.estimatedRate = Number(material.estimatedRate);
      material.quantity = Number(material.quantity);
      return material
    })
    this.projectSelectedMaterials.forEach((project, i) => {
      project.projectMaterialList.forEach((material, j) => {
        formValues.forEach((val, k) => {
          if (
            material.projectId === val.projId &&
            material.materialId === val.matId
          ) {
            this.projectSelectedMaterials[ i ].projectMaterialList[
              j
            ].estimatedRate = val.estimatedRate;
            this.projectSelectedMaterials[ i ].projectMaterialList[ j ].quantity =
              val.quantity;
            this.projectSelectedMaterials[ i ].projectMaterialList[ j ].makes =
              val.makes;
            if (val.fullfilmentDate) {
              let date = new Date(this.commonService.formatDate(val.fullfilmentDate))
              let dummyMonth = date.getMonth() + 1;
              const year = date.getFullYear().toString();
              const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
              const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
              this.projectSelectedMaterials[ i ].projectMaterialList[
                j
              ].fullfilmentDate = year + "-" + month + "-" + day;
            } else {
              this.projectSelectedMaterials[ i ].projectMaterialList[
                j
              ].fullfilmentDate = null;
            }
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

  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "600px",
      data: this.rfqData.rfqCurrency
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.rfqData.rfqCurrency = data;
      }
    });
  }

  /**
   * function will call to upload new images
   * @param selectedMaterial, type
   */
  uploadImage(selectedMaterial, type) {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      disableClose: true,
      width: "60vw",
      panelClass: 'upload-image-modal',
      data: {
        selectedMaterial,
        type,
        rfqId: this.generatedRfq.rfqId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.rfqData = this.generatedRfq;
        this.projectSelectedMaterials.map(project => project.projectMaterialList.map(mat => mat.documentList = (mat.materialId === result.materialId) ? result.documentsList : mat.documentList));
        this.materialAdded();
      }
    });
  }

  /**
   * function will call to open view image modal
   * @param rfqId, materialId, type
   */
  viewAllImages(materialId) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      disableClose: true,
      width: "500px",
      panelClass: 'view-image-modal',
      data: {
        rfqId: this.generatedRfq.rfqId,
        materialId,
        type: 'rfq'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
