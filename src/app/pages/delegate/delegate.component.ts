import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {  ManagerService } from './../../services/manager.service';
import {  StoreService } from './../../services/store.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';


@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css']
})
export class DelegateComponent implements OnInit {
  Insert: any;
  public description: string;
  public companyI:string  []  =  [];
  form: FormGroup;
  public jwToken:string;
  public storToken:string;
  public name:string; 
  public email:string; 
  public role:string; 
  public companyName:string; 
  public storeName:string;  
  public countryName:string; 
  public admin:boolean = false; 

  constructor(private fb: FormBuilder,private store:StoreService,private authentication:  AuthenticationService, private manager:ManagerService,
    private dialogRef: MatDialogRef<DelegateComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: any) { 
      this.name = data.name;
      this.description = data.description;
    }

  ngOnInit() {
    this.form = this.fb.group({
      status: [''],
  });
  this.storToken = this.data.token;
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
      this.loadAdmin(this.storToken,this.jwToken);
     }
   );
  }

  private loadAdmin(tokenStore:string, token: string) : void{
   /* const timeout = setTimeout(() => {
      clearTimeout(timeout) */
      this.manager.get(`/backend/v1/managers/${tokenStore}/store`,token) 
      .subscribe( data => {
        console.log(data);
        this.admin = data !==undefined ?true: false
        this.companyI = data;
        console.log('datos de AaDMIN')
        console.log(this.companyI);
        this.name = data.admin.name;
        this.email = data.admin.email;
        this.role =  data.admin.role;
        this.companyName = data.admin.company.name;
        this.storeName = data.store.name ;
        this.countryName = data.admin.company.country.name;
      });
   // },4000);
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
