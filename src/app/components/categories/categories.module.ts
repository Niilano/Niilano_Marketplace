import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    CategoriesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriesModule { }
