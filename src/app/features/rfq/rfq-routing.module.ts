import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RefDetailComponent } from "./ref-detail/ref-detail.component";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";
import { ReviewComponent } from "./review/review.component";
import { RFQViewComponent } from "./rfq-view/rfq-view.component";
import { CreateRfqResolver } from "./create-rfq/resolver/createRfq.resolver";
import { CreateRfqComponent } from "./create-rfq/create-rfq.component";
import { CountryResolver } from 'src/app/shared/resolver/country.resolver';

const routes: Routes = [
  {
    path: "",
    component: RefDetailComponent
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
    resolve: { rfqData: CreateRfqResolver },
    component: CreateRfqComponent
  },
  {
    path: "createRfq",
    resolve: { rfqData: CreateRfqResolver },
    component: CreateRfqComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQRoutingModule { }
