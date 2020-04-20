import { Component, OnInit } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom/bom.service';

@Component({
  selector: 'app-my-material',
  templateUrl: './my-material.component.html'
})
export class MyMaterialComponent implements OnInit {

  constructor(private bomService: BomService) { }

  ngOnInit() {

  }
}
