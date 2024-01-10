import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentItemsDetailsPageRoutingModule } from './rent-items-details-routing.module';

import { RentItemsDetailsPage } from './rent-items-details.page';
import { ListRentItemModalModule } from 'src/app/components/list-rent-item-modal/list-rent-item-modal.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentItemsDetailsPageRoutingModule,
    ListRentItemModalModule
  ],
  declarations: [RentItemsDetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RentItemsDetailsPageModule {}
