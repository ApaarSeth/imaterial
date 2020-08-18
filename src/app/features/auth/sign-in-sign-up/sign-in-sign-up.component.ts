import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SignupComponent } from '../signup/signup.component';
import { FacebookPixelService } from "../../../shared/services/fb-pixel.service";
import { CountryCode } from "../../../shared/models/currency";
import { VisitorService } from "../../../shared/services/visitor.service";
import { GlobalLoaderService } from "../../../shared/services/global-loader.service";
import { CommonService } from "../../../shared/services/commonService";
import { DataService } from "../../../shared/services/data.service";
import { API } from "../../../shared/constants/configuration-constants";


export interface OrganisationType {
  value: string;
  viewValue: string;
}
@Component({
  selector: "sign-in-sign-up",
  templateUrl: "./sign-in-sign-up.component.html"
})

export class SignInSignUpComponent implements OnInit {
  tabClicked: string = "Sign In";
  uniqueCode: string;
  index: number;
  callingCode: string;
  countryCode: string;
  countryList: CountryCode[] = [];
  constructor(
    private visitorsService: VisitorService,
    private router: Router,
    private commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private fbPixel: FacebookPixelService,
  ) { }

  ngOnInit() {
    this.fbPixel.load();
    this.fbPixel.fire('PageView');
    if (localStorage.getItem("accessToken")) {
      this.router.navigate(['/dashboard'])
    }
    this._activatedRoute.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      this.index = this.uniqueCode ? 1 : 0;
    });

    Promise.all([this.visitorsService.getGEOLocation(), this.commonService.getCountry()]).then(res => {
      this.countryList = res[1]['data']
      this.callingCode = res[0]['countryCode'] === 'IN' ? '+91' : 'null';
      this.countryCode = res[0]['countryCode']
      localStorage.setItem('countryCode', this.countryCode)
      localStorage.setItem('callingCode', this.callingCode)

    }).catch(err => {
      this.fallBackData()
    })
  }

  /* In case the location api fails then setting default country as India */
  fallBackData() {
    localStorage.setItem('callingCode', "+91");
    localStorage.setItem('countryCode', 'IN')
    this.callingCode = "+91";
    this.countryCode = "IN";
    this.commonService.getCountry().then(res => {
      if (res.data) {
        this.countryList = res.data;
      }
    })
  }

  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
  }

}