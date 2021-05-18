import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';

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
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.name = data.name;
    this.description = data.description;
   }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      description: [''],
  });
  }



  close() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close(this.form.value);
    console.log(this.form.value);
}


}
