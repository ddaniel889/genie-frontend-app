import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component'; 
import { CompanyComponent } from './pages/company/company.component'; 
import { ProductComponent } from './pages/product/product.component'; 
import { StoreComponent } from './pages/store/store.component'; 
import { ManagerComponent } from './pages/manager/manager.component';
import { SubCategoryComponent } from './pages/sub-category/sub-category.component';

const routes: Routes = [
  {path: '', component: CategoryComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'company', component: CompanyComponent},
  {path: 'store', component: StoreComponent},
  {path: 'product', component: ProductComponent},
  {path: 'subcategory', component: SubCategoryComponent},
  {path: 'manager/:id', component: ManagerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
