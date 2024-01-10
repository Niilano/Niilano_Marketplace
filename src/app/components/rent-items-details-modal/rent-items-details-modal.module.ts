import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { RentItemsDetailsModalComponent } from './rent-items-details-modal.component';


@NgModule({
  declarations: [RentItemsDetailsModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports : [
    RentItemsDetailsModalComponent
  ]
})
export class RentItemsDetailsModalModule { }
