import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  handleRefresh(event:any) {
    // do some work to refresh the content here
    // ...

    // let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    // refreshertext.style.color = "#000"

    location.reload()
  
    // when the refresh is complete, call the complete() method
    setTimeout(() => {

      event.target.complete();
      
    }, 1500);
  }

  orders:any

  getOrders(){

    this.store.dispatch(startLoading())

    this.http.get<{message:string,orders:[]}>(`${environment.server}/orders/myorders`)
    .pipe(take(1))
    .subscribe(
      res=>{
        this.store.dispatch(endLoading())
        this.orders = res.orders
        console.log(this.orders)
      },
      err=>{
        this.store.dispatch(endLoading())
        err.error.message && console.log(err.error.message)
      }
    )

  }

  showDetails:number | undefined

  toggleOrderDetails(orderID:number) {
    this.showDetails = this.showDetails!=orderID ? orderID : 0
  }

  deleteItem(item:any) {
    // implement item deletion logic here
  }

  async acceptOrder(orderId:number){

    const actionSheet = await this.actionSheet.create({
      header: 'Are you sure you want to accept this order?',
      subHeader : " Please confirm your acceptance by clicking 'Confirm Order'.",
      buttons: [
        {
          text: 'Confirm',
          icon: 'checkmark-done',
          role: 'destructive',
          handler: () => {

            this.orderService.acceptOrder(orderId)
            .pipe(take(1))
            .subscribe(
              res=>{

                this.toastController.create({
                  message: res.message,
                  duration: 3000,
                  color: 'primary',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

                this.getOrders()

              },
              err=>{

                this.toastController.create({
                  message: err.message,
                  duration: 3000,
                  color: 'danger',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

              }
            )
  
          }
        },{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          // do nothing
        }
      }]
    });
    await actionSheet.present();

  }

  async rejectOrder(orderId:number){

    const actionSheet = await this.alertController.create({
      header: 'Reject Order',
      message: 'Do you have any reason for rejecting this order?',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Reject',
          handler: (data) => {
            // handle rejection with reason here
            // console.log('Rejected with reason:', data.reason);

            this.orderService.rejectOrder(orderId,data.reason)
            .pipe(take(1))
            .subscribe(
              res=>{

                this.toastController.create({
                  message: res.message,
                  duration: 3000,
                  color: 'primary',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

                this.getOrders()

              },
              err=>{

                this.toastController.create({
                  message: err.message,
                  duration: 3000,
                  color: 'danger',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

              }
            )

          }
        }
      ]
    
    });
    await actionSheet.present();

  }
  


  async confirmDelivery(orderId:number){

    const actionSheet = await this.actionSheet.create({
      header: 'Confirm Product is Delivered',
      buttons: [
        {
          text: 'Confirm',
          icon: 'checkmark-done',
          role: 'destructive',
          handler: () => {

            this.orderService.confirmOrderDelivered(orderId)
            .pipe(take(1))
            .subscribe(
              res=>{

                this.toastController.create({
                  message: res.message,
                  duration: 3000,
                  color: 'primary',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

                this.getOrders()

              },
              err=>{

                this.toastController.create({
                  message: err.message,
                  duration: 3000,
                  color: 'danger',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

              }
            )

          }
        },{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          // do nothing
        }
      }]
    });
    await actionSheet.present();

  }

  constructor(private http:HttpClient,private store:Store<AppState>,private actionSheet:ActionSheetController,private orderService:OrdersService,private toastController:ToastController, private alertController:AlertController) { }

  ngOnInit() {

    this.getOrders()
    
  }

}
