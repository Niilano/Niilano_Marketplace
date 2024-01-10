import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {

  chatSellerMessageContent = ""

  orders:any

  chatSeller(sellerId:number){

    console.log("Clicked")

    if(!this.chatSellerMessageContent){

      this.toastController.create({
        message: "Please type a message to send to seller...",
        duration: 1500,
        color: 'danger',
        position: 'bottom'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    localStorage.setItem("chatSellerMessageContent",this.chatSellerMessageContent)

    this.router.navigate([`messages/${sellerId}`])

  }

  ionViewDidLeave(){
    this.chatSellerMessageContent = ""
  }


  getOrders(){

    this.store.dispatch(startLoading())

    this.http.get<{message:string,orders:[]}>(`${environment.server}/orders/order-history`)
    .pipe(take(1))
    .subscribe(
      res=>{
        this.store.dispatch(endLoading())
        this.orders = res.orders
        console.log(this.orders)
      },
      err=>{
        err.error.message && console.log(err.error.message)
      }
    )

  }

  showDetails:number | undefined

  toggleOrderDetails(orderID:number) {
    this.showDetails = this.showDetails!=orderID ? orderID : 0
    this.chatSellerMessageContent = ""
  }

  deleteItem(item:any) {
    // implement item deletion logic here
  }
  constructor(private http:HttpClient,private store:Store<AppState>,private toastController:ToastController,private router : Router) { }

  ngOnInit() {
    this.getOrders()
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
