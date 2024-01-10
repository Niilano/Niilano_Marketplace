import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HouseListingComponent } from './house-listing.component';

@NgModule({
  declarations: [HouseListingComponent],
  imports: [CommonModule, IonicModule, RouterModule, FormsModule],
  exports: [HouseListingComponent],
})
export class HouseListingModule {}
