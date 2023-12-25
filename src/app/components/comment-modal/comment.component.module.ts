import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommentModalComponent } from './comment-modal.component';



@NgModule({
  declarations: [CommentModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CommentModalComponent
  ]
})
export class CommentModalModule { }
