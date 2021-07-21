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
  public data:string;
  public mime:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public companyI = [];
  public selection = new SelectionModel<any>(true, []);

  constructor(private company:CompanyService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
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
     
     }
   );
  }

 
 private loadCompany(url:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.company.get(url,token)
    .subscribe( data => {
      console.log(data);
      this.companyI = data;
      this.dataSource.data = data;
      console.log('token image');
      let tokenImage = data[4].token;
      console.log(tokenImage);
      this.company.get(`/backend/v1/companies/${tokenImage}/image`,this.jwToken)
      .subscribe( data => {
        console.log(data);
        console.log('datos de la imagen para posicion 4');
        this.data = data.data;
        this.mime = data.mime;
      
      }
      );
    }
    );
  },4000);
}

public onChange(e) {
  console.log(e.checked);
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

  public editCategory(a) : void{
    let token = a;
    console.log(token);
    const dialogRef = this.dialog.open( EditCompanyComponent, {
      height: '450px',
      width: '550px',
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


  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public delete(token:string) : void {
   this.company.delete(`/backend/v1/companies/${token}/delete`,this.jwToken).subscribe(data => {
     console.log(data);
     this.ngOnInit();
  
      },
      error => {
        console.log(error);
     
      }
  );
  }


}
