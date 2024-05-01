import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.service';

// ,canLoad : [AuthGuard]

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'product-details',
    loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),canLoad : [AuthGuard]
  },
  {
    path: 'my-products',
    loadChildren: () => import('./pages/my-products/my-products.module').then( m => m.MyProductsPageModule),canLoad : [AuthGuard]
  },
  {
    path: 'order-history',
    loadChildren: () => import('./pages/order-history/order-history/order-history.module').then( m => m.OrderHistoryPageModule),canLoad : [AuthGuard]
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./pages/my-orders/my-orders/my-orders.module').then( m => m.MyOrdersPageModule),canLoad : [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'saveditems',
    loadChildren: () => import('./pages/saveditems/saveditems.module').then( m => m.SaveditemsPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then( m => m.MessagesPageModule),canLoad : [AuthGuard]
  },
  {
    path: '@',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'tos',
    loadChildren: () => import('./pages/tos/tos.module').then( m => m.TosPageModule)
  },
  {
    path: 'rent',
    loadChildren: () => import('./pages/rent/rent.module').then( m => m.RentPageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./pages/services/services.module').then( m => m.ServicesPageModule)
  },
  {
    path: 'rent-items-details',
    loadChildren: () => import('./pages/rent-items-details/rent-items-details.module').then( m => m.RentItemsDetailsPageModule)
  },  {
    path: 'service-detail',
    loadChildren: () => import('./pages/service-detail/service-detail.module').then( m => m.ServiceDetailPageModule)
  },
  {
    path: 'list-product',
    loadChildren: () => import('./pages/list-product/list-product.module').then( m => m.ListProductPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then( m => m.SupportPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: false, initialNavigation: 'enabledBlocking' }),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
