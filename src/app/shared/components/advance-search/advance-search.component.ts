import { Component, OnInit, Input } from "@angular/core";
import { CommonService } from '../../services/commonService';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { Projects } from '../../models/GlobalStore/materialWise';

@Component({
    selector: 'advance-search',
    templateUrl: './advance-search.component.html'
})

export class AdvanceSearchComponent implements OnInit {

    @Input('filterType') filterType: string;
    userId: number;
    orgId: number;
    proejectsData: any;

    constructor(
        private commonService: CommonService,
        private projectService: ProjectService
    ) { }

    ngOnInit(): void {
        console.log(this.filterType);
        this.orgId = Number(localStorage.getItem('orgId'));
        this.userId = Number(localStorage.getItem('userId'));
    }

    displayProject(option) {
        return option && option.projectName ? option.projectName : ''
    }

    searchFilter(searchValue: string, type: string) {
        const value = searchValue;
        if (type === 'projects') {
            if (!this.proejectsData) {
                this.getProjects();
            }
        }
    }

    getProjects() {
        this.projectService.getProjects(this.orgId, this.userId, false).then(res => {
            if (res.data.length) {
                this.proejectsData = res.data;
                console.log(JSON.stringify(this.proejectsData));
            }
        });
    }

}