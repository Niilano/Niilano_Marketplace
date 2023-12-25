import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsRentingListingFormComponent } from './events-renting-listing-form.component';


@NgModule({
  declarations: [EventsRentingListingFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    EventsRentingListingFormComponent
  ]
})
export class EventsRentingListingFormModule { }
