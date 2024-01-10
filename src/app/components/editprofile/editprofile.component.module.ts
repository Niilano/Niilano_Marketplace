import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditProfileComponent } from './editprofile.component';


@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
  ],
  exports: [
    EditProfileComponent
  ]
})
export class EditProfileModule { }
