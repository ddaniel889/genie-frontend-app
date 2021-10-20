import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  CategoryService } from './../../services/category.service';
import {  AuthenticationService } from './../../services/authentication.service';
import {  ManagerService } from './../../services/manager.service';
import { APP,TOKEN } from './../../services/constants';
import { Router , ActivatedRoute} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { AddCategoryComponent } from '../add-category/add-category.component';
import {SelectionModel} from '@angular/cdk/collections';
import { RolesComponent } from '../roles/roles.component';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit, AfterViewInit{
  public checked = false;
  public box = false;
  public displayedColumns = ['check','Name','Email', 'Role','Company','Country','Store name', 'Address','Status'];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
  //public data:string;
  public mime:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public managerI = [];
  public tokenCategory = [];
  public imageRetrieve = [];
  public selection = new SelectionModel<any>(true, []);
  public data:string;
  public spinner:boolean;
  public table:boolean = false;
  public id: string;
  public company:string;

  constructor(private  actRoute: ActivatedRoute,private manager:ManagerService,private category:CategoryService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.spinner = true;
    this.displayedColumns = ['check','Name','Correo', 'Role','Company','Country','Store name', 'Address','Status'];
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
      this.loadManagers(this.id,this.jwToken);
     }
   );
  }


 private loadManagers(idStore:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.manager.get(`/backend/v1/managers/${idStore}/company`,token) 
    .subscribe( data => {
      console.log(data);
      this.spinner = false;
      this.table = data !== undefined? true:false;
      console.log('managers devueltos');
      this.managerI = data;
      this.company = data[0].admin.company.name;
      console.log(this.managerI);
      this.dataSource.data = data;
     
    }
    
    );
  },4000);
}




  public openDialog() : void {
 
   const dialogRef = this.dialog.open( RolesComponent , {
    height: '350px',
    width: '400px',
    disableClose : true,
    autoFocus : true,
    data: { name: '' },

  });
   dialogRef.afterClosed().subscribe(result => {
    console.log(result)
   
    });
 
  }

 

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
 

}
