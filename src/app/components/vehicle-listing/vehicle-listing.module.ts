import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleListingComponent } from './vehicle-listing.component';

@NgModule({
  declarations: [VehicleListingComponent],
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
  exports: [VehicleListingComponent],
})
export class VehicleListingModule {}
