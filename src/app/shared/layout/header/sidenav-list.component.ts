import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PermissionService } from '../../services/permission.service';
import { HeaderConstants } from '../../constants/configuration-constants';
 
@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.html',
  styleUrls: ['../../../../assets/scss/main.scss']
})
export class SidenavListComponent implements OnInit {

  role: string;
  permissionObj: any;
  notifClicked: boolean = false;
  userId: number;
  headerConst: { name: string, link: string }[]
  @Output() sidenavClose = new EventEmitter();
  orgId: number;
 
  constructor( private permissionService: PermissionService,) { }
 
  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.role = localStorage.getItem("role");
    if (this.role) {
      this.permissionObj = this.permissionService.checkPermission(this.role);
      this.headerConst = HeaderConstants.PERMISSIONHEADER(this.permissionObj, this.orgId);
    }
  }
 
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
 
}