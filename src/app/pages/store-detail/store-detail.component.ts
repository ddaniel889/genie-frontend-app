import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.css']
})
export class StoreDetailComponent implements OnInit {
  public lat : string;
  public lng :string;
  public zoom = 9;
  public Insert: any;
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
  public form: FormGroup;
  public imageError:string;
  public isImageSaved:boolean;
  public jwToken:string;
  public tokenStore:string;
  public storToken:string;
  public companyName:string;
  public storeName:string;
  public status:string;
  public address:string;
  public dataStore:boolean = false;

  constructor(
    private fb: FormBuilder,private store:StoreService,private authentication:  AuthenticationService,
    private dialogRef: MatDialogRef<StoreDetailComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: any
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
   console.log('Token obtenido');
   this.tokenStore = this.data.token;
   this.storToken = this.data.storToken;
   console.log(this.tokenStore);
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
      //this.loadCompany('/backend/v1/companies/',this.jwToken);
      this.storeDetail(this.tokenStore,this.jwToken);
     }
   );
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

  private storeDetail(token: string, jwToken:string) : void{
    //const timeout = setTimeout(() => {
      //clearTimeout(timeout) 
        let tokenStore = token;
        console.log(tokenStore);
        this.store.get(`/backend/v1/stores/${tokenStore}`,jwToken)
        .subscribe( data => {
          console.log('tienda devuelta asociada a compañías');
          console.log(data);
          let Stores:any = data;
          let storeSelected = this.storToken;
          let results =  Stores.filter(function (index:any) { return index.token == storeSelected; });
          let firstObj:any = (results.length > 0) ? results[0] : null;
          this.dataStore = true;
          console.log('tienda devuelta');
          console.log(firstObj);
          this.storeName = firstObj.name;
          this.lat = firstObj.latitude;
          this.lng = firstObj.longitude;
          this.companyName = firstObj.company.name;
          this.address = firstObj.address;
          this.status = (firstObj.active ===true) ? 'Active' : 'Paused'; 
          this.store.get(`/backend/v1/stores/${this.storToken}/image`,this.jwToken)
          .subscribe( data => {
            console.log('imagen devuelta');
            console.log(data);
            this.data = data.data;
            this.mime = data.mime;
          }
          );
         
        });
   
    //},4000);
    }

  public close() : void  {
    this.dialogRef.close();
  }


}
