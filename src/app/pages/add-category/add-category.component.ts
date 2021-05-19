import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  Insert: any;
  public name: string;
  public description: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) data

  ) {
    this.name = data.name;
    this.description = data.description;
   }

  ngOnInit() {
    console.log(uuidv4());
    this.form = this.fb.group({
      name: [''],
      description: [''],
  });
  }



  close() : void  {
    this.dialogRef.close();
  }
  save () : void  {
    console.log(this.form.value);
    const object: any = {
      name : this.form.value.name,
      description : this.form.value.description,
      token: uuidv4()
     
    }
    this.dialogRef.close(object);
    console.log('Valor de form en category');
  
}


}
