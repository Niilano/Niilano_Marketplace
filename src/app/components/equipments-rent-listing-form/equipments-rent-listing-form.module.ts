import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EquipmentsRentListingFormComponent } from './equipments-rent-listing-form.component';


@NgModule({
  declarations: [EquipmentsRentListingFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    EquipmentsRentListingFormComponent
  ]
})
export class EquipmentsRentListingFormModule { }
