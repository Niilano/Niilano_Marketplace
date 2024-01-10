import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports : [
    WelcomeComponent
  ]
})
export class WelcomeModule { }
