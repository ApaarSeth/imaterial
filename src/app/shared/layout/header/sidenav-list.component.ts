import { Component, OnInit, Output, EventEmitter } from '@angular/core';
 
@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.html',
  styleUrls: ['../../../../assets/scss/main.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
 
  constructor() { }
 
  ngOnInit() {
  }
 
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
 
}