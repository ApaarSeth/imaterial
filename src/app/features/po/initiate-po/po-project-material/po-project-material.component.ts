import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { POService } from "src/app/shared/services/po/po.service";
import { Projects } from "src/app/shared/models/GlobalStore/materialWise";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";

@Component({
  selector: "app-po-project-material",
  templateUrl: "./po-project-material.component.html"
})
export class PoProjectMaterialComponent implements OnInit {
  @Output() selectedMaterial = new EventEmitter<any>();
  searchText: string = null;
  displayedColumns: string[] = [
    "Material Name",
    "Required Date",
    "Requested Quantity",
    "Estimated Quantity"
  ];
  form: FormGroup;
  materialForm: FormGroup;
  allProjects: ProjectDetails[];
  projectIds: number;
  poDetails: RfqMaterialResponse[];
  constructor(
    private poService: POService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.inititatePo[1].data;
    this.formInit();
  }
  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: []
    });
  }

  materialsForm() {
    const formArr: FormGroup[] = this.poDetails[0].projectMaterialList.map(
      material => {
        return this.formBuilder.group({
          material: []
        });
      }
    );
    this.materialForm = new FormGroup({});
    this.materialForm.addControl("formArr", new FormArray(formArr));
  }
  choosenProject() {
    this.projectIds = this.form.value.selectedProject.projectId;
    this.poService.projectMaterials(this.projectIds).then(res => {
      this.poDetails = res.data;
      this.materialsForm();
    });
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
    this.selectedMaterial.emit(this.poDetails);
    console.log(this.poDetails);
  }

  materialChecked(checked: HTMLElement, i: number, element) {
    const arr = this.materialForm.controls["formArr"] as FormArray;
    const fGrp = arr.at(i) as FormGroup;
    if (checked) {
      fGrp.get("material").setValue(element);
    } else {
      fGrp.get("material").reset();
    }
  }
}
