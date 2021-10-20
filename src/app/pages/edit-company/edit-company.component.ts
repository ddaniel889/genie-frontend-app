import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import {  CompanyService } from './../../services/company.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';
import { Company } from './../../models/company';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  public Insert: any;
  public name: string;
  public country: string;
  public code:string;
  public currency:string;
  public form: FormGroup;
  public jwToken : string;
  public tokenCompany:string;
  public dataImg:string;
  public mime:string;
  public size:string;
  public nameImg:string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private company:CompanyService,private authentication:  AuthenticationService
  ) {
    this.name = data.name;
    this.country = data.country;
    this.code = data.code;
    this.currency = data.currency;
   }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      country: [''],
      code: [''],
      currency: ['']
    });
    this.tokenCompany = this.data.tokenCompany;
    this.getToken();
  }

  
  close() : void  {
    this.dialogRef.close();
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
      this.companyDetail(this.tokenCompany,this.jwToken);
     }
   );
  }

  private companyDetail(token: string, jwToken:string) : void{
    //const timeout = setTimeout(() => {
      //clearTimeout(timeout) 
        let tokenStore = token;
        console.log(tokenStore);
        this.company.get(`/backend/v1/companies/${tokenStore}`,jwToken)
        .subscribe( data => {
          console.log('company individual devuelta');
          console.log(data);
          this.dataImg = data.image.data;
          this.mime = data.image.mime;
          this.size = data.image.size;
          this.nameImg = data.image.name;
          this.form.setValue({
            name: data.name,
            country: data.country.name,
            code: data.country.code,
            currency: data.country.currency
          });
        });
   
    //},4000);
    }

  save() : void  {
    const objectCompany: any = {  
      country: {
        code: this.form.value.code,
        currency: this.form.value.currency,
        name: this.form.value.country
      },
      image: {
        data: this.dataImg,
        mime: this.mime,
        name: this.nameImg,
        size: this.size
      },
      name: this.form.value.name,
      token: this.tokenCompany
   }
    console.log(objectCompany);
    this.dialogRef.close(objectCompany);
  }

}
