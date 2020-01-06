import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';

@Injectable()
export class BomResolver implements Resolve<any> {

    constructor(
        private projectService: ProjectService
        ){
    }

    resolve(){

        return this.projectService.getCategory().then(data => {
            console.log("wefrgthyjhgff" , data);
           return data;
        });
    }
}