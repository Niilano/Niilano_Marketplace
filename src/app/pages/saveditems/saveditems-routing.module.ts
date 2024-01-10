import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaveditemsPage } from './saveditems.page';

const routes: Routes = [
  {
    path: '',
    component: SaveditemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveditemsPageRoutingModule {}
