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
// declare const geoip2: any;
@Component({
  selector: "sign-in-sign-up",
  templateUrl: "./sign-in-sign-up.component.html"
})

export class SignInSignUpComponent implements OnInit {
  // onSuccess(location) {
  //   // alert("Lookup successful:\n\n" + JSON.stringify(location, undefined, 4));
  //   console.log(location)
  // };

  // onError(error) {
  //   alert("Error:\n\n" + JSON.stringify(error, undefined, 4));
  // };



  tabClicked: string = "Sign In";
  uniqueCode: string;
  index: number;
  callingCode: string;
  countryCode: string;
  countryList: CountryCode[] = [];
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
    // geoip2.city(this.onSuccess, this.onError);    // this.webNotificationService.subscribeToNotification()
    this.fbPixel.load();
    this.fbPixel.fire('PageView');
    if (localStorage.getItem("accessToken")) {
      this.router.navigate(['/dashboard'])
    }
    this._activatedRoute.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      this.index = this.uniqueCode ? 1 : 0;
    });
    //   Promise.all([this.visitorsService.getGEOLocation(), this.commonService.getCountry()]).then(res => {
    //     this.callingCode = res[0]['countryCode'] === 'IN' ? '+91' : 'null';
    //     this.countryCode = res[0]['countryCode']
    //     localStorage.setItem('countryCode', this.countryCode)
    //     localStorage.setItem('callingCode', this.callingCode)
    //     this.countryList = res[1]['data']
    //   }).catch(err => {
    //     this.fallBackData()
    //   })
    // }
    this.callingCode = 'null';
    this.countryCode = 'US'
    localStorage.setItem('countryCode', this.countryCode)
    localStorage.setItem('callingCode', this.callingCode)
    // fallBackData() {
    //   localStorage.setItem('callingCode', "+91");
    //   localStorage.setItem('countryCode', 'IN')
    //   this.callingCode = "+91";
    //   this.countryCode = "IN";
    //   this.dataService.getRequest(API.COUNTRYCODE, null, { skipLoader: true }).then(res => {
    //     if (res.data) {
    //       this.countryList = res.data;
    //     }
    //   })
  }

  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
  }

}