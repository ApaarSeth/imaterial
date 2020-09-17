import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewChildren
} from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import {
  RfqMaterialResponse,
  AddRFQ,
  RfqMat
} from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute, Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
import { FormBuilder } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq.service";
import { RfqQuantityMakesComponent } from "./rfq-quantity-makes/rfq-quantity-makes.component";
import { RfqSupplierComponent } from "./rfq-supplier/rfq-supplier.component";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { AddRFQConfirmationComponent } from 'src/app/shared/dialogs/add-rfq-confirmation/add-rfq-double-confirmation.component';
import { UserGuideService } from 'src/app/shared/services/user-guide.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { ProjectService } from 'src/app/shared/services/project.service';
import { ProjectDetails } from 'src/app/shared/models/project-details';
import { CountryCode } from 'src/app/shared/models/currency';
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';

@Component({
  selector: "app-create-rfq",
  templateUrl: "./create-rfq.component.html"
})

export class CreateRfqComponent implements OnInit {

  @ViewChild("stepper", { static: true, read: MatStepper }) stepper: MatStepper;
  @ViewChild("rfqQtyMakes", { static: true })
  rfqQtyMakes: RfqQuantityMakesComponent;
  @ViewChild("rfqSupplier", { static: true }) rfqSupplier: RfqSupplierComponent;
  qtyMakes: RfqQuantityMakesComponent;
  updatedRfqMaterial: AddRFQ;
  rfqMaterial: AddRFQ;
  stpForm: any;
  prevIndex: number = null;
  currentIndex: number = 0;
  rfqData: AddRFQ = null;
  finalRfq: AddRFQ;
  completed: boolean = false;
  countryList: CountryCode[] = [];
  isMobile: boolean;
  orgId: number;
  userId: number;
  id: number;
  allProject: ProjectDetails[] = [];
  allSupplier: Suppliers[] = [];
  supplierModuleFeature: any = {};

  public RfqProjectTour: GuidedTour = {
    tourId: 'rfq-project-tour',
    useOrb: false,
    steps: [
      {
        title: 'Search Project',
        selector: '.select-project',
        content: 'Select one/multiple projects to add material in the RFP.',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    }
  };

  public RfqSupplierTour: GuidedTour = {
    tourId: 'rfq-supplier-tour',
    useOrb: false,
    steps: [
      {
        title: 'Add Supplier',
        selector: '.add-supplier-btn',
        content: 'Add supplier to whom RFP needs to be floated.',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    }
  };

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private loader: GlobalLoaderService,
    private commonService: CommonService,
    private rfqService: RFQService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService
  ) { }

  ngOnChanges(): void {
    this.commonService.baseCurrency.subscribe(val => {
    })
  }

  ngOnInit() {
    let userId = Number(localStorage.getItem("userId"));
    let orgId = Number(localStorage.getItem("orgId"));
    this.id = this.route.snapshot.params[ 'rfqId' ];

    Promise.all([ this.commonService.getSuppliers(orgId), this.projectService.getProjects(orgId, userId), this.commonService.getCountry() ]).then(res => {
      if (this.id) { this.loader.hide() }
      this.supplierModuleFeature = res[ 0 ].data.moduleFeatures;
      this.allSupplier = res[ 0 ].data.supplierList;
      this.allProject = res[ 1 ].data
      this.countryList = res[ 2 ].data
    });

    this.isMobile = this.commonService.isMobile().matches;
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    if (this.stepper) {
      this.stepper.selectedIndex = history.state.selectedIndex;
      this.currentIndex = history.state.selectedIndex ? history.state.selectedIndex : 0;
      this.prevIndex = this.currentIndex
      this.rfqService.stepperIndex.next(this.currentIndex)
      if (this.stepper.selectedIndex == 0) {
        if ((localStorage.getItem('rfq') == "null") || (localStorage.getItem('rfq') == '0')) {
          setTimeout(() => {
            this.guidedTourService.startTour(this.RfqProjectTour);
          }, 1000);
        }
      }
      if (this.stepper.selectedIndex == 2) {
        if ((localStorage.getItem('rfq') == "null") || (localStorage.getItem('rfq') == '0')) {
          setTimeout(() => {
            this.guidedTourService.startTour(this.RfqSupplierTour);
          }, 1000);
        }
      }
      if (history.state.rfqData) {
        this.rfqMaterial = history.state.rfqData.data;
      }
    }

    // this.route.params.subscribe(params => {
    //   if (this.stepper) {
    //     this.stepper.selectedIndex = params.selectedIndex - 1;
    //     if (history.state.rfqData) {
    //       this.rfqMaterial = history.state.rfqData.data;
    //     }
    //   }
    // });
  }

  getSupplierData(updatedRfq: AddRFQ) {
    this.rfqService.addRFQ(updatedRfq).then((res) => {
      this.rfqMaterial = res.data as AddRFQ
    })
  }

  setLocalStorage() {
    const popovers = {
      "userId": this.userId,
      "moduleName": "rfq",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('rfq', '1');
      }
    })
  }


  getQuantityAndMakes(updatedMaterials: AddRFQ) {
    this.rfqService.addRFQ(updatedMaterials).then((res) => {
      this.finalRfq = res.data as AddRFQ
      this.rfqService.mat.next(res.data)
      this.rfqData = res.data as AddRFQ
    });
    this.completed = this.rfqQtyMakes && this.rfqQtyMakes.materialForms.value.forms.every(
      rfqQty => {
        return rfqQty.quantity != null;
      }
    );
  }

  getMaterial(materials: AddRFQ) {
    this.route.params.subscribe(param => {
      let rfqId = param[ 'rfqId' ]
      if (!rfqId) this.loader.show()
      this.rfqService.addRFQ(materials, !rfqId ? true : false).then(res => {

        if (!rfqId) {
          this.router.navigate([ "/rfq/createRfq", res.data.rfqId ], {
            state: { rfqData: res, selectedIndex: 1 }
          });
        }
        else {
          this.rfqMaterial = res.data as AddRFQ;
        }
      })
    });
  }

  selectionChange(event) {
    if (event.selectedIndex === 0) {
      this.rfqData = null;
    }
    this.currentIndex = event.selectedIndex;
    this.prevIndex = event.previouslySelectedIndex;
    this.rfqService.stepperIndex.next(this.prevIndex)
    if (event.selectedIndex == 0) {
      if ((localStorage.getItem('rfq') == "null") || (localStorage.getItem('rfq') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.RfqProjectTour);
        }, 1000);
      }
    }
    if (event.selectedIndex == 2) {
      if ((localStorage.getItem('rfq') == "null") || (localStorage.getItem('rfq') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.RfqSupplierTour);
        }, 1000);
      }
    }
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  reviewRfq() {
    //  this.rfqSupplier.reviewRfq();
  }

  checkSupplStatus() {
    return this.rfqSupplier.supplierForm.value.some(supplier => {
      return supplier != null;
    });
  }

  // <!-- * ngIf="this.currentIndex === 0 && allProject.length ? (this.prevIndex === 0 ? true : rfqData) : false" -- >

}
