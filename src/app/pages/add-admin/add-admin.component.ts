import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';
import {  ManagerService } from './../../services/manager.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {
  Insert: any;
  public name: string;
  public email: string;
  public role: string;
  public password: string;
  public repeatPassword: string;
  public form: FormGroup;
  public jwToken:string
  public storToken:string
  public countryCode:string;
  public countryCurrency:string;
  public countryName:string;
  public imageData:string;
  public imageMime:string;
  public imageSize:string;
  public imageName:string;
  public companyName:string;
  public companyToken:string;
  public storeId:string;



  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAdminComponent>,
    private store:StoreService,private authentication:  AuthenticationService,   @Inject(MAT_DIALOG_DATA)  public data: any
  ) { 
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.password = data.password;
    this.repeatPassword = data.repeatPassword;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      role: [''],
      password: [''],
      repeatPassword: ['']
  });
  this.storToken = this.data.token;
  console.log('token de tienda obtenido');
  console.log(this.storToken);
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
      this.loadStore( this.storToken,this.jwToken);
     }
   );
  }

  private loadStore(token: string, jwToken:string) : void{
    //const timeout = setTimeout(() => {
      //clearTimeout(timeout) 
        let tokenStore = token;
        console.log(tokenStore);
        this.store.get(`/backend/v1/stores/${tokenStore}`,jwToken)
        .subscribe( data => {
          console.log('tiendas devueltas asociadas a compañías');
          console.log(data);
          this.countryCode= data.company.country.code;
          this.countryCurrency = data.company.country.currency;
          this.countryName = data.company.country.name;
          this.imageData = data.image.data;
          this.imageMime = data.image.mime;
          this.imageSize =  data.image.size;
          this.imageName =  data.image.name;
          this.companyName  = data.company.name;
          this.companyToken = data.company.token;
          this.storeId = data.token;
        });
   
    //},4000);
    }

  close() : void  {
    this.dialogRef.close();
  }

  save () : void  {
   
    const object: any = {
      admin: {
          company: {
           country: {
             code: this.countryCode,
             currency: this.countryCurrency,
             name: this.countryName
          },
           image: {
             data: this.imageData,
             mime : this.imageMime,
             name: this.imageName,
            size: this.imageSize
          },
           name: this.companyName,
           token: this.companyToken
        },
        email: this.form.value.email,
         name: this.form.value.name,
         role: 'STAFF'//this.form.value.role
      },
       password: this.form.value.password,
       repeatPassword: this.form.value.repeatPassword,
       storeToken: this.storeId
    }
    console.log(object);
    this.dialogRef.close(object);
}

}
