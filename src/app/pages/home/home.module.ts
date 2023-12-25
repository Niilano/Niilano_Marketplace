import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { WelcomeModule } from 'src/app/components/welcome/welcome.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { CategoriesModule } from 'src/app/components/categories/categories.module';
import { MenuModule } from 'src/app/components/menu/menu.component.module';
import { SearchModule } from 'src/app/components/search/search.module';
import { ListRentItemModalModule } from 'src/app/components/list-rent-item-modal/list-rent-item-modal.module';
import { ListServicesModule } from 'src/app/components/list-services/list-services.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    WelcomeModule,
    HeaderModule,
    CategoriesModule,
    MenuModule,
    SearchModule,
    ListRentItemModalModule,
    ListServicesModule
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
