import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListProductComponent } from './list-product.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [ListProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  exports: [
    ListProductComponent
  ]
})
export class ListProductModule { }
