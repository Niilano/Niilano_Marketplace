import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaveditemsPageRoutingModule } from './saveditems-routing.module';

import { SaveditemsPage } from './saveditems.page';
import { RouterModule } from '@angular/router';
import { OrderModalModule } from 'src/app/components/order-modal/order.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaveditemsPageRoutingModule,
    RouterModule,
    OrderModalModule
  ],
  declarations: [SaveditemsPage]
})
export class SaveditemsPageModule {}
