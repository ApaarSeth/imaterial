import { Component, OnInit, ViewChildren } from "@angular/core";
import { PoSupplierComponent } from "./po-supplier/po-supplier.component";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';

@Component({
  selector: "app-initiate-po",
  templateUrl: "./initiate-po.component.html"
})
export class InitiatePoComponent implements OnInit {
  supplier: Suppliers;
  poDetail: RfqMaterialResponse;
  @ViewChildren("poSupplier") poSupplier: PoSupplierComponent;
  searchText = "";

    public POProjectTour: GuidedTour = {
        tourId: 'po-project-tour',
        useOrb: false,
        steps: [
             {
              title:'Search a Project',
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

  constructor(private guidedTourService:GuidedTourService,
    private userGuideService: UserGuideService
  ) {}

  ngOnInit() {}
 setLocalStorage() {
    this.userId = Number(localStorage.getItem("userId"));
    
        const popovers ={
        "userId":this.userId,
        "moduleName":"po",
        "enableGuide":1
    };
        this.userGuideService.sendUserGuideFlag(popovers).then(res=>{
          if(res){
            localStorage.setItem('po', '1');
          }
        })
  }

  nextStep() {}
  getSupplier(supplier: Suppliers) {
    console.log(supplier);
    this.supplier = supplier;
  }
  getMaterial(material: RfqMaterialResponse) {
    this.poDetail = material;
  }
  selectionChange(event){
    if(event.selectedIndex == 1){
        if ((localStorage.getItem('po') == "null") || (localStorage.getItem('po') == '0')) {
       setTimeout(() => {
            this.guidedTourService.startTour(this.POProjectTour);
        }, 1000);
        }
    }
  }
}
