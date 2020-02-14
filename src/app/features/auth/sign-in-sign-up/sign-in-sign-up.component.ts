import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignINDetailLists } from "../../../shared/models/signIn/signIn-detail-list";
import { from } from "rxjs";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { Router } from "@angular/router";

export interface OrganisationType {
  value: string;
  viewValue: string;
}

@Component({
  selector: "sign-in-sign-up",
  templateUrl: "./sign-in-sign-up.component.html"
})
export class SignInSignUpComponent implements OnInit {
  tabClicked: string = 'Sign In';
  constructor(
    private router: Router
  ) {}
  ngOnInit() {
    
  }
  tabChanged(event) {
    this.tabClicked = event.tab.textLabel;
}


}