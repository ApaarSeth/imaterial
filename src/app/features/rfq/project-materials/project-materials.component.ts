import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { stringify } from "querystring";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";

@Component({
  selector: "rfq",
  templateUrl: "./project-materials.component.html"
})
export class RFQProjectMaterialsComponent implements OnInit {
  userId: 1;
  searchText: string = null;
  allProjects: ProjectDetails[];
  buttonName: string = "projectMaterials";
  projects: FormControl;
  selectedProjects = [];
  ProjectIds: number[] = [];
  rfqDetails: RfqMaterialResponse[];
  materialForms: FormGroup;

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

  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.rfq;
    this.projects = new FormControl([]);
    console.log("projectList", this.allProjects);
  }
  setButtonName(name: string) {
    this.buttonName = name;
  }
  setSelectedProjectList() {
    this.ProjectIds = this.selectedProjects.map(
      selectedProject => selectedProject.projectId
    ) as number[];
    this.rfqMaterials(this.ProjectIds);
  }

  rfqMaterials(projectIds: number[]) {
    this.rfqService.rfqMaterials(projectIds).then(res => {
      this.rfqDetails = res.data;
      console.log("qwertyuio", this.rfqDetails);
    });
  }

  checkedMAterialFlag: boolean = false;

  raiseIndent() {
    let projectMaterial = null;
    let checkedMaterial = this.rfqDetails.filter(sub => {
      return sub.projectMaterialList != null;
    });
    let checkedMaterials = checkedMaterial
      .map(sub => {
        projectMaterial = sub.projectMaterialList.filter(mat => {
          return mat.checked === true;
        });
        return { ...sub, projectMaterialList: projectMaterial };
      })
      .filter(sub => {
        return sub.projectMaterialList.length != 0;
      });
    //to do new page path add
    if (checkedMaterials.length) {
      this.router.navigate(["/rfq/quantity-makes"], {
        state: { checkedMaterials }
      });
    }
  }
}
