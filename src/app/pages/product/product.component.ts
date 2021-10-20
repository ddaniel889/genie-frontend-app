import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  AuthenticationService } from './../../services/authentication.service';
import {  ProductsService  } from './../../services/products.service';
import { APP,TOKEN } from './../../services/constants';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent  } from '../edit-product/edit-product.component';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {

  public checked = false;
  public box = false;
  public options:boolean;
  public displayedColumns = ['check','token','photo','Product name','Status','Store','Company','Category', 'Description','Expires','id'];
  public jwToken : string;
  dataSource: MatTableDataSource<any>  = new MatTableDataSource();
 // public data:string;
  public mime:string;
  public productsI =  [];
  public numStore : number;
  public tokenCategory:string;
  public data:string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public selection = new SelectionModel<any>(true, []);
  public spinner:boolean;
  public table:boolean = false;

  constructor(private product:ProductsService,private authentication:  AuthenticationService, public router: Router,public dialog: MatDialog ) {

   }

  ngOnInit() {
    
    this.spinner = true;
    this.options = false;
    this.displayedColumns = ['check','token','photo','Product name','Status','Store','Company','Category', 'Description','Expires','id'];
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
      //this.loadStores('/backend​/v1​/products​/',this.jwToken); 
        /*this.categoryI = data;
      this.dataSource.data = data;*/
      let storeToken = '56811db6-ae62-4cc2-b180-bdf456a04b1d';  
      this.loadProducts('/backend/v1/products/',this.jwToken);  
      this.exportStore('/backend/v1/products/export',this.jwToken);
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

  private loadProducts(url:string, token: string) : void{
    console.log('url enviada');
    console.log(url)
    console.log('token enviada');
    console.log(token)
    
    const timeout = setTimeout(() => {
      clearTimeout(timeout) 
      this.product.get(url,token)
      .subscribe( data => {
        console.log(data);
        this.spinner = false;
        this.table = true;
        this.productsI = data;
        this.dataSource.data = data;
        console.log('token image');
       /* let tokenImage = data[0].token;
        console.log(tokenImage);*/
       /* this.store.get(`/backend/v1/products/${tokenImage}/image`,this.jwToken)
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
        this.product.get(url,token)
        .subscribe( data => {
          console.log(data);
          this.data = data.data;
          console.log('datos excel');
          console.log(this.data);
        }
        );
      },4000);
    }

   

     public openDialog() : void {
      const dialogRef = this.dialog.open( AddProductComponent, {
       height: '550px',
       width: '800px',
       disableClose : true,
       autoFocus : true,
       data: { name: '',photo: '',description:'' },
    
     });
      dialogRef.afterClosed().subscribe(result => {
       console.log('resultado de post products'); 
       console.log(result)
      /* let imageObject = result.image
       this.tokenCategory = result.token;*/
       console.log(JSON.stringify(result));
      // delete result.image
      console.log('credenciales aqui');
      console.log(this.jwToken);
       this.product.post('/backend/v1/products/save', result,this.jwToken).subscribe((data)=> {
         console.log('objeto devuelto en insert products')
         console.log(data);
         this.ngOnInit();
       
         },
           error => {
             console.log(error);
           }
      );
       });
    
     }

     
 public editProduct(a:string) : void{
  let token = a;
  console.log('token recibido para editar')
  console.log(token);
  const dialogRef = this.dialog.open( EditProductComponent , {
  height: '600px',
  width: '800px',
    disableClose : true,
    autoFocus : true,
    data: { store: '', country: '',photo:'', currency:'', company:'', address:'',token: token},
  });
   dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(JSON.stringify(result));
      let imageObject = result.image
      this.tokenCategory = result.token;
      console.log(JSON.stringify(result));
      delete result.image
      this.product.post('/backend/v1/products/save', result,this.jwToken).subscribe((data)=> {
        console.log('objeto devuelto en update stores')
        console.log(data);
        let tokenRetrieve = data.token;
        /*this.product.post(`/backend/v1/products/image/${tokenRetrieve}/save`, imageObject,this.jwToken).subscribe((data)=> {
          console.log(data);
          location.reload();
            },
            error => {
          console.log(error);
          }
       );*/
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
  this.product.delete(`/backend/v1/products/${token}/delete`,this.jwToken).subscribe(data => { 
    console.log(data);
    this.ngOnInit();
     },
     error => {
       console.log(error);
     }
 );
   } 

}
