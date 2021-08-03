import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';


@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css']
})
export class DelegateComponent implements OnInit {
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

  constructor(private fb: FormBuilder,private store:StoreService,private authentication:  AuthenticationService,
    private dialogRef: MatDialogRef<DelegateComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.name = data.name;
      this.photo = data.photo;
      this.description = data.description;
    }

  ngOnInit() {
    this.form = this.fb.group({
      status: [''],
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
      this.loadCompany('/backend/v1/companies/',this.jwToken);
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

  public close() : void  {
    this.dialogRef.close();
  }

  public save () : void  {
    let id = uuidv4()
    let object = 'object'
    this.dialogRef.close(object);
}


}
