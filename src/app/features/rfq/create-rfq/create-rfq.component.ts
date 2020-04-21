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
import { MatStepper } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqQuantityMakesComponent } from "./rfq-quantity-makes/rfq-quantity-makes.component";
import { RfqSupplierComponent } from "./rfq-supplier/rfq-supplier.component";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { AddRFQConfirmationComponent } from 'src/app/shared/dialogs/add-rfq-confirmation/add-rfq-double-confirmation.component';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';

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
  prevIndex: any;
  currentIndex = 0;
  rfqData: AddRFQ;
  finalRfq: AddRFQ;
  completed: boolean = false;

  public RfqProjectTour: GuidedTour = {
    tourId: 'rfq-project-tour',
    useOrb: false,

    steps: [
      {
        title: 'Search Project',
        selector: '.select-project',
        content: 'Select one/multiple projects to add material in the RFQ.',
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
        content: 'Add supplier to whom RFQ needs to be floated.',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    }
  };
  orgId: number;
  userId: number;
  constructor(
    private router: Router,
    private rfqService: RFQService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService
  ) {

  }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));


    if (this.stepper) {
      this.stepper.selectedIndex = history.state.selectedIndex;
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
    this.rfqMaterial = updatedRfq
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
      this.rfqData = res.data as AddRFQ
    });
    this.completed = this.rfqQtyMakes.materialForms.value.forms.every(
      rfqQty => {
        return rfqQty.quantity != null;
      }
    );
  }

  getMaterial(materials: AddRFQ) {
    this.rfqService.addRFQ(materials).then(res => {
      this.route.params.subscribe(param => {
        let rfqId = param['rfqId']
        this.rfqMaterial = res.data as AddRFQ;
        if (!rfqId) {
          this.router.navigate(["/rfq/createRfq", res.data.rfqId], {

            state: { rfqData: res, selectedIndex: 1 }
          });
        }
      })
    });
  }

  selectionChange(event) {
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


}
