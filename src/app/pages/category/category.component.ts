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
  public checked = false;
  public box = false;
  public displayedColumns = ['ID','Name', 'Description','id'];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public categoryI = [];
  

  constructor(private category:CategoryService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = ['check','token','Name', 'Description','id'];
    this.getToken();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public getToken() : void {
    const object : any = {
      app: APP.DATA,
      token: TOKEN.DATA,
    }; 
    this.authentication.postAuthentication('/backend/v1/authentication/login',object).subscribe( data => {
      console.log(data);
      this.jwToken = data.jwt;
      console.log(this.jwToken);
      this.loadCategories('/backend/v1/categories/',this.jwToken);
     
     }
   );
  }


  

 private loadCategories(url:string, token: string) : void{
  setTimeout(() => {
    this.category.get(url,token)
    .subscribe( data => {
      console.log(data);
      this.categoryI = data;
      this.dataSource.data = data;

    }
    );
  },4000);
}

public onChange(e) {
  console.log(e.checked);
}

  public openDialog() : void {
 
   const dialogRef = this.dialog.open( AddCategoryComponent, {
    height: '320px',
    width: '500px',
    disableClose : true,
    autoFocus : true,
    data: { name: '',description:'' },

  });
   dialogRef.afterClosed().subscribe(result => {
    console.log(JSON.stringify(result));
    this.category.post('/backend/v1/categories/save', result,this.jwToken).subscribe((data)=> {
      console.log(data);
      location.reload();
        },
        error => {
          console.log(error);
        }
   );
      
    });
 
   
   
  }

  public editCategory(a) : void{
    let token = a;
    console.log(token);
    const dialogRef = this.dialog.open( EditCategoryComponent, {
      height: '320px',
      width: '500px',
      disableClose : true,
      autoFocus : true,
      data: { name: '',description:'' },
  
    });
     dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        console.log(JSON.stringify(result));
        this.ngOnInit();
      });
  
  }

  public applyFilterapplyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public delete(token:string) : void {
    console.log(token);
   this.category.delete(`/backend/v1/categories/${token}/delete`,this.jwToken).subscribe(data => {
     console.log(data);
     this.ngOnInit();
  
      },
      error => {
        console.log(error);
     
      }
  );
  
    }
  
}
