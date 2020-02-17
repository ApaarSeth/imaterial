import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from "@angular/core";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Component({
  selector: "app-rfq-project-materials",
  templateUrl: "./rfq-project-materials.component.html"
})
export class RfqProjectMaterialsComponent implements OnInit {
  @Input() stepperForm: FormGroup;
  @Output() selectedMaterial = new EventEmitter<RfqMaterialResponse[]>();
  userId: 1;
  searchText: string = null;
  allProjects: ProjectDetails[];
  buttonName: string = "projectMaterials";
  projects: FormControl;
  selectedProjects = [];
  projectIds: number[] = [];
  rfqDetails: RfqMaterialResponse[] = [];
  materialForm: FormGroup;
  newRfqDetails: RfqMaterialResponse[] = [];
  displayedColumns: string[] = [
    "Material Name",
    "Required Date",
    "Requested Quantity",
    "Estimated Quantity"
  ];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  form: FormGroup;
  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.createRfq[1].data;

    this.formInit();
    this.materialsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("stepQty", this.stepperForm.get("qty").value);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: [[]]
    });
  }
  setButtonName(name: string) {
    this.buttonName = name;
  }
  choosenProject() {
    let projectAdd: number[] = [];
    let projectRemove: number[] = [];
    const selectedIds = this.form.value.selectedProject.map(
      selectedProject => selectedProject.projectId
    );
    if (selectedIds.length === 0) {
      this.rfqDetails = [];
      this.projectIds = [];
      return;
    }
    if (this.projectIds.length === 0) {
      projectAdd = selectedIds;
    } else if (this.projectIds.length < selectedIds.length) {
      for (let id of selectedIds) {
        if (!this.projectIds.includes(id)) {
          projectAdd.push(id);
        }
      }
    } else if (this.projectIds.length >= selectedIds.length) {
      for (let id of this.projectIds) {
        if (!selectedIds.includes(id)) {
          projectRemove.push(id);
        }
      }
      this.rfqDetails = this.rfqDetails.filter(
        (rfqData: RfqMaterialResponse) => {
          return !projectRemove.includes(rfqData.projectId);
        }
      );
      this.materialAdded();
    }
    if (projectAdd.length) {
      this.rfqService.rfqMaterials(projectAdd).then(res => {
        console.log(res.data);
        this.rfqDetails = [...this.rfqDetails, ...res.data];
        this.materialsForm();
      });
    }
    this.projectIds = [...selectedIds];
  }
  materialsForm() {
    const formArr: FormGroup[] = this.rfqDetails.map(projects => {
      let materialGrp: FormGroup[] = projects.projectMaterialList.map(
        material => {
          return this.formBuilder.group({
            material: []
          });
        }
      );
      return this.formBuilder.group({
        materialList: this.formBuilder.array(materialGrp)
      });
    });
    this.materialForm = new FormGroup({});
    this.materialForm.addControl("forms", new FormArray(formArr));

    this.materialForm.valueChanges.subscribe(val => {
      // console.log("val", val);
      this.materialAdded();
    });
  }

  materialChecked(checked: HTMLElement, i: number, p: number, element) {
    const pArr = this.materialForm.controls["forms"] as FormArray;
    const mArr = pArr.at(p) as FormArray;
    const maGrp = mArr.controls["materialList"] as FormArray;
    const mat = maGrp.at(i);
    if (checked) {
      mat.get("material").setValue(element);
    } else {
      mat.get("material").reset();
    }
  }

  materialAdded() {
    let newRfqDetails = JSON.parse(JSON.stringify(this.rfqDetails));
    newRfqDetails.map((rfqDetail: RfqMaterialResponse, i) => {
      let projectMaterial = [];
      this.materialForm.value.forms[i].materialList.forEach(element => {
        if (element.material != null) {
          projectMaterial.push(element.material);
        }
      });
      rfqDetail.projectMaterialList = projectMaterial;
    });
    this.stepperForm.get("mat").setValue(newRfqDetails);
    this.selectedMaterial.emit(newRfqDetails);
  }
}
