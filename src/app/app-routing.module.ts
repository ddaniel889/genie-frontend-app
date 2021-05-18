import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component'; 

const routes: Routes = [
  {path: '', component: CategoryComponent},
  {path: 'category', component: CategoryComponent},

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
