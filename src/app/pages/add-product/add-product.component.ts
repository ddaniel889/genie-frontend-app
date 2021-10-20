import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {  StoreService } from './../../services/store.service';
import {  CategoryService } from './../../services/category.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  Insert: any;
  public name: string;
  public description: string;
  public image2: any;
  public error:boolean;
  public mime:string;
  public size:string;
  public cardImageBase64: string;
  public photo: string;
  public files:string  []  =  [];
  public companyI:string  []  =  [];
  public storeI:string  []  =  [];
  public categoryI:any  [];
  form: FormGroup;
  public imageError:string;
  public isImageSaved:boolean;
  public jwToken:string;
  public imageData:string;
  public imageMime:string;
  public imageSize:string;
  public imageName:string;

  /* select 2    */

selected:any;
filtered :any;
    stat = [
        { value: true }, //active
        { value: false }   //pause
        ];

 status = [ { value: 'Active' }, 
    { value: 'Paused'}, { value: 'Draft'}
  
  ];

/*   */

  constructor( private fb: FormBuilder,private store:StoreService,private category:CategoryService,private authentication:  AuthenticationService,
    private dialogRef: MatDialogRef< AddProductComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: any) {
      this.name = data.name;
      this.photo = data.photo;
      this.description = data.description;
     }

  ngOnInit() {
    this.form = this.fb.group({
      product: '',
      description: '',
      photo: '',
      expires: '',
      category: '',
      store: ''
  });
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
    
      let storeToken = '56811db6-ae62-4cc2-b180-bdf456a04b1d'; 
      this.loadStore(`/backend/v1/stores/?storeToken=${storeToken}`,this.jwToken);
      this.loadCategory('/backend/v1/categories/',this.jwToken);
     }
   );
  }



  private loadStore(url:string, token: string) : void{
    const timeout = setTimeout(() => {
      clearTimeout(timeout) 
      this.store.get(url,token)
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
      this.category.get(url,token)
      .subscribe( data => {
        console.log(data);
        this.categoryI = data;
        console.log('datos de categoria')
        console.log(this.categoryI);
      });
    },4000);
  }

  public close() : void  {
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
              this.isImageSaved = true;
          }
      };
  };

  reader.readAsDataURL(event.target.files[0]);
}

public save () : void  {
  let id = uuidv4()
  const dataTime = '00:00:00'
  let dataDate = this.form.value.expires +' ' +dataTime;
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
    token: tokenCat 
  },
  description: this.form.value.description,
  expires: dataDate,//this.form.value.expires,
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
  token: id
  }
  console.log('Objeto de Product');
  console.log(objectProduct);
  this.dialogRef.close(objectProduct);
}

public onOptionsSelected(event:any): void {
this.selected = event.target.value
console.log(this.selected); 
this.filtered = this.stat.filter(t=>t.value ==this.selected);
console.log(this.filtered);

}

}
