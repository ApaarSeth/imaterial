import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SignupComponent } from '../signup/signup.component';

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
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this._activatedRoute.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      this.index = this.uniqueCode ? 1 : 0;
    });

  }

  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
  }

}