import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/userDashboard/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html"
})
export class MainLayoutComponent implements OnInit {
  subscription : Subscription;
  subscriptions: Subscription[] = [];
  userId: number;
  userName: string;
  url: string;

  constructor(private router: Router, private _userService: UserService) {}

  loaded = '';
  ngOnInit() { 
    this.userId = Number(localStorage.getItem("userId"));
    this.userName = localStorage.getItem("userName");
    this.url = localStorage.getItem('profileUrl');
    this.startSubscriptions();
  }


  isLoaded(event) {
    this.loaded = event
  }
  
  goToProfile(sidenav){
  this.router.navigate(['/profile-account']).then(_=>{
    sidenav.close();
  });
  
  }
  
  startSubscriptions(){
      this.subscriptions.push(
            this._userService.UpdateProfileImage.subscribe(image => {
              this.url = image;
              localStorage.setItem('profileUrl',this.url);
            })
        );
  }



  ngOnDestroy() {
     this.subscriptions.forEach(subs => subs.unsubscribe());
  }
}
