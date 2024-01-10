import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { loadingReducers } from 'src/app/store/loading/loading.reducers';


@NgModule({
  declarations: [LoadingComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreModule.forFeature("loading",loadingReducers)
  ],
  exports : [
    LoadingComponent
  ]
})
export class LoadingModule { }
