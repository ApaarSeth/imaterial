import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChange,
  SimpleChanges
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { categoryNestedLevel } from "../../../../shared/models/category";
import { AppNotificationService } from "../../../../shared/services/app-notification.service";
import { ProjectService } from "../../../../shared/services/project.service";
import { BomService } from "../../../../shared/services/bom.service";
import { FormBuilder, FormGroup, FormArray, ValidatorFn, FormControl } from "@angular/forms";
import { Materials } from "../../../../shared/models/subcategory-materials";

@Component({
  selector: "app-bom-myMaterial",
  templateUrl: "./bom-myMaterial.component.html",
})
export class BomMyMaterialComponent implements OnInit {
  @Output() inputEntered = new EventEmitter();
  @Output("searchData") searchData = new EventEmitter();
  @Input("category") category: categoryNestedLevel[];
  @Input("searchMat") searchMat: string;
  counter: number;
  orgId: number;
  materialUnit: string[] = [];
  searchUnit: string = '';
  constructor(
    private router: Router,
    private notifier: AppNotificationService,
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

  searchCategory(val) {
    if (this.selectedCategory) {
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

  formInit() {
    let frmArr: FormGroup[] = this.selectedCategory.map((category: categoryNestedLevel) => {
      const matGrp: FormGroup[] = category.materialList.map(subcategory => {
        return this.formBuilder.group({
          materialId: [subcategory.materialId],
          materialMasterId: [subcategory.materialId],
          estimatedQty: [subcategory.estimatedQty, [this.estimatedQtyCheck(subcategory.poAvailableQty ? subcategory.poAvailableQty : 0)]],
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


    (<FormArray>this.quantityForms.get('forms')).controls.map((control: FormGroup) => {
      (<FormArray>control.get('materialGroup')).controls.map((control: FormGroup) => {
        control.get("estimatedQty").valueChanges.subscribe(changes => {
          this.inputEntered.emit(true);
        })
      })
    })
  }

  estimatedQtyCheck(checkVal): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {
      if (control.value >= checkVal || control.value == null || checkVal == 0) {
        return null;
      }
      else {
        this.notifier.snack("Estimated qty can'nt be less than available qty")
        return {
          incorrectValue: true,
        };
      }
    }
  }

  mappingMaterialWithQuantity() {
    this.bomService
      .getMaterialWithQuantity(this.orgId, this.projectId)
      .then(res => {
        this.dataQty = res.data;
        if (this.dataQty) {
          this.selectedCategory.forEach((category: categoryNestedLevel) => {
            for (let subcategory of category.materialList) {
              for (let data of this.dataQty) {
                if (
                  subcategory.materialGroup === data.materialGroup &&
                  subcategory.materialName === data.materialName &&
                  data.estimatedQty > 0
                ) {
                  subcategory.materialUnit = data.materialUnit;
                  subcategory.requestedQuantity = data.requestedQuantity
                  subcategory.availableStock = data.availableStock
                  subcategory.poAvailableQty = data.poAvailableQty
                  subcategory.issueToProject = data.issueToProject
                  subcategory.estimatedQty = data.estimatedQty;
                  subcategory.estimatedRate = data.estimatedRate;
                  subcategory.materialId = data.materialId;
                  subcategory.matched = true;
                  break;
                }
                else if (!subcategory.matched) {
                  subcategory.estimatedQty = null;
                  subcategory.requestedQuantity = null;
                  subcategory.availableStock = null;
                  subcategory.issueToProject = null;
                }
              }
            };
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
        this.filterDeletedMaterial()
        this.formInit();
      })
      .catch(err => {
      });
  }

  filterDeletedMaterial() {
    this.selectedCategory.forEach(category => {
      category.materialList = category.materialList.filter(material => {
        return material.status === 0 || (material.status === 1 && material.estimatedQty !== null)
      })
    })
  }

  getMaterialLength(): ValidatorFn {
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
