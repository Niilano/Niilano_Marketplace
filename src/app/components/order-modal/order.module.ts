import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderModalComponent } from './order-modal.component';


@NgModule({
  declarations: [OrderModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    OrderModalComponent
  ]
})
export class OrderModalModule { }
