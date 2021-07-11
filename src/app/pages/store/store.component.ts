import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { Store } from './../../models/store';
import { APP,TOKEN } from './../../services/constants';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { AddStoreComponent } from '../add-store/add-store.component';
import { EditStoreComponent } from '../edit-store/edit-store.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements  OnInit, AfterViewInit {
  public checked = false;
  public box = false;
  public options = false;
  public displayedColumns = ['ID','Name', 'Description','id'];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
  public data:string;
  public mime:string;
  public storeI =  [];
  public tokenCategory:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(private store:StoreService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = ['check','token','photo','Store name','Status','Company','Country','Currency', 'Address','id'];
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
      //this.loadStores('/backend​/v1​/stores​/',this.jwToken); 
        /*this.categoryI = data;
      this.dataSource.data = data;*/
      this.loadStores('/backend/v1/stores/',this.jwToken);
    
     }
   );
  }

  
 private loadImageCategories(url:string,jwToken:string) : void{
  setTimeout(() => {
    this.store.get(url,jwToken)
    .subscribe( data => {
      console.log(data);
 
    }
    );
  },4000);//borrar
}  


private loadStores(url:string, token: string) : void{
console.log('url enviada');
console.log(url)
console.log('token enviada');
console.log(token)

const timeout = setTimeout(() => {
  clearTimeout(timeout) 
  this.store.get(url,token)
  .subscribe( data => {
    console.log(data);
    this.storeI = data;
    this.dataSource.data = data;
    console.log('token image');
    let tokenImage = data[0].token;
    console.log(tokenImage);
    this.store.get(`/backend/v1/stores/${tokenImage}/image`,this.jwToken)
    .subscribe( data => {
      console.log(data);
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
  this.options = true;
}


public openDialog() : void {
  const dialogRef = this.dialog.open( AddStoreComponent, {
   height: '600px',
   width: '800px',
   disableClose : true,
   autoFocus : true,
   data: { name: '',photo: '',description:'' },

 });
  dialogRef.afterClosed().subscribe(result => {
   console.log(result)
   let imageObject = result.image
   this.tokenCategory = result.token;
   console.log(JSON.stringify(result));
   delete result.image
   this.store.post('/backend/v1/stores/save', result,this.jwToken).subscribe((data)=> {
     console.log('objeto devuelto en insert stores')
     console.log(data);
     console.log('token obtenido')
     this.store.post(`/backend/v1/stores/image/${this.tokenCategory}/save`, imageObject,this.jwToken).subscribe((data)=> {
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

 public editStore(a) : void{
  let token = a;
  console.log('token recibido para editar')
  console.log(token);
  const dialogRef = this.dialog.open( EditStoreComponent, {
    height: '600px',
    width: '800px',
    disableClose : true,
    autoFocus : true,
    data: { store: '', country: '',photo:'', currency:'', company:'', address:'',token: token },

  });
   dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(JSON.stringify(result));
      this.store.post('/backend/v1/stores/save', result,this.jwToken).subscribe((data)=> {
        console.log('objeto devuelto en update stores')
        console.log(data);
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
  this.store.delete(`/backend/v1/stores/${token}/delete`,this.jwToken).subscribe(data => { 
    console.log(data);
    this.ngOnInit();
     },
     error => {
       console.log(error);
     }
 );
   } 




}
