import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { AddRFQ, RfqMaterialResponse, RfqMat } from "../../../../shared/models/RFQ/rfq-details";
import { ProjectDetails } from "../../../../shared/models/project-details";
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ProjectService } from "../../../../shared/services/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { RFQService } from "../../../../shared/services/rfq.service";
import { CommonService } from "../../../../shared/services/commonService";
import { GlobalLoaderService } from "../../../../shared/services/global-loader.service";
import { MatCheckbox } from "@angular/material/checkbox";
import { SelectCurrencyComponent } from "../../../../shared/dialogs/select-currency/select-currency.component";

@Component({
  selector: "app-rfq-project-materials",
  templateUrl: "./rfq-project-materials.component.html"
})
export class RfqProjectMaterialsComponent implements OnInit {
  @Input() existingRfq: AddRFQ;
  @Input() prevIndex: number;
  @Input() projectsList: ProjectDetails[];
  @Output() updatedRfq = new EventEmitter<AddRFQ>();
  @ViewChild("ch", { static: true }) ch: HTMLElement;
  @ViewChild("table", { static: true }) table;

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
  addRfq: AddRFQ = {} as AddRFQ;
  alreadySelectedId: number[];
  checkedProjectList: RfqMaterialResponse[] = [];
  checkedProjectIds: number[] = [];
  finalRfqDetails: RfqMaterialResponse[];
  rfqId: number;
  counter: number = 0;
  isMobile: boolean;
  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private loader: GlobalLoaderService
  ) { }
  form: FormGroup;
  existingRfqData: AddRFQ = null
  previousIndex: number

  ngOnInit() {
    // this.allProjects = this.projectsList;
    this.isMobile = this.commonService.isMobile().matches;
    this.rfqService.mat.subscribe(data => {
      // console.log(data)
    })
    // if (this.rfqId) {
    //   if (this.previousIndex !== 1) {
    //     this.rfqService.getDraftRfq(this.rfqId).then(res => {
    //       this.existingRfq = res.data;
    //       this.checkExistingData()
    //     })
    //   }
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectsList && changes.projectsList.currentValue) {
      this.allProjects = this.projectsList;
      this.formInit();
      this.materialsForm();
    }
    if (changes.prevIndex) {
      this.activatedRoute.params.subscribe(params => {
        this.rfqId = params['rfqId']
        if (this.rfqId) {
          if (this.prevIndex !== 1) {
            this.rfqService.getDraftRfq(this.rfqId).then(res => {
              this.existingRfq = res.data;
              this.checkExistingData()
            })
          }
        }
      })
    }
    if (changes.existingRfq && changes.existingRfq.currentValue) {
      this.existingRfq = changes.existingRfq.currentValue;
      this.checkExistingData()
    }
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
      this.loader.show()
      this.rfqService.rfqMaterials(projectAdd, true).then(res => {
        this.loader.hide()
        this.rfqDetails = [...this.rfqDetails, ...res.data];
        this.rfqDetails = this.rfqDetails.map(
          (project: RfqMaterialResponse) => {
            let proj = this.getCheckedMaterial(project);
            return proj;
          }
        );
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
        project.defaultAddress = alreadySelectedProj.defaultAddress;
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
                  let fullfilmentDate = null;
                  if (mat.materialId === element.material.materialId) {
                    // mat.fullfilmentDate = element.material.dueDate;
                    if (mat.fullfilmentDate === "" || mat.fullfilmentDate === null) {
                      fullfilmentDate = null;
                    }
                    else {
                      let date = new Date(this.commonService.formatDate(mat.fullfilmentDate))
                      let dummyMonth = date.getMonth() + 1;
                      const year = date.getFullYear().toString();
                      const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
                      const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
                      fullfilmentDate = year + "-" + month + "-" + day;
                    }

                    if (mat.documentList === null || mat.documentList === []) {
                      mat.documentList = element.material.documentsList;
                    }

                    projectMaterial.push({ ...mat, fullfilmentDate });
                    materialAddedFlag = true;
                  }
                })
                if (!materialAddedFlag) {
                  // element.material.fullfilmentDate = element.material.dueDate;
                  projectMaterial.push({ ...element.material, fullfilmentDate: element.material.dueDate ? element.material.dueDate : null });
                }
              }
            })
          } else {
            projectMaterial.push({ ...element.material, fullfilmentDate: element.material.dueDate ? element.material.dueDate : null, documentList: element.material.documentsList ? element.material.documentsList : null });
          }
        }
      })
      rfqDetail.projectMaterialList = projectMaterial;
      return rfqDetail;
    });
    this.addRfq.rfqProjectsList = newRfqDetails;
    this.updatedRfq.emit(this.addRfq);
  }

  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "500px",
      data: this.addRfq.rfqCurrency,
      panelClass: ['common-modal-style', 'select-currency-dialog']
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.addRfq.rfqCurrency = data;
      }
    });
  }
}
