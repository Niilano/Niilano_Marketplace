import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { SlicePipe } from '@angular/common';
import { FilterModule } from 'src/app/components/filter/filter.component.module';
import { LoadingModule } from 'src/app/components/loading/loading.component.module';
import { MenuModule } from 'src/app/components/menu/menu.component.module';
import { HeaderModule } from 'src/app/components/header/header.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    SlicePipe,
    FilterModule,
    LoadingModule,
    MenuModule,
    HeaderModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
