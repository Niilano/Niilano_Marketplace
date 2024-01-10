import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { OrderModalComponent } from 'src/app/components/order-modal/order-modal.component';
import { SaveditemsService, SaveItem } from 'src/app/services/saveditems.service';
import { AppState } from 'src/app/types/AppState';

@Component({
  selector: 'app-saveditems',
  templateUrl: './saveditems.page.html',
  styleUrls: ['./saveditems.page.scss'],
})
export class SaveditemsPage implements OnInit {

  savedItems:any

  isLoggedIn = false

  constructor(private savedItemsService:SaveditemsService, private store:Store<AppState>,private toastController:ToastController,private modalCtrl:ModalController, private router:Router) { }

  ngOnInit() {

    this.savedItems = this.savedItemsService.getAllSavedItems()

    this.store.select('checkLogin')
      .subscribe(
        res => {

          this.isLoggedIn = res.loggedIn

        }
      )

  }

  redirect(path:string){
    this.router.navigate([path])
  }

  async checkout(itemId:number){

    let selectedItem = this.savedItems.find((items: any)=>{
      if(items.id === itemId){
        return items
      }
    })

    this.presentOrderModal(selectedItem)
    

  }


  async presentOrderModal(selectedItem: any) {

    if(!this.isLoggedIn){

      this.toastController.create({
        message: "Please Login to continue...",
        duration: 1500,
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    const modal = await this.modalCtrl.create({
      component: OrderModalComponent,
      showBackdrop: true,
      initialBreakpoint: 1,
      componentProps: {
        selectedItem: selectedItem
      }
    });
    return await modal.present();
  }

  removeCartItem(itemId:number){
    this.savedItemsService.removeSavedItem(itemId)
  }

  handleRefresh(event:any) {
    // do some work to refresh the content here
    // ...

    //let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    //refreshertext.style.color = "#000"

    location.reload()
  
    // when the refresh is complete, call the complete() method
    setTimeout(() => {

      event.target.complete();
      
    }, 1500);
  }

}
