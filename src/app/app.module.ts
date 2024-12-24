import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './components/category/category.component';
import { CategoryMainComponent } from './components/category-main/category-main.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { SupplierComponent } from './components/supplier/supplier.component';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ProductComponent } from './components/product/product.component';
import { UnitTypeComponent } from './components/unit-type/unit-type.component';
import { BrandComponent } from './components/brand/brand.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
@NgModule({
  declarations: [
    AppComponent,
    CategoryMainComponent,
    CategoryComponent,
    SupplierComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    ProductComponent,
    UnitTypeComponent,
    BrandComponent,
    WarehouseComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    DataTablesModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


