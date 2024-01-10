import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FilterComponent } from './filter.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule { }
