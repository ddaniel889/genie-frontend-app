import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  CompanyService } from './../../services/company.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { Company } from './../../models/company';
import { APP,TOKEN } from './../../services/constants';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { AddCompanyComponent } from '../add-company/add-company.component';
import { EditCompanyComponent } from '../edit-company/edit-company.component';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit,AfterViewInit {
  public checked = false;
  public box = false;
  public displayedColumns = [];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
  //public data:string;
  public mime:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public companyI = [];
  public selection = new SelectionModel<any>(true, []);
  public data:string;
  public spinner:boolean;
  public table:boolean = false;

  constructor(private company:CompanyService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.spinner = true;
    this.displayedColumns = ['check','token','photo','Name', 'Code','Country','Currency','id'];
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
      this.loadCompany('/backend/v1/companies/',this.jwToken);
      this.exportCompany('/backend/v1/companies/export',this.jwToken);
     }
   );
  }

 
 private loadCompany(url:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.company.get(url,token)
    .subscribe( data => {
      console.log(data);
      this.spinner = false;
      this.table = true;
      this.companyI = data;
      console.log('valor datos companyI');
      console.log(this.companyI);
      this.dataSource.data = data;
    }
    );
  },4000);
}

private exportCompany(url:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.company.get(url,token)
    .subscribe( data => {
      console.log(data);
      this.data = data.data;
      console.log('datos excel');
      console.log(this.data);
    }
    );
  },4000);
}

public onChange(e) {
  console.log(e.checked);
}

public exportData(): void {
  console.log('hello');
 }

  public openDialog() : void {
 
   const dialogRef = this.dialog.open( AddCompanyComponent, {
    height: '500px',
    width: '550px',
    disableClose : true,
    autoFocus : true,
    data: { 
    name: '',
    photo: '',
    country:''
    },

  });
   dialogRef.afterClosed().subscribe(result => {
    console.log(JSON.stringify(result));
    console.log(result.image)
    let imageObject = result.image
    console.log('valor de token categoria');
    console.log(result.token);
    delete result.image
    this.company.post('/backend/v1/companies/save', result,this.jwToken).subscribe((data)=> {
      console.log(data);
      console.log('valor de token company obtenido');
      let tokenCompany = data.token
      console.log(tokenCompany)
      this.company.post(`/backend/v1/companies/image/${tokenCompany}/save`, imageObject,this.jwToken).subscribe((data)=> {
        console.log('imagen insertada')
        console.log(data);      
        location.reload();
        
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

  public editCategory(a:string) : void{
    let token = a;
    console.log(token);
    const dialogRef = this.dialog.open( EditCompanyComponent, {
      height: '450px',
      width: '550px',
      disableClose : true,
      autoFocus : true,
      data: { name: '',country:'',code:'',currency:'',tokenCompany: token}
  
    });
     dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        console.log(JSON.stringify(result));
        this.company.post('/backend/v1/companies/save', result,this.jwToken).subscribe((data)=> {
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

  public delete(token:string) : void {
   this.company.delete(`/backend/v1/companies/${token}/delete`,this.jwToken).subscribe(data => {
     console.log(data);
     //this.ngOnInit();
     location.reload();
  
      },
      error => {
        console.log(error);
     
      }
  );
  }


}
