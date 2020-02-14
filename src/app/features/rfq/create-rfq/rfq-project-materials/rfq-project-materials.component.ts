import { Component, OnInit, Output, EventEmitter } from "@angular/core";
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
    this.rfqDetails.map((rfqDetails, i) => {
      let projectMaterial = [];
      this.materialForm.value.forms[i].materialList.forEach(element => {
        if (element.material != null) {
          projectMaterial.push(element.material);
        }
      });
      this.rfqDetails[i].projectMaterialList = projectMaterial;
    });
    this.selectedMaterial.emit(this.rfqDetails);
  }

  // setSelectedProjectList() {
  //   console.log("list", this.projects.value);
  //   console.log(
  //     this.selectedProjects.map(selectedProject => selectedProject.projectId)
  //   );
  //   this.projectIds = this.selectedProjects.map(
  //     selectedProject => selectedProject.projectId
  //   ) as ProjectIds;
  //   this.rfqMaterials(this.projectIds);
  // }

  // rfqMaterials(projectIds: ProjectIds) {
  //   this.rfqService.rfqMaterials(projectIds).then(res => {
  //     this.rfqDetails = res.data;
  //     console.log("qwertyuio", this.rfqDetails);
  //   });
  // }

  // checkedMAterialFlag: boolean = false;

  // raiseIndent() {
  //   let projectMaterial = null;
  //   let checkedMaterial = this.rfqDetails.filter(sub => {
  //     return sub.projectMaterialList != null;
  //   });
  //   let checkedMaterials = checkedMaterial
  //     .map(sub => {
  //       projectMaterial = sub.projectMaterialList.filter(mat => {
  //         return mat.checked === true;
  //       });
  //       return { ...sub, projectMaterialList: projectMaterial };
  //     })
  //     .filter(sub => {
  //       return sub.projectMaterialList.length != 0;
  //     });
  //   if (checkedMaterials.length) {
  //     this.router.navigate(["/rfq/quantity-makes"], {
  //       state: { checkedMaterials }
  //     });
  //   }
  // }
}
