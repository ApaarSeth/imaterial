import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SignupComponent } from '../signup/signup.component';
import { FacebookPixelService } from "../../../shared/services/fb-pixel.service";
import { VisitorService } from 'src/app/shared/services/visitor.service';

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
  constructor(
    private visitorsService: VisitorService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private fbPixel: FacebookPixelService
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
      this.visitorsService.getGEOLocation(res['ip']).subscribe(res => {
        localStorage.setItem('callingCode', res['calling_code'])
        this.callingCode = res['calling_code']
        this.countryCode = res['country_code2']
      })
    })
  }

  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
  }

}