import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SignupComponent } from '../signup/signup.component';
import { FacebookPixelService } from "../../../shared/services/fb-pixel.service";

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

  constructor(
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

  }

  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
  }

}