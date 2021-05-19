import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  Insert: any;
  public name: string;
  public description: string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
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

  close() : void  {
    this.dialogRef.close();
  }
  save() : void  {
    this.dialogRef.close(this.form.value);
    console.log(this.form.value);
}

}
