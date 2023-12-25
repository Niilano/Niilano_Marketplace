import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SelectlocationComponent } from './selectlocation.component';


@NgModule({
  declarations: [SelectlocationComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports : [
    SelectlocationComponent
  ]
})
export class SelectlocationModule { }
