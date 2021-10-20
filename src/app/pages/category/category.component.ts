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
import {SelectionModel} from '@angular/cdk/collections';


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
  //public data:string;
  public mime:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public categoryI = [];
  public tokenCategory = [];
  public imageRetrieve = [];
  public selection = new SelectionModel<any>(true, []);
  public data:string;
  public spinner:boolean;
  public table:boolean = false;
  

  constructor(private category:CategoryService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.spinner = true;
    this.displayedColumns = ['check','token','photo','Name', 'Description','id'];
    this.getToken();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

 
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    console.log('seleccionados');
    console.log(numSelected);
    const elementSelected = this.selection.selected;
    console.log('elemento seleccionado');
    console.log(elementSelected);
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

   public  masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => {
          this.selection.select(row)
          console.log('elemento seleccionado');
          console.log(row);
        }
      );
    }

  public getToken() : void {
    const object : any = {
      app: APP.DATA,
      token: TOKEN.DATA,
    }; 
    this.authentication.postAuthentication('/backend/v1/authentication/login',object).subscribe( data => {
      console.log(data);
      this.jwToken = data.jwt;
      this.loadCategories('/backend/v1/categories/',this.jwToken);
      this.exportCategory('/backend/v1/categories/export',this.jwToken);
     }
   );
  }


 private loadCategories(url:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.category.get(url,token)
    .subscribe( data => {
      console.log('respuesta service category');
      console.log(data);
      this.spinner = false;
      this.table = true;
      this.categoryI = data;
      console.log('vector category');
      console.log(this.categoryI);
      //let mime = data.image.mime;
     // console.log(mime);
     // let data1 = data.image.data;
     // console.log(data1);
     let name = data.name;
     console.log(name);
      this.dataSource.data = data;
     
    }
    
    );
  },4000);
}

private exportCategory(url:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.category.get(url,token)
    .subscribe( data => {
      console.log(data);
      this.data = data.data;
      console.log('datos excel');
      console.log(this.data);
    }
    );
  },4000);
}

public onChange(e,index) {
  console.log(e.checked);
  console.log(e);
  console.log(this.categoryI[index]);
}

  public openDialog() : void {
 
   const dialogRef = this.dialog.open( AddCategoryComponent, {
    height: '370px',
    width: '500px',
    disableClose : true,
    autoFocus : true,
    data: { name: '',photo: '',description:'' },

  });
   dialogRef.afterClosed().subscribe(result => {
    console.log(result)
    let imageObject = result.image
    console.log(JSON.stringify(result));
    delete result.image
    this.category.post('/backend/v1/categories/save', result,this.jwToken).subscribe((data)=> {
      console.log('objeto devuelto en insert category')
      console.log(data);
      let tokenCategory = data.token;
      console.log('token obtenido')
      this.category.post(`/backend/v1/categories/image/${tokenCategory}/save`, imageObject,this.jwToken).subscribe((data)=> {
        console.log(data);
        //location.reload();
          },
          error => {
        console.log(error);
        }
     );
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
      data: { name: '', photo: '',description:'',tokenCategory: token },
  
    });
     dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        console.log(JSON.stringify(result));
        this.ngOnInit();
        this.category.post('/backend/v1/categories/save', result,this.jwToken).subscribe((data)=> {
          console.log('objeto devuelto en update category')
          console.log(data);
          //this.ngOnInit();
          location.reload();
          },
            error => {
              console.log(error);
            }
       );
      });
  
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public exportData(): void {
   console.log('hello');
  }

  public delete(token:string) : void {
   this.category.delete(`/backend/v1/categories/${token}/delete`,this.jwToken).subscribe(data => {
     console.log(data);
     location.reload();
  
      },
      error => {
        console.log(error);
     
      }
  );
    }  
}
