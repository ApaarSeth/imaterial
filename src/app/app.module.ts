import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { MaterialModule } from './shared/material-modules';
import { HttpClientModule } from '@angular/common/http';
import { HttpInterceptorProviders } from './shared/http-interceptors/http-interceptor-providers';
import { TokenService } from './shared/services/token.service';
import { GlobalLoaderService } from './shared/services/global-loader.service';
import { LayoutModule } from './shared/layout/layout-module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    DashboardModule,
    HttpClientModule,
    LayoutModule
  ],
  providers: [
    HttpInterceptorProviders,
    TokenService,
    GlobalLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
