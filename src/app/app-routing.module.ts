import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component'; 
import { CompanyComponent } from './pages/company/company.component'; 
import { StoreComponent } from './pages/store/store.component'; 

const routes: Routes = [
  {path: '', component: CategoryComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'company', component: CompanyComponent},
  {path: 'store', component: StoreComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
