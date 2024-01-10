import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DisplayImageModalComponent } from './display-image-modal.component';


@NgModule({
  declarations: [DisplayImageModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
  ],
  exports: [
    DisplayImageModalComponent
  ]
})
export class DisplayImageModalModule { }
