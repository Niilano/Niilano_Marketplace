import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProductsPageRoutingModule } from './my-products-routing.module';

import { MyProductsPage } from './my-products.page';
import { ListProductModule } from 'src/app/components/list-product/list-product.component.module';
import { EditProductModule } from 'src/app/components/editproduct/editproduct.component.module';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProductsPageRoutingModule,
    ListProductModule,
    EditProductModule,
    HeaderModule
  ],
  declarations: [MyProductsPage]
})
export class MyProductsPageModule {}
