import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup,FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
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
  public image2: any;
  public error:boolean;
  public mime:string;
  public size:string;
  public cardImageBase64: string;
  public photo: string;
  public files:string  []  =  [];
  form: FormGroup;
  public imageError:string;
  public isImageSaved:boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) data

  ) {
    this.name = data.name;
    this.photo = data.photo;
    this.description = data.description;
   }

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      photo: [''],
      description: [''],

  });
  }

  public close() : void  {
    this.dialogRef.close();
  }

  public fileChangeEvent(event) :any {
    
    for  (var i =  0; i < event.target.files.length; i++)  {  
      this.files.push(event.target.files[i]);
      this.name = ''
     
    }
    const max_size = 200000;
    const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
    const max_height = 15200;
    const max_width = 25600;
    this.image2 = this.files[0];
    this.error = false;
    this.name = this.image2.name;
    console.log(this.image2);

    if (this.image2.size > max_size) {
      this.error = true;
      this.imageError = 'MAX 200 KB.';
      return false;
  }

  if (!_.includes(allowed_types, this.image2.type)) {
      this.error = true;
      this.imageError = 'FORMAT.PNG,JPG OR JPEG ARE ALLOWED';
      
      return false;
  }
    const reader = new FileReader();
    this.mime = this.image2.type;
    this.size = this.image2.size;
    console.log(event);
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          console.log(img_height, img_width);
          if (img_height > max_height && img_width > max_width) {
              this.imageError =
                  'Maximum dimentions allowed ' +
                  max_height +
                  '*' +
                  max_width +
                  'px';
              return false;
          } else {
              const imgBase64Path = e.target.result;
              this.cardImageBase64 = imgBase64Path;
              console.log('STRING DE BASE 64');
              console.log(this.cardImageBase64);
              this.isImageSaved = true;
          }
      };
  };

  reader.readAsDataURL(event.target.files[0]);
}

  public save () : void  {
    let id = uuidv4()
    const objectImage : any = {
        data: this.cardImageBase64,
        mime: this.mime,
        name: this.name,
        size: this.size
    }
    console.log(objectImage);
    const object: any = {
      name : this.form.value.name,
      description : this.form.value.description,
      image: objectImage,
      token: id
    }

    this.dialogRef.close(object);
}

}
