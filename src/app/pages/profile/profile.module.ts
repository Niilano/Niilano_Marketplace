import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { BalanceModule } from 'src/app/components/balance/balance.component.module';
import { EditProfileModule } from 'src/app/components/editprofile/editprofile.component.module';
import { DisplayImageModalModule } from 'src/app/components/display-image-modal/display-image.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    BalanceModule,
    EditProfileModule,
    DisplayImageModalModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
