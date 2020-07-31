import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { categoryNestedLevel, material } from "src/app/shared/models/category";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { BomService } from "src/app/shared/services/bom/bom.service";
import { parse } from "querystring";
import { Materials } from "src/app/shared/models/subcategory-materials";

@Component({
  selector: "app-bom-allMaterial",
  templateUrl: "./bom-allMaterial.component.html"
})
export class BOMAllMaterialComponent implements OnInit {
  @Output() inputEntered = new EventEmitter();
  @Output("searchData") searchData = new EventEmitter();
  @Input("category") category: categoryNestedLevel[];
  @Input("searchMat") searchMat: string;
  counter: number;
  orgId: number;
  searchUnit: string = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private bomService: BomService,
    private formBuilder: FormBuilder
  ) { }
  private dataQty: Materials[];
  projectId: number;
  frmArr: FormGroup[];
  quantityForms: FormGroup;
  selectedCategory: categoryNestedLevel[] = [];
  materialUnit: string[] = []
  step = 0;
  isSearching: boolean;
  setStep(index: number) {
    this.step = index;
  }

  currencyCode: string;

  ngOnInit() {
    this.currencyCode = localStorage.getItem('currencyCode')
    this.bomService.getMaterialUnit().then(res => {
      this.materialUnit = res.data;
    });
    this.bomService.searchText.subscribe(val => {
      this.searchCategory(val);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.category && changes.category.currentValue) {
      if (changes.category.currentValue.length) {
        this.route.params.subscribe(params => {
          this.projectId = params["id"];
          this.orgId = Number(localStorage.getItem("orgId"))
          this.selectedCategory = [...this.category];
          this.mappingMaterialWithQuantity()
        });
      }
    }
  }



  searchCategory(val) {
    if (this.category) {
      this.selectedCategory = [...this.category];
      if (val && val !== '') {
        this.isSearching = true;
        for (let category of this.selectedCategory) {
          for (let mat of category.materialList) {
            if (mat.materialName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1) {
              mat.isNull = false;
            }
            else {
              mat.isNull = true;
            }
          }
          category.allNull = category.materialList.every(mat => mat.isNull)
        }
      }
      else {
        this.isSearching = false;
        for (let category of this.selectedCategory) {
          for (let mat of category.materialList) {
            mat.isNull = false;
          }
          category.allNull = false;
        }
      }
    }
  }


  formInit() {
    let frmArr: FormGroup[] = this.selectedCategory.map((category: categoryNestedLevel) => {
      const matGrp: FormGroup[] = category.materialList.map(subcategory => {
        return this.formBuilder.group({
          materialId: [subcategory.materialId],
          materialMasterId: [subcategory.materialId],
          estimatedQty: [subcategory.estimatedQty],
          materialCode: [subcategory.materialCode],
          materialName: [subcategory.materialName],
          materialGroup: [subcategory.materialGroup],
          materialUnit: [subcategory.materialUnit],
          estimatedRate: [subcategory.estimatedRate]
        });
      });
      return this.formBuilder.group({
        materialGroup: this.formBuilder.array(matGrp)
      });
    })

    this.quantityForms = this.formBuilder.group(
      { forms: this.formBuilder.array(frmArr) }
      , { validators: this.getMaterialLength() }
    );
    // this.quantityForms.addControl("forms", new FormArray(frmArr, [this.getMaterialLength()]));
    // this.enteredInput();r
    (<FormArray>this.quantityForms.get('forms')).controls.map((control: FormGroup) => {
      (<FormArray>control.get('materialGroup')).controls.map((control: FormGroup) => {
        control.get("estimatedQty").valueChanges.subscribe(changes => {
          this.inputEntered.emit(true);
        })
      })
    })

    this.quantityForms.valueChanges.subscribe(changes => {
      this.inputEntered.emit(true);
    })
  }

  mappingMaterialWithQuantity() {
    this.bomService
      .getMaterialWithQuantity(this.orgId, this.projectId)
      .then(res => {
        this.dataQty = res.data;
        if (this.dataQty) {
          this.selectedCategory.forEach((category: categoryNestedLevel) => {
            category.materialList.forEach(
              subcategory => {
                for (let data of this.dataQty) {
                  if (
                    subcategory.materialGroup === data.materialGroup &&
                    subcategory.materialName === data.materialName &&
                    data.estimatedQty > 0
                  ) {
                    subcategory.materialUnit = data.materialUnit;
                    subcategory.requestedQuantity = data.requestedQuantity
                    subcategory.availableStock = data.availableStock
                    subcategory.issueToProject = data.issueToProject
                    subcategory.estimatedQty = data.estimatedQty;
                    subcategory.materialId = data.materialId;
                    subcategory.estimatedRate = data.estimatedRate;
                  }
                  else {
                    subcategory.requestedQuantity = null;
                    subcategory.availableStock = null;
                    subcategory.issueToProject = null;
                  }
                }
              });
          })
        } else {
          this.selectedCategory.forEach((category: categoryNestedLevel) => {
            category.materialList.forEach(
              subcategory => {
                subcategory.requestedQuantity = null;
                subcategory.availableStock = null;
                subcategory.issueToProject = null;
              });
          })
        }
        this.formInit();
      })
      .catch(err => {
      });
  }



  getMaterialLength(minRequired = 1): ValidatorFn {
    return (formGroup: FormGroup): { [key: string]: boolean } | null => {
      let checked = false;
      for (let key of Object.keys((<FormArray>formGroup.get('forms')).controls)) {
        const control: FormArray = (<FormArray>formGroup.get('forms')).controls[key] as FormArray;
        checked = control.value.materialGroup.some(material => {
          return material.estimatedQty > 0
        })
        if (checked) {
          break;
        }
      }

      if (!checked) {
        return {
          requireCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }

  getData() {
    return this.quantityForms.value.forms.map(val => {
      return val.materialGroup.filter(inputData => inputData.estimatedQty)
        .map(inputdata => {
          inputdata.estimatedQty = Number(inputdata.estimatedQty);
          inputdata.estimatedRate = Number(inputdata.estimatedRate);
          return inputdata;
        });
    }).flat()

  }


  customValidation(form: FormGroup) {
    if (form.value) {
      return null;
    } else {
      return { valid: false };
    }
  }

  saveCategory() {
    this.router.navigate(["/bom/" + this.projectId + "/bom-detail"]);
  }
}
