import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import {  CategoryService } from './../../services/category.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';
import { Category } from './../../models/category';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  public Insert: any;
  public name: string;
  public description: string;
  public form: FormGroup;
  public jwToken : string;
  public tokenCategory:string;
  public dataImg:string;
  public mime:string;
  public size:string;
  public nameImg:string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private authentication:  AuthenticationService,private category:CategoryService
  ) { 
    this.name = data.name;
    this.description = data.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      description: [''],
  });
    this.tokenCategory = this.data.tokenCategory;
    this.getToken();
  }

  public close() : void  {
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
    this.categoryDetail(this.tokenCategory,this.jwToken);
   }
 );
}

private categoryDetail(token: string, jwToken:string) : void{
  //const timeout = setTimeout(() => {
    //clearTimeout(timeout) 
      let tokenStore = token;
      console.log(tokenStore);
      this.category.get(`/backend/v1/categories/${tokenStore}`,jwToken)
      .subscribe( data => {
        console.log('categoria individual devuelta');
        console.log(data);
        this.dataImg = data.image.data;
        this.mime = data.image.mime;
        this.size = data.image.size;
        this.nameImg = data.image.name;
        this.form.setValue({
          name: data.name,
          description: data.description,
        });
       
      });
 
  //},4000);
  }

  public save() : void  {
    const objectCategory: any = {
      description:  this.form.value.description,
      image: {
        data: this.dataImg,
        mime: this.mime,
        name: this.size,
        size: this.size
      },
      name:  this.form.value.name,
      token: this.tokenCategory
    }
    console.log(objectCategory);
    this.dialogRef.close(objectCategory);
  }


}
