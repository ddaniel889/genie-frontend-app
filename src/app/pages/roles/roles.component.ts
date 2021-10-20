import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import {  ManagerService } from './../../services/manager.service';
import {  AuthenticationService } from './../../services/authentication.service';
import { APP,TOKEN } from './../../services/constants';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  public Insert: any;
  public name: string;
  public description: string;
  public form: FormGroup;
  public jwToken:string;
 

  constructor(private fb: FormBuilder, private manager:ManagerService ,private authentication:  AuthenticationService,
    private dialogRef: MatDialogRef<RolesComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.name = data.name;
      this.description = data.description;
    }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      photo: [''],
      description: [''],

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
      this.loadRoles( '/backend/v1/managers/roles',this.jwToken);
     }
   );
  }

  private loadRoles(url: string, jwToken:string) : void{
    //const timeout = setTimeout(() => {
      //clearTimeout(timeout) 
        this.manager.get(url,jwToken)
        .subscribe( data => {
         console.log(data);
        });
   
    //},4000);
    }

  public close() : void  {
    this.dialogRef.close();
  }

 

  public save () : void  {
    this.dialogRef.close();
}

}
