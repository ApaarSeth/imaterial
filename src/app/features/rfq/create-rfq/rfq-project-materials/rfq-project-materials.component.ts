import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import { FormControl, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import {
  RfqMaterialResponse,
  AddRFQ,
  RfqMat
} from "src/app/shared/models/RFQ/rfq-details";
import { MatDialog, MatCheckbox } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Component({
  selector: "app-rfq-project-materials",
  templateUrl: "./rfq-project-materials.component.html"
})
export class RfqProjectMaterialsComponent implements OnInit {
  @Input() existingRfq: AddRFQ;
  @Output() updatedRfq = new EventEmitter<AddRFQ>();
  @ViewChild("ch", { static: true }) ch: HTMLElement;
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
  addRfq: AddRFQ;
  alreadySelectedId: number;
  checkedMaterialList: RfqMat[];
  checkedMaterialListIds: number[];

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
    this.addRfq = {
      id: null,
      status: null,
      createdBy: null,
      createdAt: null,
      lastUpdatedBy: null,
      lastUpdatedAt: null,
      rfqId: null,
      rfq_status: null,
      rfqName: null,
      dueDate: null,
      supplierId: null,
      supplierDetails: null,
      rfqProjectsList: [],
      documentsList: null,
      terms: null
    };
    this.formInit();
    this.materialsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.existingRfq) {
      this.addRfq = this.existingRfq;
      this.alreadySelectedId = this.addRfq.rfqProjectsList[0].projectId;
      let bomProject = this.allProjects.find(
        (project: ProjectDetails) =>
          project.projectId === this.addRfq.rfqProjectsList[0].projectId
      );
      this.form.get("selectedProject").setValue([bomProject]);
      this.checkedMaterialList = this.addRfq.rfqProjectsList[0].projectMaterialList;
      this.checkedMaterialListIds = this.addRfq.rfqProjectsList[0].projectMaterialList.map(
        mat => mat.materialId
      );
      this.alreadySelectedId = this.addRfq.rfqProjectsList[0].projectId;
      this.choosenProject();
    }
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
    // if (this.alreadySelectedId) {
    //   selectedIds.push(this.alreadySelectedId);
    // }
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
        this.rfqDetails = [...this.rfqDetails, ...res.data];
        this.rfqDetails = this.rfqDetails.map(project => {
          project.projectMaterialList.map(material => {
            if (project.projectId === this.alreadySelectedId) {
              if (this.checkedMaterialListIds.includes(material.materialId)) {
                material.checked = true;
              }
            } else {
              material.checked = false;
            }
            return material;
          });
          return project;
        });
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

  materialChecked(
    checked: MatCheckbox,
    i: number,
    p: number,
    projectId: number,
    element: RfqMat
  ) {
    const pArr = this.materialForm.controls["forms"] as FormArray;
    const mArr = pArr.at(p) as FormArray;
    const maGrp = mArr.controls["materialList"] as FormArray;
    const mat = maGrp.at(i);
    if (checked.checked) {
      mat.get("material").setValue(element);
    } else {
      if (projectId === this.alreadySelectedId) {
        this.checkedMaterialList = this.checkedMaterialList.filter(
          (mat: RfqMat) => {
            return mat.materialId != element.materialId;
          }
        );
      }
      mat.get("material").reset();
    }
  }

  materialAdded() {
    let newRfqDetails = JSON.parse(JSON.stringify(this.rfqDetails));
    newRfqDetails.map((rfqDetail: RfqMaterialResponse, i) => {
      let projectMaterial: RfqMat[] = [];
      this.materialForm.value.forms[i].materialList.forEach(element => {
        if (element.material != null) {
          projectMaterial.push(element.material);
        }
        if (rfqDetail.projectId === this.alreadySelectedId) {
          let checkedMatName = this.checkedMaterialList.map(
            mat => mat.materialName
          );
          projectMaterial = projectMaterial.filter((mat: RfqMat) => {
            return !checkedMatName.includes(mat.materialName);
          });
          projectMaterial = [...projectMaterial, ...this.checkedMaterialList];
          // projectMaterial = projectMaterial.filter((material, index) => {
          //   const _material = JSON.stringify(material);
          //   return (
          //     index ===
          //     projectMaterial.findIndex(obj => {
          //       return JSON.stringify(obj) === _material;
          //     })
          //   );
          // });
        }
      });

      rfqDetail.projectMaterialList = projectMaterial;
    });
    this.addRfq.rfqProjectsList = newRfqDetails;
    // this.stepperForm.get("mat").setValue(this.addRfq);
    this.updatedRfq.emit(this.addRfq);
  }
}
