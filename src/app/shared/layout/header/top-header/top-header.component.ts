import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationInt } from 'src/app/shared/models/notification';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';

@Component({
  selector: "app-top-header",
  templateUrl: "./top-header.component.html"
})

export class TopHeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  notifClicked: boolean = false;
  userId: number;
  notificationObj: NotificationInt[] = [];
  readnotification: NotificationInt[] = [];
  unreadnotification: NotificationInt[] = [];
  unreadnotificationLength: number = null;
  allnotificationLength: number = null;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userId = Number(localStorage.getItem("userId"));
    this.sidenavToggle.emit('loaded');

    this.getNotifications();
  }

  getNotifications(){
    this.userService.getNotification(this.userId).then(res => {
        this.notificationObj = res.data;
        if (this.notificationObj) {
          this.notificationObj.forEach(element => {
            if (element.read == 0) {
              this.unreadnotification.push(element);
            }
            else if (element.read == 1) {
              this.readnotification.push(element);
            }
          })
  
          if (this.unreadnotification && this.unreadnotification.length > 0)
            this.unreadnotificationLength = this.unreadnotification.length;
  
          if (this.readnotification && this.unreadnotification && this.readnotification.length > 0 && this.unreadnotification.length > 0)
            this.allnotificationLength = this.readnotification.length + this.unreadnotification.length;
        }
      })
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  logout() {
    this.router.navigate(['/auth/login']).then(_ => {
      localStorage.clear();
    });
  }
goToProfile(){
  this.router.navigate(['/profile-account']);
  }
  openDiv() {
    if (this.notifClicked == true) {
      this.notifClicked = false
    } else {
      this.notifClicked = true;
    }
  }

  closeDialog() {
    this.notifClicked = false;
  }
}