import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Store } from 'src/app/models/store';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.css']
})
export class EditStoreComponent implements OnInit {
  public lat =  -35.675147;
  public lng = -71.542969;
  public zoom = 9;
  Insert: any;
  public name: string;
  public store: string;
  public country: string;
  public photo: string;
  public currency: string;
  public company: string;
  public address: string;
  public jwToken:string;
  public tokenStore:string;
  public storToken:string;
  public image2: any;
  public error:boolean;
  public mime:string;
  public size:string;
  public cardImageBase64: string;
  public files:string  []  =  [];
  public imageError:string;
  public isImageSaved:boolean;
  form: FormGroup;

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
    private dialogRef: MatDialogRef<EditStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private storeService:StoreService,private authentication:  AuthenticationService
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
      store: [''],
      country: [''],
      photo: [''],
      latitude: [''],
      longitude: [''],
      currency: [''],
      company: [''],
      address: ['']
  });
    console.log('id de store recibido')
    this.tokenStore = this.data.token;
    this.storToken = this.data.storToken;
    console.log('token especifico de tienda');
    console.log(this.storToken);
    console.log('token de compañia');
    console.log(this.tokenStore)
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
      this.editStore(this.tokenStore,this.jwToken);
     }
   );
  }

  private editStore(token: string, jwToken:string) : void{
    //const timeout = setTimeout(() => {
      //clearTimeout(timeout) 
        let tokenStore = token;
        console.log(tokenStore);
        this.storeService.get(`/backend/v1/stores/${tokenStore}`,jwToken)
        .subscribe( data => {
          console.log('tiendas devueltas asociadas a compañías');
          console.log(data);
          let Stores:any = data;
          let storeSelected = this.storToken;
          let results =  Stores.filter(function (index:any) { return index.token == storeSelected; });
          let firstObj:any = (results.length > 0) ? results[0] : null;
          let storeToken = firstObj.token; 
          let status = firstObj.active;
          let statusStore = (status == true) ? 'Active' : 'Paused';
          this.data = data.data;
          this.form.setValue({
            store: firstObj.name,
            country: firstObj.company.country.name,
            photo: '',
            currency: firstObj.company.country.currency,
            latitude: firstObj.latitude,
            longitude: firstObj.longitude,
            company: firstObj.company.name,
            address: firstObj.address
          });
        });
   
    //},4000);
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
    let statusSelected:boolean = (this.selected == 'Active') ? true : false;
    const objectImage : any = {
        data: this.cardImageBase64,
        mime: this.mime,
        name: this.name,
        size: this.size
    }
    console.log(objectImage);
    const objectStore: any = {
      active: statusSelected,
      address: this.form.value.address,
      image: objectImage,
      company: {
        country: {
          code: "CL",
          currency: this.form.value.currency,
          name: this.form.value.country
        },
        name: this.form.value.company,
        token: this.tokenStore
      },
      latitude: -40.4513,
      longitude: -71.6653,
      name: this.form.value.store,
      token: this.storToken
    }
    console.log('OBJETO EN EDIT');
    console.log(objectStore);
    this.dialogRef.close(objectStore);
  }

  public onOptionsSelected(event): void {
    this.selected = event.target.value
    console.log(this.selected); 
    this.filtered = this.stat.filter(t=>t.value ==this.selected);
    console.log(this.filtered);
  
  }

}
