import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import {  ManagerService } from './../../services/manager.service';
import { Store } from './../../models/store';
import { APP,TOKEN } from './../../services/constants';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { AddStoreComponent } from '../add-store/add-store.component';
import { EditStoreComponent } from '../edit-store/edit-store.component';
import { AddChangesComponent } from '../add-changes/add-changes.component';
import { AddAdminComponent } from '../add-admin/add-admin.component';
import { StoreDetailComponent } from '../store-detail/store-detail.component';
import { DelegateComponent } from '../delegate/delegate.component';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements  OnInit, AfterViewInit {
  public checked = false;
  public box = false;
  public options:boolean;
  public displayedColumns = ['ID','Name', 'Description','id'];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
 // public data:string;
  public mime:string;
  public storeI =  [];
  public numStore : number;
  public tokenCategory:string;
  public data:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public selection = new SelectionModel<any>(true, []);
  public spinner:boolean;
  public table:boolean = false;


  constructor(private store:StoreService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog,private manager:ManagerService ) { }

  ngOnInit() {
    this.spinner = true;
    this.options = false;
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
      //this.loadStores('/backend???/v1???/stores???/',this.jwToken); 
        /*this.categoryI = data;
      this.dataSource.data = data;*/
      let storeToken = '56811db6-ae62-4cc2-b180-bdf456a04b1d';  
      this.loadStores(`/backend/v1/stores/?storeToken=${storeToken}`,this.jwToken);  
      this.exportStore('/backend/v1/stores/export',this.jwToken);
     }
   );
  }

  public isAllSelected() : boolean {
    this.options = true;
    const numSelected = this.selection.selected.length;
    this.numStore = numSelected;
    console.log('seleccionados');
    console.log(numSelected);
    const elementSelected = this.selection.selected;
    console.log('elemento seleccionado');
    console.log(elementSelected);
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public deleteCheck() : void {
    this.options = false;
    this.selection.clear();
  }

  public masterToggle() : void {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => {
          this.selection.select(row)
          console.log('elemento seleccionado');
          console.log(row);
          
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
    this.spinner = false;
    this.table = true;
    this.storeI = data;
    this.dataSource.data = data;
    console.log('token image');
    let tokenImage = data[0].token;
    console.log(tokenImage);
   /* this.store.get(`/backend/v1/stores/${tokenImage}/image`,this.jwToken)
    .subscribe( data => {
      console.log(data);
      this.data = data.data;
      this.mime = data.mime;
    }
    );*/
  }
  );
},4000);

}

private exportStore(url:string, token: string) : void{
  const timeout = setTimeout(() => {
    clearTimeout(timeout) 
    this.store.get(url,token)
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


public storeDetail(a:string,b:string) : void {
  let token = a;
  let storToken = b;
  const dialogRef = this.dialog.open( StoreDetailComponent, {
   height: '600px',
   width: '800px',
   disableClose : true,
   autoFocus : true,
   data: { name: '',photo: '',description:'',token: token,storToken: storToken },

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
     let tokenRetrieve = data.token;
     this.store.post(`/backend/v1/stores/image/${tokenRetrieve}/save`, imageObject,this.jwToken).subscribe((data)=> {
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
     location.reload();
   
     },
       error => {
         console.log(error);
       }
  );
   });

 }

 
 public openChanges() : void {
  const dialogRef = this.dialog.open( AddChangesComponent, {
   height: '450px',
   width: '600px',
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
   /*this.store.post('/backend/v1/stores/save', result,this.jwToken).subscribe((data)=> {
     console.log('objeto devuelto en insert stores')
     console.log(data);
     let tokenRetrieve = data.token;
     this.store.post(`/backend/v1/stores/image/${tokenRetrieve}/save`, imageObject,this.jwToken).subscribe((data)=> {
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
  );*/
   });

 }

 public openDelegate(a:string) : void {
  let tokenId = a; 
  const dialogRef = this.dialog.open( DelegateComponent, {
   height: '480px',
   width: '600px',
   disableClose : true,
   autoFocus : true,
   data: { token: tokenId },

 });
  dialogRef.afterClosed().subscribe(result => {
   console.log(result)
  
   });

 }

 public editStore(a,b) : void{
  let token = a;
  let storToken = b;
  console.log('token recibido para editar')
  console.log(token);
  const dialogRef = this.dialog.open( EditStoreComponent, {
    height: '600px',
    width: '800px',
    disableClose : true,
    autoFocus : true,
    data: { store: '', country: '',photo:'', currency:'', company:'', address:'',token: token,storToken: storToken},
  });
   dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(JSON.stringify(result));
      let imageObject = result.image
      this.tokenCategory = result.token;
      console.log(JSON.stringify(result));
      delete result.image
      this.store.post('/backend/v1/stores/save', result,this.jwToken).subscribe((data)=> {
        console.log('objeto devuelto en update stores')
        console.log(data);
        let tokenRetrieve = data.token;
        this.store.post(`/backend/v1/stores/image/${tokenRetrieve}/save`, imageObject,this.jwToken).subscribe((data)=> {
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

public addAdmin(a:string) : void{
  let token = a;
  console.log('token recibido para editar')
  console.log(token);
  const dialogRef = this.dialog.open( AddAdminComponent, {
    height: '600px',
    width: '600px',
    disableClose : true,
    autoFocus : true,
    data: { name: '', email: '', role:'', password:'', repeatPassword:'',token: token},
  });
   dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(JSON.stringify(result));
      this.manager.post('/backend/v1/managers/save', result,this.jwToken).subscribe((data)=> {
        console.log('objeto devuelto en save managers')
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
