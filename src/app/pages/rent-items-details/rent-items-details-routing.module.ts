import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentItemsDetailsPage } from './rent-items-details.page';

const routes: Routes = [
  {
    path: '',
    component: RentItemsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentItemsDetailsPageRoutingModule {}
