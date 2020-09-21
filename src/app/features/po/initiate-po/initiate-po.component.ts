import { Component, OnInit, ViewChildren } from "@angular/core";
import { PoSupplierComponent } from "./po-supplier/po-supplier.component";
import { Suppliers } from "../../../shared/models/RFQ/suppliers";
import { initiatePoData } from "../../../shared/models/PO/po-data";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { UserGuideService } from "../../../shared/services/user-guide.service";
import { CommonService } from "../../../shared/services/commonService";

@Component({
  selector: "app-initiate-po",
  templateUrl: "./initiate-po.component.html"
})
export class InitiatePoComponent implements OnInit {
  supplier: Suppliers;
  poDetail: initiatePoData;
  existingPoData: initiatePoData;
  @ViewChildren("poSupplier") poSupplier: PoSupplierComponent;
  searchText;
  isMobile: boolean;

  public POProjectTour: GuidedTour = {
    tourId: 'po-project-tour',
    useOrb: false,
    steps: [
      {
        title: 'Search a Project',
        selector: '.search-project-po',
        content: 'Select a project to add the materials in purchase order.',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    }
  };
  userId: number;

  constructor(private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
  }

  setLocalStorage() {
    this.userId = Number(localStorage.getItem("userId"));

    const popovers = {
      "userId": this.userId,
      "moduleName": "po",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('po', '1');
      }
    })
  }

  nextStep() { }
  getSupplier(poData: initiatePoData) {
    this.existingPoData = poData;
  }

  getMaterial(poData: initiatePoData) {
    this.existingPoData = poData;
    this.poDetail = poData;
    this.searchText = new String('')
  }

  selectionChange(event) {
    if (event.selectedIndex == 1) {
      if ((localStorage.getItem('po') == "null") || (localStorage.getItem('po') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.POProjectTour);
        }, 1000);
      }
    }
  }

  getPoData(data: initiatePoData) {
    this.existingPoData = data;
    this.searchText = new String('');
  }
}
