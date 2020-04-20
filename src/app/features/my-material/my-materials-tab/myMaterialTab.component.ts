import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-my-material-tab',
	templateUrl: './myMaterialTab.component.html'
})
export class MyMaterialTabComponent implements OnInit {
	selectedCategory: any
	constructor() { }

	ngOnInit() {
		this.selectedCategory = [{
			groupName: 'name', materialList: [{
				materialName: 'matname', tradeList: ['waterproffing,firework'],
				materialUnit: 'mt'
			}]
		},];
	}

}