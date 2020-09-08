import { BrowserModule, HammerModule } from "@angular/platform-browser";
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
import { BomResolver } from "./features/dashboard/bom/bom.resolver";
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
import { HeaderSharedModule } from './shared/header/header-shared.module';
import { ProfileLayoutComponent } from './shared/layout/profile-layout/profile-layout.component';
import { AfterSignUpGuardService } from './shared/guards/afterSignUpGaurd';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { ProfileComponent } from './features/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PICK_FORMATS, PickDateAdapter } from './shared/services/date.service';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { TaxCostService } from './shared/services/taxcost.service';
import { MySubscriptionsComponent } from './features/users/my-subscriptions/my-subscriptions.component';
import { SubscriptionRedirectionsComponent } from './features/subscription-redirections/subscription-redirections.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SubscriptionGaurdService } from './shared/guards/subscription.gaurd';
import { GrnComponent } from './features/grn/grn.component';
import { BuySubscriptionsComponent } from './shared/components/subscriptions/buy-subscriptions/buy-subscriptions.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    NotFoundComponent,
    SupplierBidLayoutComponent,
    AppDashboardComponent,
    ProfileLayoutComponent,
    ProfileComponent,
    MySubscriptionsComponent,
    SubscriptionRedirectionsComponent,
    BuySubscriptionsComponent,
    GrnComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    MatDialogModule,
    NgxMatDrpModule,
    // AuthModule,
    LayoutModule,
    DashboardModule,
    AppSharedModule,
    UserDashboardModule,
    NgxGoogleAnalyticsModule.forRoot(environment.ga),
    NgxGoogleAnalyticsRouterModule,
    RouterModule,
    GuidedTourModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderSharedModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),

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
    AfterSignUpGuardService,
    SubscriptionGaurdService,
    GuidedTourService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    TaxCostService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }