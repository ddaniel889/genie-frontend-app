import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import {  ProductsService  } from './../../services/products.service';
import {  StoreService } from './../../services/store.service';
import {  CategoryService } from './../../services/category.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Store } from 'src/app/models/store';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  public Insert: any;
  public name: string;
  public store: string;
  public country: string;
  public photo: string;
  public currency: string;
  public company: string;
  public address: string;
  public jwToken:string;
  public tokenProduct:string;
  public image2: any;
  public error:boolean;
  public storeI:string  []  =  [];
  public categoryI:any  [];
  public mime:string;
  public size:string;
  public cardImageBase64: string;
  public files:string  []  =  [];
  public imageError:string;
  public isImageSaved:boolean;
  public form: FormGroup;
  public idProduct:string;

  /* select 2    */

selected:any;
filtered :any;
    stat = [
        { value: true }, //active
        { value: false },  //pause
      
        ];

 status = [ { value: 'Active' }, 
    { value: 'Paused'},
    { value: 'Draft'}
  ];

/*   */

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private productService: ProductsService,private categoryService: CategoryService,private storeService: StoreService,private authentication:  AuthenticationService
  ) { 
    this.store = data.name;
    this.country = data.description;
    this.photo = data.name;
    this.currency = data.description;
    this.company = data.name;
    this.address = data.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      product: [''],
      category: [''],
      photo: [''],
      expires: [''],
      description: [''],
      store: ['']
     
  });
    console.log('id de store recibido')
    this.tokenProduct = this.data.token;
    console.log('token de compañia');
    console.log(this.tokenProduct);
    this.getToken();
  }

  public getToken() : void {
    const object : any = {
      app: APP.DATA,
      token: TOKEN.DATA,
    }; 
    this.authentication.postAuthentication('/backend/v1/authentication/login',object).subscribe( data => {
      console.log(data);
      this.jwToken = data.jwt;
      this.editStore( this.tokenProduct,this.jwToken);
      let storeToken = '56811db6-ae62-4cc2-b180-bdf456a04b1d'; 
      this.loadStore(`/backend/v1/stores/?storeToken=${storeToken}`,this.jwToken);
      this.loadCategory('/backend/v1/categories/',this.jwToken);
     }
   );
  }

  private editStore(token: string, jwToken:string) : void{
    //const timeout = setTimeout(() => {
      //clearTimeout(timeout) 
        let tokenProduct = token;
        console.log(tokenProduct);
        this.productService.get(`/backend/v1/products/${tokenProduct}`,jwToken)
        .subscribe( data => {
          console.log('productos devueltos asociados');
          console.log(data);
          let statusStore = (data.active == true) ? 'Active' : 'Paused';
          this.data = data.data;
          this.idProduct = data.token;
          this.form.setValue({
            product: data.name,
            category: data.category.name,
            photo: '',
            expires: data.expires,
            description: data.description,
            store: data.store.name
          });
        });
   
    //},4000);
    }
    
    private loadStore(url:string, token: string) : void{
      const timeout = setTimeout(() => {
        clearTimeout(timeout) 
        this.storeService.get(url,token)
        .subscribe( data => {
          console.log(data);
          this.storeI = data;
    
          console.log('datos de tienda')
          console.log(this.storeI);
        });
      },4000);
    }
  
    private loadCategory(url:string, token: string) : void{
      const timeout = setTimeout(() => {
        clearTimeout(timeout) 
        this.categoryService.get(url,token)
        .subscribe( data => {
          console.log(data);
          this.categoryI = data;
          console.log('datos de categoria')
          console.log(this.categoryI);
        });
      },4000);
    }
  
  close() : void  {
    this.dialogRef.close();
  }

  public fileChangeEvent(event) :any {
    
    for  (var i =  0; i < event.target.files.length; i++)  {  
      this.files.push(event.target.files[i]);
      this.name = ''
     
    }
    const max_size = 200000;
    const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
    const max_height = 15200;
    const max_width = 25600;
    this.image2 = this.files[0];
    this.error = false;
    this.name = this.image2.name;
    console.log(this.image2);

    if (this.image2.size > max_size) {
      this.error = true;
      this.imageError = 'MAX 200 KB.';
      return false;
  }

  if (!_.includes(allowed_types, this.image2.type)) {
      this.error = true;
      this.imageError = 'FORMAT.PNG,JPG OR JPEG ARE ALLOWED';
      
      return false;
  }
    const reader = new FileReader();
    this.mime = this.image2.type;
    this.size = this.image2.size;
    console.log(event);
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
              this.imageError =
                  'Maximum dimentions allowed ' +
                  max_height +
                  '*' +
                  max_width +
                  'px';
              return false;
          } else {
              const imgBase64Path = e.target.result;
              this.cardImageBase64 = imgBase64Path;
              console.log('STRING DE BASE 64');
              console.log(this.cardImageBase64);
              this.isImageSaved = true;
          }
      };
  };

  reader.readAsDataURL(event.target.files[0]);
}
  save() : void  {
  const dataTime = '00:00:00'
  let dataDate = this.form.value.expires +' ' +dataTime;  
  let statusSelected:boolean = (this.selected == 'Active') ? true : false;
  let catSelected = this.form.value.category;
  let detailCategory = this.categoryI.filter(function (index:any) { return index.name == catSelected; });
  let firstCat:any = (detailCategory.length > 0) ? detailCategory[0] : null;
  let descriptionCategory = firstCat.description;
  let imgCatData = firstCat.image.data;
  let imgCatMime = firstCat.image.mime;
  let imgCatName = firstCat.image.name;
  let imgCatSize = firstCat.image.size;
  let tokenCat = firstCat.token;
  let storeSelected = this.form.value.store;
  let results =  this.storeI.filter(function (nickname:any) { return nickname.name == storeSelected; });
  let firstObj:any = (results.length > 0) ? results[0] : null;
  let address = firstObj.address;
  let company = firstObj.company.name;
  let companyToken = firstObj.company.token;
  let storeIdata = firstObj.image.data;
  let storeImime = firstObj.image.mime;
  let storeIname = firstObj.image.name;
  let storeIsize = firstObj.image.size;
  let latitude = firstObj.latitude;
  let longitude = firstObj.longitude;
  let tokenStore = firstObj.token;

  const objectProduct: any = {
    active: true,
    category : {
    description: descriptionCategory, 
     image: {
      data: imgCatData,  
      mime: imgCatMime, 
      name: imgCatName, 
      size: imgCatSize 
    },
    name: this.form.value.category,
    token: tokenCat //
  },
  description: this.form.value.description,
  expires: dataDate,
  image: {
    data: this.cardImageBase64,
    mime: this.mime,
    name: this.name,
    size: this.size
  },
  name: this.form.value.product,
  status: "CREATED",
  store: {
    active: true,
    address: address,
    company: {
      country: {
        code: "CL",
        currency: "CLP",
        name: "Chile"
      },
      image: {
        data: "string",
        mime: "image/png",
        name: "foto.png",
        size: 102400
      },
      name: company,
      token: companyToken
    },
    image: {
      data: storeIdata,
      mime: storeImime,
      name: storeIname,
      size: storeIsize
    },
    latitude: latitude,
    longitude: longitude,
    name: this.form.value.store,
    token: tokenStore
  },
  token: this.idProduct
  }
  console.log('Objeto de Product');
  console.log(objectProduct);
  this.dialogRef.close(objectProduct);
  }

  public onOptionsSelected(event): void {
    this.selected = event.target.value
    console.log(this.selected); 
    this.filtered = this.stat.filter(t=>t.value ==this.selected);
    console.log(this.filtered);
  
  }

}
