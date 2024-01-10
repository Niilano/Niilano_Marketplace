import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { SupportComponent } from './support.component';


@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports : [
    SupportComponent
  ]
})
export class SupportModule { }
