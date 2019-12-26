import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';

@Injectable()
export class DashBoardResolver implements Resolve<any> {

    constructor(
        private projectService: ProjectService
        ){
    }

    resolve(){

        return this.projectService.getProjects(1).then(data => {
            console.log("wefrgthyjhgff" , data.message);
           return data.message;
        });
    }
}