import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { SaveditemsService } from 'src/app/services/saveditems.service';
import { UserprofileService } from 'src/app/services/userprofile/userprofile.service';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';


@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
})
export class OrderModalComponent implements OnInit {

  isLoggedIn:boolean | undefined

  name!: string;
  email!: string;
  phone!: string;
  address!: string;
  terms!: boolean;
  specialRequests!: string;

  paymentOption!:string

  amountPayable:any
  amount!: number;

  reference:any

  @Input() selectedItem: any
  

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  submitOrder() {

    if(!this.isLoggedIn){

      this.toastController.create({
        message: "Please Login to continue...",
        duration: 3000,
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }
    
    // Implement logic to submit the order details
    this.submitted = true

    this.store.dispatch(startLoading())

    if(!this.name || !this.email || !this.phone || !this.address || !this.terms){

    this.toastController.create({
      message: "Please fill in the required fields before proceeding",
      duration: 1500,
      header: "Validation Error",
      color: 'danger',
      position: 'top'
    }).then((toast) => {
      toast.present()
    })

    this.store.dispatch(endLoading())

    return

  }

  let formData = {
    name:this.name,
    d_email:this.email,
    phone:this.phone,
    address:this.address,
    terms:this.terms,
    price:this.amountPayable,
    quantity:this.selectedItem.quantity,
    paymentMethod:this.paymentOption,
    productId : this.selectedItem.id,
    sellerId:this.selectedItem.sellerId,
    specialRequests : this.specialRequests
  }

  if(formData.paymentMethod == "Cash"){
    // console.log("Cash logic")
    // console.log(formData)

    this.modalCtrl.dismiss()

    this.orderService.orderProduct(formData)
    .pipe(take(1))
    .subscribe(
      res=>{

        // console.log(res)

        this.toastController.create({
          message: res.message,
          duration: 1500,
          header: "Order Successful",
          color: 'dark',
          position: 'top'
        }).then((toast) => {
          toast.present()
        })

        this.modalCtrl.dismiss()
        
        this.store.dispatch(endLoading())

        this.savedItemsService.removeSavedItem(formData.productId)

        this.router.navigate(['order-history'])

      },
      err=>{
        
        err.error.message && this.toastController.create({
          message: err.error.message,
          duration: 3000,
          header: "Order Failed",
          color: 'danger',
          position: 'top'
        }).then((toast) => {
          toast.present()
        })

        this.modalCtrl.dismiss()
        this.store.dispatch(endLoading())

      }
    )

  }

  if(formData.paymentMethod == "Mobile"){
    
    this.toastController.create({
      message: "Sorry mobile money transaction is not working at the moment.",
      duration: 1500,
      color: 'danger',
      position: 'top'
    }).then((toast) => {
      toast.present()
    })

    this.store.dispatch(endLoading())

  }

  }

  submitted = false

  constructor(private modalCtrl: ModalController, private toastController : ToastController,private usersProfileService:UserprofileService,private orderService:OrdersService,private router:Router,private store:Store<AppState>,private savedItemsService:SaveditemsService) { }

  paymentDone(event:any){

    // console.log(event)

  }

  paymentCancel(){
    console.log("Payment cancelled")
  }

  ngOnInit() {

    this.store.select('checkLogin')
      .subscribe(
        res => {

          this.isLoggedIn = res.loggedIn

        }
      )

    this.amountPayable = this.selectedItem.quantity * this.selectedItem.price

    this.amount = parseInt(this.amountPayable) * 100

    // console.log(this.selectedItem)

    this.reference = "alfredthis.selectedItem.name"

    this.usersProfileService.myProfile()
    .pipe(take(1))
    .subscribe(
      res=>{

        if(!res.profile.first_name && !res.profile.last_name){
          this.name = ""
        }

        else if(res.profile.first_name && !res.profile.last_name){
          this.name = `${res.profile.first_name}`
        }

        else if(!res.profile.first_name && res.profile.last_name){
          this.name = `${res.profile.last_name}`
        }

        else if(res.profile.first_name && res.profile.last_name){
          this.name = `${res.profile.first_name} ${res.profile.last_name}`
        }
        
        this.email = res.profile.email
        this.phone = res.profile.phone_number
        this.address = res.profile.address

      }
    )
  
  }


  makePayment() {
    // code to make payment here
    // if (!this.selectedOption) {
    //   this.toastController.create({
    //     message:"Please select a payment option before placing the order",
    //     duration:3000,
    //     color:'secondary',
    //     position : 'top'
    //   }).then((toast)=>{
    //     toast.present()
    //   })
    //   return;
    // }
    // this.dismissModal();
  }

  ngAfterViewInit(){

  }

}
