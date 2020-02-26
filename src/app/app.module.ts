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
import { BomResolver } from "./features/bom/bom.resolver";
import { RFQResolver } from "./features/rfq/resolver/rfq.resolver";
import { PODetailListResolver } from "./features/po/resolver/po-detail-list-resolver";
import { AuthLayoutComponent } from "./shared/layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./shared/layout/main-layout/main-layout.component";
import { NotFoundComponent } from "./features/not-found/not-found.component";
import { SupplierBidLayoutComponent } from "./shared/layout/supplier-bid-layout/supplier-bid-layout.component";
import { AppSharedModule } from "./shared/app-shared-module";
import { AppDashboardComponent } from "./features/app-dashboard/app-dashboard.component";
import { AuthGuardService } from "./shared/guards/auth.guards";
import { UserDashboardModule } from "./features/users/user-dashboard.module";
import { UserDataGuardService } from "./shared/guards/user-data.guards";
import { RouterModule } from '@angular/router';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    NotFoundComponent,
    SupplierBidLayoutComponent,
    AppDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    LayoutModule,
    DashboardModule,
    AppSharedModule,
    UserDashboardModule,
    RouterModule,
    GuidedTourModule
  ],
  providers: [
    HttpInterceptorProviders,
    TokenService,
    GlobalLoaderService,
    DashBoardResolver,
    RFQResolver,
    BomResolver,
    PODetailListResolver,
    AuthGuardService,
    UserDataGuardService,
    GuidedTourService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }