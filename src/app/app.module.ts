import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardModule } from "./features/dashboard/dashboard.module";
import { MaterialModule } from "./shared/material-modules";
import { HttpClientModule } from "@angular/common/http";
import { HttpInterceptorProviders } from "./shared/http-interceptors/http-interceptor-providers";
import { TokenService } from "./shared/services/token.service";
import { GlobalLoaderService } from "./shared/services/global-loader.service";
import { LayoutModule } from "./shared/layout/layout-module";
import { DashBoardResolver } from "./features/dashboard/resolver/dashboard.resolver";
import { BomModule } from "./features/bom/bom.module";
import { BomResolver } from "./features/bom/bom.resolver";
import { RFQResolver } from "./features/rfq/resolver/rfq.resolver";
import { PODetailListResolver } from "./features/po/resolver/po-detail-list-resolver";
import { PoComponent } from "./features/po/po.component";
// import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    LayoutModule,
    DashboardModule,
    // FroalaEditorModule.forRoot(),
    // FroalaViewModule.forRoot()
  ],
  providers: [
    HttpInterceptorProviders,
    TokenService,
    GlobalLoaderService,
    DashBoardResolver,
    RFQResolver,
    BomResolver,
    PODetailListResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
