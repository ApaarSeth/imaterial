import {NgModule} from '@angular/core';
import { HeaderLayoutModule } from './header/header.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from 'src/app/shared/material-modules';
import { SidenavListComponent } from './header/sidenav-list.component';



@NgModule({
    imports: [
        MaterialModule,
        FlexLayoutModule
    ] ,
    providers:[],
    exports:[
        HeaderLayoutModule,
        SidenavListComponent
    ],
    declarations: [ 
        HeaderLayoutModule,
        SidenavListComponent
    ]
  })
export class LayoutModule {}
