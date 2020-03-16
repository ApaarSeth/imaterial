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
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
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
  searchProject: string = null;
  searchMaterial: string = null;
  userId: 1;
  searchText: string = null;
  allProjects: ProjectDetails[];
  buttonName: string = "projectMaterials";
  projects: FormControl;
  selectedProjects: ProjectDetails[] = [];
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
  alreadySelectedId: number[];
  checkedProjectList: RfqMaterialResponse[] = [];
  checkedProjectIds: number[] = [];
  finalRfqDetails: RfqMaterialResponse[];
  rfqId: number;
  counter: number = 0;
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }
  form: FormGroup;

  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.createRfq[1].data;
    this.activatedRoute.params.subscribe(params => {
      this.rfqId = params['rfqId']
    })
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
    if (this.rfqId) {
      this.rfqService.getDraftRfq(this.rfqId).then(res => {
        this.existingRfq = res.data;
        this.checkExistingData()
      })
    }
    this.formInit();
    this.materialsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkExistingData();
  }

  checkExistingData() {
    if (this.existingRfq) {
      this.projectIds = [];
      this.rfqDetails = [];
      this.selectedProjects = [];
      this.addRfq = this.existingRfq as AddRFQ;
      this.alreadySelectedId = this.addRfq.rfqProjectsList.map(
        (rfqMat: RfqMaterialResponse) => {
          return rfqMat.projectId;
        }
      );
      this.allProjects.forEach((project: ProjectDetails) => {
        if (this.alreadySelectedId.includes(project.projectId)) {
          this.selectedProjects.push(project);
        }
      });
      this.form.get("selectedProject").setValue(this.selectedProjects);
      this.checkedProjectList = this.addRfq.rfqProjectsList;
      this.checkedProjectIds = this.addRfq.rfqProjectsList.map(
        (projects: RfqMaterialResponse) => {
          this.counter += projects.projectMaterialList.length
          return projects.projectId;
        }
      );
      this.choosenProject();
    }
  }

  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: ['', [Validators.required]]
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
        this.rfqDetails = [...this.rfqDetails, ...res.data];
        this.rfqDetails = this.rfqDetails.map(
          (project: RfqMaterialResponse) => {
            let proj = this.getCheckedMaterial(project);
            return proj;
          }
        );
        console.log("rfqDegtail", this.rfqDetails);
        this.materialsForm();
        // this.materialAdded();
      });
    }
    this.projectIds = [...selectedIds];
  }

  getCheckedMaterial(project: RfqMaterialResponse) {
    if (this.checkedProjectIds) {
      if (this.checkedProjectIds.includes(project.projectId)) {
        let alreadySelectedProj: RfqMaterialResponse = this.checkedProjectList.find(
          proj => {
            return proj.projectId === project.projectId;
          }
        );
        let checkedMaterialIds = alreadySelectedProj.projectMaterialList.map(
          (material: RfqMat) => {
            return material.materialId;
          }
        );
        project.projectMaterialList = project.projectMaterialList.map(
          (material: RfqMat) => {
            if (checkedMaterialIds.includes(material.materialId)) {
              material.checked = true;
            } else {
              material.checked = false;
            }
            return material;
          }
        );
      } else {
        project.projectMaterialList = project.projectMaterialList.map(
          (material: RfqMat) => {
            if (!material.checked) material.checked = false;
            return material;
          }
        );
      }
    }
    return project;
  }
  materialsForm() {
    const formArr: FormGroup[] = this.rfqDetails.map(projects => {
      let materialGrp: FormGroup[] = projects.projectMaterialList.map(
        material => {
          return this.formBuilder.group({
            material: [material.checked ? material : null]
          });
        }
      );
      return this.formBuilder.group({
        materialList: this.formBuilder.array(materialGrp)
      });
    });
    this.materialForm = new FormGroup({});
    this.materialForm.addControl("forms", new FormArray(formArr));

    // this.materialForm.valueChanges.subscribe(val => {
    //   this.materialAdded();
    // });
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
      element.checked = true;
      this.counter++;
      mat.get("material").setValue(element);
    } else {
      this.counter--;
      element.checked = false;
      mat.get("material").reset();
    }
  }

  materialAdded() {
    let newRfqDetails = JSON.parse(JSON.stringify(this.rfqDetails));
    newRfqDetails = newRfqDetails.map((rfqDetail: RfqMaterialResponse, i) => {
      let projectMaterial: RfqMat[] = [];
      this.materialForm.value.forms[i].materialList.forEach(element => {
        if (element.material != null) {
          if (this.checkedProjectIds.includes(rfqDetail.projectId)) {
            this.checkedProjectList.forEach((project: RfqMaterialResponse) => {
              if (project.projectId === rfqDetail.projectId) {
                let materialAddedFlag = false;
                project.projectMaterialList.forEach((mat: RfqMat) => {
                  if (mat.materialId === element.material.materialId) {
                    projectMaterial.push(mat);
                    materialAddedFlag = true;
                  }
                })
                if (!materialAddedFlag) {
                  element.material.fullfilmentDate = element.material.dueDate;
                  projectMaterial.push(element.material);
                }
              }
            })
          } else {
            projectMaterial.push(element.material);
          }
        }
      })
      rfqDetail.projectMaterialList = projectMaterial;
      return rfqDetail;
    });
    this.addRfq.rfqProjectsList = newRfqDetails;
    this.updatedRfq.emit(this.addRfq);
  }
}
