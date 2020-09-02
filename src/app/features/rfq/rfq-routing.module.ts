import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";
import { ReviewComponent } from "./review/review.component";
import { RFQViewComponent } from "./rfq-view/rfq-view.component";
import { CreateRfqComponent } from "./create-rfq/create-rfq.component";
import { RfqDetailComponent } from "./rfq-detail/rfq-detail.component";

const routes: Routes = [
  {
    path: "",
    component: RfqDetailComponent
  },
  {
    path: "rfq-bid/:id",
    data: { breadcrumb: 'RFP Bid' },
    component: RfqBidsComponent
  },
  {
    path: "review/:rfqId",
    data: { breadcrumb: 'RFP Review' },
    component: ReviewComponent
  },
  {
    path: "rfq-view/:id",
    data: { breadcrumb: 'RFP View' },
    component: RFQViewComponent
  },
  {
    path: "createRfq/:rfqId",
    component: CreateRfqComponent
  },
  {
    path: "createRfq",
    component: CreateRfqComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})

export class RFQRoutingModule { }
