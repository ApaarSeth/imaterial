import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationInt } from 'src/app/shared/models/notification';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-top-header",
  templateUrl: "./top-header.component.html"
})

export class TopHeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  notifClicked: boolean = false;
  userId: number;
  unreadnotificationLength: number = null;
  allnotificationLength: number = null;
  userName: string;
  url: string;
  
    notificationObj: NotificationInt[] = [];
  readnotification: NotificationInt[] = [];
  unreadnotification: NotificationInt[] = [];


  subscriptions: Subscription[] = [];
  constructor(
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userId = Number(localStorage.getItem("userId"));
    this.userName = localStorage.getItem("userName");
    this.url = localStorage.getItem("companyImage")
    this.sidenavToggle.emit('loaded');
    this.getNotifications();
  //  this.getNotificationFromLocalstorage();
    this.startSubscriptions();
  }
  startSubscriptions(){
      this.subscriptions.push(
             this.commonService.onUserUpdate$.subscribe(notificationLength => {
                this.unreadnotificationLength = notificationLength;
            })
        );
  }

  getNotifications(){
    this.commonService.getNotification(this.userId);
  }
  getNotificationFromLocalstorage(){
     this.allnotificationLength = Number(localStorage.getItem("all_notification"));
     this.unreadnotificationLength = Number(localStorage.getItem("un_read_notification"));
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
       this.getNotificationData();
        this.notifClicked = false;
    } else {
      this.getNotificationData();
      this.notifClicked = true;
    }
  }
  getNotificationData(){
     this.commonService.getNotificationData(this.userId).then(res => {
       this.notificationObj = [];
        this.notificationObj = res.data;
        this.unreadnotification = [];
        this.readnotification = [];
        this.unreadnotificationLength = 0;
        this.allnotificationLength = 0;
        if (this.notificationObj) {
          this.notificationObj.forEach(element => {
            if (element.read == 0) {
              this.unreadnotification.push(element);
            }
            else if (element.read == 1) {
              this.readnotification.push(element);
            }
          })
  
          if (this.unreadnotification && this.unreadnotification.length > 0){
            this,this.unreadnotificationLength = this.unreadnotification.length;
          //  localStorage.setItem("un_read_notification",this.unreadnotificationLength.toString());
          }
            
  
          if (this.readnotification && this.unreadnotification && this.readnotification.length > 0 && this.unreadnotification.length > 0){
             this.allnotificationLength = this.readnotification.length + this.unreadnotification.length;
           //  localStorage.setItem("all_notification",this.allnotificationLength.toString());
          }
           
        }
     })
  }

  closeDialog() {
    this.notifClicked = false;
  }
    ngOnDestroy() {
     this.subscriptions.forEach(subs => subs.unsubscribe());
  }
}