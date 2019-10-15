import {NgModule} from '@angular/core';
import { HeaderLayoutModule } from './header/header.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from 'src/app/shared/material-modules';



@NgModule({
    imports: [
        MaterialModule,
        FlexLayoutModule
    ] ,
    providers:[],
    exports:[
        HeaderLayoutModule
    ],
    declarations: [ 
        HeaderLayoutModule
    ]
  })
export class LayoutModule {}
