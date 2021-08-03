import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './pages/category/category.component';
import {  CategoryService } from './services/category.service';
import {  AuthenticationService } from './services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatSidenavModule} from '@angular/material';
import {MatListModule} from '@angular/material/list'
import {MatToolbarModule} from '@angular/material'
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import {MatDividerModule} from '@angular/material';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule}   from '@angular/material/dialog';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { CompanyComponent } from './pages/company/company.component';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { EditCompanyComponent } from './pages/edit-company/edit-company.component';
import { StoreComponent } from './pages/store/store.component';
import { AddStoreComponent } from './pages/add-store/add-store.component';
import { EditStoreComponent } from './pages/edit-store/edit-store.component';
import { AgmCoreModule } from '@agm/core';
import { AddChangesComponent } from './pages/add-changes/add-changes.component';
import { StoreDetailComponent } from './pages/store-detail/store-detail.component';
import { DelegateComponent } from './pages/delegate/delegate.component';


@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    CompanyComponent,
    AddCompanyComponent,
    EditCompanyComponent,
    StoreComponent,
    AddStoreComponent,
    EditStoreComponent,
    AddChangesComponent,
    StoreDetailComponent,
    DelegateComponent
  ],
  entryComponents: [ AddCategoryComponent, EditCategoryComponent,AddCompanyComponent,EditCompanyComponent, AddStoreComponent, 
     EditStoreComponent,AddChangesComponent,StoreDetailComponent, DelegateComponent],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCJX1NLWfDuPaQIi90-215TKfgpIYKAHDY'
    }),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,MatInputModule
  ],
  providers: [ HttpClient,CategoryService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
