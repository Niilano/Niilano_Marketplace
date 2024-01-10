import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentPageRoutingModule } from './rent-routing.module';

import { RentPage } from './rent.page';
import { RentItemsDetailsModalModule } from 'src/app/components/rent-items-details-modal/rent-items-details-modal.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentPageRoutingModule,
    RentItemsDetailsModalModule,
    HeaderModule,
  ],
  declarations: [RentPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RentPageModule {}
