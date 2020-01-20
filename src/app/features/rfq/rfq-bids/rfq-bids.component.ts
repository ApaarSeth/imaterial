import { Component, OnInit } from "@angular/core";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqProjects } from "src/app/shared/models/RFQ/rfqBids";

@Component({
  selector: "app-rfq-bids",
  templateUrl: "./rfq-bids.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class RfqBidsComponent implements OnInit {
  constructor(private rfqService: RFQService) {}
  rfqProjects: RfqProjects;
  ngOnInit() {
    this.rfqService.rfqPo(1, 1).then(res => {
      this.rfqProjects = res.data;
      console.log(this.rfqProjects);
    });
  }
}
