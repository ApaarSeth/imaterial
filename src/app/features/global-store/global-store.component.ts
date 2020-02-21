import { Component, OnInit } from "@angular/core";
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from "@angular/router";
import { GlobalStoreService } from 'src/app/shared/services/global-store/global-store.service';
import { GlobalProject } from 'src/app/shared/models/GlobalStore/projectWise';

@Component({
  selector: "app-global-store",
  templateUrl: "./global-store.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class GlobalStoreComponent implements OnInit {
  
  buttonName: string = "materialWise";
  globalStoreData: [];
  projectWiseData: GlobalProject[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private globalStoreService: GlobalStoreService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.globalStoreData = data.globalData.data;
    });
  }

  setButtonName(name: string) {

    this.buttonName = name;

    if (this.buttonName === 'projectWise') {

      const orgId = Number(localStorage.getItem("orgId"));

      this.globalStoreService.getProjectWiseData(orgId).then(res => {
        this.projectWiseData = res.data;
      })

    }
  }

  createRfq() {
    this.router.navigate(['/rfq/createRfq']);
  }
}