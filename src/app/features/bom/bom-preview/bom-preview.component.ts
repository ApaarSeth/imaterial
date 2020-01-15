import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { categoryNestedLevel } from "src/app/shared/models/category";
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
  selector: "app-bom-preview",
  templateUrl: "./bom-preview.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class BomPreviewComponent implements OnInit {
  @Output() inputEntered = new EventEmitter();
  counter: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private bomService: BomService,
    private formBuilder: FormBuilder
  ) {}
  private dataQty: Materials[];
  projectId: number;
  frmArr: FormGroup[];
  quantityForms: FormGroup;
  // product: ProjectDetails;
  step = 0;

  setStep(index: number) {
    this.step = index;
  }
  @Input("selectedCategory") selectedCategory: categoryNestedLevel;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.projectService.getProject(1, this.projectId).then(data => {
      // console.log("data");
      // console.log(data);
      //     this.product = data.message;
    });
    this.bomService
      .getMaterialWithQuantity(1, this.projectId)
      .then(res => {
        console.log(res.data);
        this.dataQty = res.data;
        this.selectedCategory.Child = this.selectedCategory.Child.map(
          subcategory => {
            for (let data of this.dataQty) {
              if (
                subcategory.materialGroup === data.materialGroup &&
                subcategory.materialName === data.materialName &&
                data.estimatedQty > 0
              ) {
                subcategory.estimatedQty = data.estimatedQty;
              }
            }
            return subcategory;
          }
        );
        this.formInit();
      })
      .catch(err => {
        console.log(err);
      });
    this.formInit();
  }
  formInit() {
    const frmArr: FormGroup[] = this.selectedCategory.Child.map(subcategory => {
      return this.formBuilder.group({
        estimatedQty: [subcategory.estimatedQty],
        materialCode: [subcategory.materialCode],
        materialName: [subcategory.materialName],
        materialGroup: [subcategory.materialGroup],
        materialUnit: [subcategory.materialUnit],
        estimatedRate: [subcategory.estimatedRate]
      });
    });
    this.quantityForms = this.formBuilder.group(
      {},
      { validators: [this.getMaterialLength] }
    );
    this.quantityForms.addControl("forms", new FormArray(frmArr));

    this.quantityForms.valueChanges.subscribe(changes => {
      this.inputEntered.emit(true);
    });
  }
  enteredInput() {
    this.counter = 0;
    if (this.counter > 0) {
      this.counter++;
      this.inputEntered.emit(true);
    }
  }
  getMaterialLength(control: AbstractControl) {
    if (!control.touched) {
      return null;
    }

    if (!Object.keys(control.value).length) {
      return { inValid: true };
    } else {
      const isAllEmpty = control.value.forms.every(cat => !cat.estimatedQty);

      if (isAllEmpty) {
        return { inValid: true };
      } else {
        return null;
      }
    }
  }

  getData() {
    return this.quantityForms.value.forms
      .filter(inputData => inputData.estimatedQty)
      .map(inputdata => {
        inputdata.estimatedQty = parseInt(inputdata.estimatedQty);
        return inputdata;
      });
  }

  // getProject(id: number){
  //   this.projectService.getProject(1,id).then(data => {
  //     this.product = data.message;
  // });
  // }

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
