import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CropImageComponent } from './crop-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [CropImageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule
  ],
  exports : [
    CropImageComponent
  ]
})
export class CropImageModule { }
