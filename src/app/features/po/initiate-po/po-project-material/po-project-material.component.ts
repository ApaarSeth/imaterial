import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import { ProjectDetails, ProjectIds } from "src/app/shared/models/project-details";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { POService } from "src/app/shared/services/po/po.service";
import { Projects } from "src/app/shared/models/GlobalStore/materialWise";
import { RfqMaterialResponse, RfqMat } from "src/app/shared/models/RFQ/rfq-details";
import { initiatePoData } from 'src/app/shared/models/PO/po-data';

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
  poDetails: RfqMaterialResponse[];
  searchProject: string;
  searchMaterial: string;
  constructor(private poService: POService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.inititatePo[1].data;
    this.formInit();
  }

  ngOnChanges(): void {
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
      this.poDetails = [...res.data];
      this.poDetails.map((project: RfqMaterialResponse) => {
        let proj = this.getCheckedMaterial(project);
        return proj;
      })
      this.materialsForm();
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
      selectedMaterial: this.poDetails
    }
    this.selectedMaterial.emit(poData);
  }

  materialChecked(checked: HTMLElement, i: number, element) {
    const arr = this.materialForm.controls["formArr"] as FormArray;
    const fGrp = arr.at(i) as FormGroup;

    if (checked) {
      this.counter++;
      fGrp.get("material").setValue(element);
    } else {
      this.counter--;
      fGrp.get("material").reset();
    }
  }
}
