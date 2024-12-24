import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { CategoryMainComponent } from './components/category-main/category-main.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { ProductComponent } from './components/product/product.component';
import { UnitTypeComponent } from './components/unit-type/unit-type.component';
import { BrandComponent } from './components/brand/brand.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
const routes: Routes = [
  {path: 'category-main',component:CategoryMainComponent},
  {path: 'category', component: CategoryComponent },
  {path: 'supplier', component:SupplierComponent},
  {path: 'product', component:ProductComponent},
  {path: 'unit-type', component:UnitTypeComponent},
  {path: 'brand', component:BrandComponent},
  {path: 'warehouse', component:WarehouseComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
