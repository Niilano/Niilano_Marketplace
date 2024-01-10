import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListProductPageRoutingModule } from './list-product-routing.module';

import { ListProductPage } from './list-product.page';
import { SelectcategoryModule } from 'src/app/components/typeheads/selectcategory/selectcategory.module';
import { SelectlocationModule } from 'src/app/components/typeheads/selectlocation/selectlocation.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropImageModule } from 'src/app/components/crop-image/crop-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListProductPageRoutingModule,
    SelectcategoryModule,
    SelectlocationModule,
    ImageCropperModule,
    CropImageModule
  ],
  declarations: [ListProductPage]
})
export class ListProductPageModule {}
