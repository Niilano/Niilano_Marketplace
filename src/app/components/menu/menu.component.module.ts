import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SupportModule } from '../support/support.module';
import { SettingsModule } from '../settings/settings.module';


@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    SupportModule,
    SettingsModule
  ],
  exports : [
    MenuComponent
  ]
})
export class MenuModule { }
