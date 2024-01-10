import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListRentItemModalComponent } from './list-rent-item-modal.component';
import { HouseListingModule } from '../house-listing/house-listing.module';
import { VehicleListingModule } from '../vehicle-listing/vehicle-listing.module';
import { EquipmentsRentListingFormModule } from '../equipments-rent-listing-form/equipments-rent-listing-form.module';
import { EventsRentingListingFormModule } from '../events-renting-listing-form/events-renting-listing-form.module';


@NgModule({
  declarations: [ListRentItemModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    HouseListingModule,
    VehicleListingModule,
    EquipmentsRentListingFormModule,
    EventsRentingListingFormModule
  ],
  exports: [
    ListRentItemModalComponent
  ]
})
export class ListRentItemModalModule { }
