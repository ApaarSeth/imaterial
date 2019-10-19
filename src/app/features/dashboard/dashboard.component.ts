import {
    Component,
    OnInit,
  } from '@angular/core';
import { ProjectService } from '../../shared/services/projectDashboard/project.service';

  @Component({
    selector: 'dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['../../../assets/scss/main.scss']
  })
  export class DashboardComponent implements OnInit {
    userId : 1;
    constructor(
      private projectService: ProjectService
    ) {}
  
    ngOnInit() {
      this.getProjects();
    }

    getProjects(){
      this.projectService.getProjects(1).then(res => {
        res.data;
        console.log("wefrgthyjhgff" +res);
    });
    }
  }
  