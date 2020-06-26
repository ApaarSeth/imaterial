import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SignupComponent } from '../signup/signup.component';
import { FacebookPixelService } from "../../../shared/services/fb-pixel.service";
import { VisitorService } from 'src/app/shared/services/visitor.service';
import { DataService } from 'src/app/shared/services/data.service';
import { API } from 'src/app/shared/constants/configuration-constants';
import { CountryCode } from 'src/app/shared/models/currency';
import { CommonService } from 'src/app/shared/services/commonService';
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';

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
  countryList: CountryCode[]
  constructor(
    private visitorsService: VisitorService,
    private router: Router,
    private loader: GlobalLoaderService,
    private commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private fbPixel: FacebookPixelService,
    private dataService: DataService
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
    this.visitorsService.getIpAddress().subscribe(res => {
      this.loader.show()
      Promise.all([this.visitorsService.getGEOLocation(res['ip']), this.dataService.getRequest(API.COUNTRYCODE, null, { skipLoader: true })]).then(res => {
        localStorage.setItem('countryCode', res[0]['calling_code'])
        this.callingCode = res[0]['calling_code']
        this.countryCode = res[0]['country_code2']
        this.countryList = res[1]['data']
        this.loader.hide()
      })
    })
  }

  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
  }

}