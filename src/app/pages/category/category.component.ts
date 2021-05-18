import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  CategoryService } from './../../services/category.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { Category } from './../../models/category';
import { APP,TOKEN } from './../../services/constants';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  //public categoryI: any = [];
  public displayedColumns = ['ID','Name', 'Description','id'];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public categoryI = [
    {token: 1, name: 'Tecnología', description: ''},
    {token: 2, name: 'Coméstica', description: 'Cuidado personal'},
    {token: 3, name: 'Tienda Digital', description: 'E commerce'}
  ];

  constructor(private category:CategoryService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = ['token','Name', 'Description','id'];
    this.getToken();
    let tt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJPYmplY3RpZnlQYXlsb2FkIjpmYWxzZSwiaXNzIjoiZjI4NzJlY2MtZTU1Yy00ZTRjLTgxMTktYTQ1Y2FiODA5MGJkIiwiUGF5bG9hZCI6IjgwZGMyNThmYTNmNzI3ODU4MzUyNGRjYWY4ZTVjZDU3OTRmMjQ2MjM2MGZlNThmZTE0ZDBmZTdmZmM0NjQxODg1NDhiODkzMjBjOWU3ZmJkYjA1YTdmNWJiM2M1ZDA0NmQ2YTU0ZjhiNzI3ZjRlYTI5YmNhZDlmMDU5NDk2MTIxZjNmNWFlMmIxZWRjOGZkOGUwNTdmNjU2N2U4NmNhYmVhOWNmNzJlOThmYmFhZGJiNGExMjlkZmJkYzE4NGM3OGNkYmM0NjI0NWZjM2U3ODkxODVkN2I1YzU2NWEyZWVmYjM5YjcyZmFkMTJlYWViMjdmOTBiNmFiMTdlOWU5NmUiLCJleHAiOjE2MjEyMjI2OTMsImlhdCI6MTYyMTIyMjI3MywianRpIjoiZjUxNTI0ZjAtMDkxNS00NDY4LTlmMGYtMzA0OWE5NGRlNjA1In0.Gcu1gdTt4HhO3_XoOaGsX8DCqWDJD8QA-SMwr6n5gkM'
   // this.loadCategories('/backend/v1/categories/',tt);
    //this.dataSource.data = this.categoryI;
    this.dataSource.data = this.categoryI;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

   getToken() {
    const object : any = {
      app: APP.DATA,
      token: TOKEN.DATA,
    }; 
    this.authentication.postAuthentication('/backend/v1/authentication/login',object).subscribe( data => {
      console.log(data);
      /*this.policies = policy;
      let reserve = this.policies.reserve
      this.reserveId = reserve.new_id;*/
      this.jwToken = data.jwt;
      console.log(this.jwToken);
      this.loadCategories('/backend/v1/categories/',this.jwToken);
     
     }
   );
  }


 private loadCategories(url:string, token:string) {
  setTimeout(() => {
    this.category.get(url,token)
    .subscribe( data => {
      console.log(data);
      this.dataSource.data = data;
      this.categoryI = data;
     //console.log(this.tarifa);

    }
    );
  },4000);
}

  public openDialog() {
    const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true; 
  dialogConfig.width = "600px"; 
  dialogConfig.height = "460px"; 

  dialogConfig.data = {
    id: 1,
    title: 'Category'
  };
    const dialogRef = this.dialog.open(AddCategoryComponent,dialogConfig );
    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
     /* this.client.post('tarifa', result).subscribe((data)=> {
        console.log(data);
        this.ngOnInit();
        this.router.navigateByUrl('/tiendas/tarifas');
          },
          error => {
            console.log(error);
          }
     );*/
    });
  }

  editCategory(a) {
    let id = a.id;
    const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true; 
  dialogConfig.width = "600px"; 
  dialogConfig.height = "460px"; 

  dialogConfig.data = {
    id: 1,
    title: 'Edit Category',
    data: id
  };
    const dialogRef = this.dialog.open(EditCategoryComponent,dialogConfig );
    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
      this.ngOnInit();
    });
  }

  applyFilterapplyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete() {
   /* this.client.delete('tarifa/',id).subscribe(data => {
     this.ngOnInit();
  
      },
      error => {
        console.log(error);
     
      }
  );*/
  console.log('delete');
    }
  


}
