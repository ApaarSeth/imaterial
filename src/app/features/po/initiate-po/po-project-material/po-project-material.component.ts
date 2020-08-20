import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatCheckbox } from "@angular/material/checkbox";
import { initiatePoData } from "../../../../shared/models/PO/po-data";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ProjectDetails } from "../../../../shared/models/project-details";
import { RfqMaterialResponse, rfqCurrency, RfqMat } from "../../../../shared/models/RFQ/rfq-details";
import { POService } from "../../../../shared/services/po.service";
import { CommonService } from "../../../../shared/services/commonService";
import { SelectCurrencyComponent } from "../../../../shared/dialogs/select-currency/select-currency.component";

@Component({
  selector: "app-po-project-material",
  templateUrl: "./po-project-material.component.html"
})
export class PoProjectMaterialComponent implements OnInit {
  @Output() selectedMaterial = new EventEmitter<any>();
  @Input() existingPoData: initiatePoData;
  existingPo: initiatePoData;
  counter: number = 0;
  searchText: string = null;
  displayedColumns: string[] = ["Material Name", "Required Date", "Requested Quantity", "Estimated Quantity"];
  form: FormGroup;
  materialForm: FormGroup;
  allProjects: ProjectDetails[];
  projectIds: number;
  poDetails: RfqMaterialResponse[] = [];
  searchProject: string;
  searchMaterial: string;
  poCurrency: rfqCurrency;
  isMobile: boolean;
  constructor(public dialog: MatDialog,
    private poService: POService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.allProjects = this.activatedRoute.snapshot.data.inititatePo[1].data;
    this.formInit();
  }

  ngOnChanges(): void {
    this.poCurrency = this.existingPoData && this.existingPoData.poCurrency
    this.checkExistingData();
  }
  alreadySelectedId: number[];
  selectedProjects: ProjectDetails[] = [];
  checkedProjectList: RfqMaterialResponse[];
  checkedProjectIds: number[];

  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: ["", [Validators.required]]
    });
  }

  materialsForm() {
    const formArr: FormGroup[] = this.poDetails[0].projectMaterialList.map(material => {
      return this.formBuilder.group({
        material: [material.checked ? material : null]
      });
    });
    this.materialForm = new FormGroup({});
    this.materialForm.addControl("formArr", new FormArray(formArr));
  }
  choosenProject(event) {
    this.projectIds = this.form.value.selectedProject.projectId;
    this.poService.projectMaterials(this.projectIds).then(res => {
      if (res.data) {
        this.poDetails = [...res.data];
        this.poDetails.map((project: RfqMaterialResponse) => {
          let proj = this.getCheckedMaterial(project);
          return proj;
        })
        this.materialsForm();
      }
      else {
        this.poDetails = [];
      }
    });
  }
  checkExistingData() {
    if (this.existingPoData && this.existingPoData.selectedMaterial) {
      // this.projectIds = [];
      // this.rfqDetails = [];
      this.selectedProjects = [];
      this.alreadySelectedId = this.existingPoData.selectedMaterial.map(
        (rfqMat: RfqMaterialResponse) => {
          return rfqMat.projectId;
        }
      );
      this.allProjects.forEach((project: ProjectDetails) => {
        if (this.alreadySelectedId.includes(project.projectId)) {
          this.selectedProjects.push(project);
        }
      });
      this.form.get("selectedProject").setValue(this.selectedProjects[0]);
      this.checkedProjectList = this.existingPoData.selectedMaterial;
      this.checkedProjectIds = this.existingPoData.selectedMaterial.map(
        (projects: RfqMaterialResponse) => {
          this.counter += projects.projectMaterialList.length
          return projects.projectId;
        }
      );
      this.choosenProject(null);
    }
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
            let mat = alreadySelectedProj.projectMaterialList.find(mat => {
              return mat.materialId === material.materialId
            })
            if (mat) {
              material.quantity = mat.quantity;
              material.makes = mat.makes;
              material.estimatedRate = mat.estimatedRate;
              material.dueDate = mat.fullfilmentDate ? new Date(mat.fullfilmentDate) : null;
              material.fullfilmentDate = mat.fullfilmentDate ? new Date(mat.fullfilmentDate) : null;
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
  materialAdded() {
    let projectMaterial = [];
    this.poDetails.map(poDetails => {
      this.materialForm.value.formArr.forEach(element => {
        if (element.material != null) {
          projectMaterial.push(element.material);
        }
      });
      poDetails.projectMaterialList = projectMaterial;
    });
    let poData: initiatePoData = {
      selectedSupplier: this.existingPoData.selectedSupplier,
      selectedMaterial: this.poDetails,
      poCurrency: this.poCurrency
    }
    this.selectedMaterial.emit(poData);
  }

  materialChecked(checked: MatCheckbox, i: number, element) {
    const arr = this.materialForm.controls["formArr"] as FormArray;
    const fGrp = arr.at(i) as FormGroup;

    if (checked.checked) {
      this.counter++;
      element.checked = true;
      fGrp.get("material").setValue(element);
    } else {
      this.counter--;
      element.checked = false;
      fGrp.get("material").reset();
    }
  }

  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "500px",
      data: this.poCurrency
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.poCurrency = data;
      }
    });
  }
}
