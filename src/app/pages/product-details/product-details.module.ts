import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDetailsPage } from './product-details.page';
import { MenuModule } from 'src/app/components/menu/menu.component.module';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CommentModalModule } from 'src/app/components/comment-modal/comment.component.module';
import { OrderModalModule } from 'src/app/components/order-modal/order.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule,
    MenuModule,
    CommentModalModule,
    OrderModalModule
  ],
  providers:[
    SocialSharing
  ],
  declarations: [ProductDetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsPageModule {}
