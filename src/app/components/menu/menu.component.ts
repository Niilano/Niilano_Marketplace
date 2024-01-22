import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, MenuController, ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SaveditemsService } from 'src/app/services/saveditems.service';
import { getUserProducts } from 'src/app/store/userProducts/userproducts.actions';
import { AppState } from 'src/app/types/AppState';
import { SupportComponent } from '../support/support.component';
import { SettingsComponent } from '../settings/settings.component';
import { startLoading } from 'src/app/store/loading/loading.action';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  isIOS:boolean

  constructor(private modalCtrl: ModalController,private router: Router, private menuController: MenuController, private store: Store<AppState>,private savedItemsService:SaveditemsService,private platform: Platform,private actionSheetController:ActionSheetController,private authService:AuthService) { 
    this.isIOS = this.platform.is('ios');
  }

  async openSupportModal(){

    this.menuController.close()
    
    const modal = await this.modalCtrl.create({
      component: SupportComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  async openSettingsModal(){

    this.menuController.close()
    
    const modal = await this.modalCtrl.create({
      component: SettingsComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  async logout(){
  

    const actionSheet = await this.actionSheetController.create({
      header: 'Confirm Log out',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          // do nothing
        }
      }, {
        text: 'Confirm',
        icon: 'log-out-outline',
        role: 'destructive',
        handler: () => {

          this.store.dispatch(startLoading())

          this.authService.logout()

        }
      }]
    });
    await actionSheet.present();

  }

  user: any

  productsAvailable = 0
  userProductsAvailable = 0

  savedItems:any

  totalUnreadMessages = 0

  modifyImageUrl(url: string): string {
    // Transform the URL to HTTPS if it's a Cloudinary URL and not already HTTPS
    if (url.startsWith('http:')) {
     url = 'https://' + url.substr(7); // Replaces 'http://' with 'https://'
   }

   // Split the URL at 'upload/'
   let parts = url.split('upload/');

   if (parts.length === 2) {
     // Add 'w_500' between the two parts and create the new URL
     let newImageUrl = parts[0] + 'upload/w_500/' + parts[1];
     return newImageUrl; // The modified URL with 'w_500'
   }

   return url;
}

  ngOnInit() {

    this.store.select("getUserMessages")
      .subscribe(
        res => {
          if (res.success) {
            this.totalUnreadMessages = res.totalUnreadMesages
          }

          if (res.fail) {
            this.totalUnreadMessages = 0
          }

        }
      )

    this.savedItems = this.savedItemsService.getAllSavedItems()

    this.store.dispatch(getUserProducts())

    this.store.select('products').subscribe(res => {

      if (res.success) {
        this.productsAvailable = res.productsAvailable
      }

    })

    this.store.select('userProducts')
      .subscribe(
        products => {

          if (products.success) {
            this.userProductsAvailable = products.products.length
          }

        }
      )

    this.store.select('checkLogin')
      .subscribe(
        res => {

          if (res.loggedIn) {
            this.user = res.profile
          }

          if (!res.loggedIn) {
            this.user = false
          }

        }
      )

  }

  redirect(redirect: any) {
    // navigate to the products page
    this.menuController.close()
    this.router.navigate([redirect]);
  }

  redirectAuth(redirect:string){

    if(this.router.url!='/home'){
    localStorage.setItem('currentroute',this.router.url)
    }

    this.menuController.close()
    this.router.navigate(['auth'],{queryParams :{page:redirect}});
  }


}
