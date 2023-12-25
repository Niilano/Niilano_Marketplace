import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SelectcategoryComponent } from './selectcategory.component';


@NgModule({
  declarations: [SelectcategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  exports : [
    SelectcategoryComponent
  ]
})
export class SelectcategoryModule { }
