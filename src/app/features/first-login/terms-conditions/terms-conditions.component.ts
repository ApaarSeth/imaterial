import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html'
})

export class TermsConditionsComponent implements OnInit {
  agreeSelected: boolean = false;

  constructor(private _userService: UserService, private router:Router) { }

  ngOnInit() {
    
  }

  logout(){
      this._userService.logoutUser();
  }
  acceptTerms(){
    this._userService.postTerms(1).then(res=> {
      if(res.data)
       this.router.navigate(['/profile/update-info']);
    })
  }
  agree(event){
    if(event.checked){
      this.agreeSelected = true;
    }
    else{
       this.agreeSelected = false;
    }
  }
}