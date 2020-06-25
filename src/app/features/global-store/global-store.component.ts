import { Component, OnInit } from "@angular/core";
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from "@angular/router";
import { GlobalStoreService } from 'src/app/shared/services/global-store/global-store.service';
import { GlobalProject } from 'src/app/shared/models/GlobalStore/projectWise';
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
  selector: "app-global-store",
  templateUrl: "./global-store.component.html",
  styleUrls: [ "../../../assets/scss/main.scss" ]
})
export class GlobalStoreComponent implements OnInit {

  buttonName: string = "materialWise";
  globalStoreData: [];
  projectWiseData: GlobalProject[] = [];
  materialDataLength: number;
  projectDataLength: number;
  userId: number;
  isMobile: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private globalStoreService: GlobalStoreService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.userId = Number(localStorage.getItem("userId"));
    this.route.data.subscribe(data => {
      this.globalStoreData = data.globalData.data;
    });
    this.getNotifications();
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
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
    this.router.navigate([ '/rfq/createRfq' ]);
  }
  materialShowDataLength(event) {
    this.materialDataLength = event;
  }
  projectShowDataLength(event) {
    this.projectDataLength = event;
  }
}