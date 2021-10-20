import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css']
})
export class AddStoreComponent implements OnInit {
  public lat =  -35.675147;
  public lng = -71.542969;
  public zoom = 9;
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

  constructor(
    private fb: FormBuilder,private store:StoreService,private authentication:  AuthenticationService,
    private dialogRef: MatDialogRef<AddStoreComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.name = data.name;
    this.photo = data.photo;
    this.description = data.description;
   }

  ngOnInit() {
    this.form = this.fb.group({
      store: [''],
      country: [''],
      photo: [''],
      currency: [''],
      company: [''],
      latitude: [''],
      longitude: [''],
      address: ['']
  });
   this.getToken();
   this.setForm();

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

  private setForm() : void {
    this.form.setValue({
      store: '',
      country: '',
      photo: '',
      currency: '',
      company: '',
      latitude: this.lat,
      longitude: this.lng,
      address: ''
    });
  }

  private loadCompany(url:string, token: string) : void{
    const timeout = setTimeout(() => {
      clearTimeout(timeout) 
      this.store.get(url,token)
      .subscribe( data => {
        console.log(data);
        this.companyI = data;
        console.log('datos de compañias')
        console.log(this.companyI);
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
    let companySelected = this.form.value.company;
    let results =  this.companyI.filter(function (nickname:any) { return nickname.name == companySelected; });
    let firstObj:any = (results.length > 0) ? results[0] : null;
    let storeToken = firstObj.token; 
    console.log(firstObj);
    this.imageData = firstObj.image.data;
    console.log(this.imageData);
    this.imageMime = firstObj.image.mime;
    console.log(this.imageMime);
    this.imageName = firstObj.image.name;
    console.log(this.imageName);
    this.imageSize = firstObj.image.size;
    /*const objectImage : any = {
        data: this.cardImageBase64,
        mime: this.mime,
        name: this.name,
        size: this.size
    }
    console.log(objectImage);*/
   
    const objectStore: any = {
      active: true,
      address: this.form.value.address,
      company: {
        country: {
          code: "CL",
          currency: this.form.value.currency,
          name: this.form.value.country
        },
        image: {
          data: this.imageData,
          mime: this.imageMime,
          name: this.imageName,
          size: this.imageSize
        },
        name: this.form.value.company, 
        token: storeToken //token de compania elegida
      },
      image: {
        data: this.cardImageBase64,
        mime: this.mime,
        name: this.name,
        size: this.size
      },
      latitude: this.form.value.latitude,
      longitude: this.form.value.longitude,
      name: this.form.value.store,
      token: id
    }
    console.log('Objeto de store');
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
