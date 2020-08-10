import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ProjectDetails, AllCTCProjectData } from "src/app/shared/models/project-details";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ReportService } from 'src/app/shared/services/supplierLiabilityReport.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "ctc-report",
  templateUrl: "./ctc-report.component.html"
})

export class CTCReportComponent implements OnInit {
  conversionNumber: number
  orgId: number;
  userId: number;
  form: FormGroup;
  searchText: string = null;
  projects: FormControl;
  selectedProjects: ProjectDetails[] = [];
  projectIds: string[] = [];
  amountRange: string[];
  selectedMenu: string;
  currency: string
  allProjectsList: ProjectDetails[] = [];
  allProjectsData: AllCTCProjectData[];
  allProjects: ProjectDetails[];
  selectedProjectIds: number[] = [];
  projectNumIds: number[] = [];
  countryCode: string
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.conversionNumber = 1;
    this.countryCode = localStorage.getItem("countryCode");
    this.currency = localStorage.getItem("currencyCode");
    this.amountRange = this.countryCode === 'IN' ? ['Full Figures', 'Lakhs', 'Crores'] : ['Full Figures', 'Thousands', 'Millions', 'Billions']
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.allProjectsList = this.activatedRoute.snapshot.data.resolverData[1].data;
    this.formInit();
    this.selectedMenu = 'Full Figures';
    this.projectNumIds = this.allProjectsList.map(elem => elem.projectId);
  }

  /**
   * @description to get all materials of selected project in dropdown
   * @param projectId project id of selected project in dropdown list
   */
  getProjectMaterials() {
    this.projectIds = this.form.value.selectedProject.map(selectedProject => String(selectedProject));
    if (this.projectIds.length > 0) {
      this.sendDataGetCTCReport();
    } else {
      this.allProjectsData = [];
    }
  }

  sendDataGetCTCReport() {
    const selectedProjectIds = {
      "projectIdList": this.projectIds
    }
    this.reportService.getCTCReportData(selectedProjectIds).then(res => {
      this.allProjectsData = res;
    });
  }

  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: [''],
      amountDisplay: ['Full figures']
    });

    this.form.get('amountDisplay').valueChanges.subscribe(res => {
      console.log(res)
    })
  }

  clickMenuItem(menuItem) {
    this.selectedMenu = menuItem;
    switch (this.selectedMenu) {
      case 'Lakhs':
        this.conversionNumber = 100000
        break;
      case 'Crores':
        this.conversionNumber = 10000000
        break;
      case 'Thousands':
        this.conversionNumber = 1000
        break;
      case 'Millions':
        this.conversionNumber = 1000000
        break;
      case 'Billions':
        this.conversionNumber = 1000000000
        break;
      default:
        this.conversionNumber = 1
        break;
    }
  }

  downloadExcel() {
    const data = {
      "projectIdList": this.projectIds
    }

    this.reportService.ctcReportExcelDownload(data).then(res => {
      if (res.data) {
        var win = window.open(res.data.url, "_blank");
        win.focus();
      }
    })
  }

  /**
   * @description function to check if select all option clicked or not
   * @param text 'select all' text present or not
   */
  getAllIds(text) {
    if (text === 'Select All') {
      this.projectIds = this.projectNumIds.map(String);
      this.sendDataGetCTCReport();
    } else {
      this.projectIds = [];
      this.allProjectsData = [];
    }
  }
}

