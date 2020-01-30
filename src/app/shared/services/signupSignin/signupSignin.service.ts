import { Observable } from "rxjs";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: "root"
  })
export class SignInSignupService implements OnInit{
    ngOnInit(): void {
    }
    constructor(private dataService: DataService) {}

    signUp(data) {
        return this.dataService.sendPostRequestSso(API.SIGNUP,data).catch(e=>{
            console.error(e);
        });
      }
}