import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html'
})

export class TermsConditionsComponent implements OnInit {

  constructor(private _userService: UserService) { }

  ngOnInit() {
    
  }

  logout(){
      this._userService.logoutUser();
  }
}