import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { getProduct } from 'src/app/store/product/product.actions';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit {

  rating:any
  comment:any

  @Input()
  productId!: number;

  submitComment(){

    let commentObj = {
      product_id : this.productId,
      comment : this.comment,
      rating : this.rating
    }

    if(!commentObj.comment){

      this.toastController.create({
        message: "Please enter some comments",
        duration: 3000,
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    } else if(!commentObj.rating){

      this.toastController.create({
        message: "Please select rating",
        duration: 3000,
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    this.store.dispatch(startLoading())
  
      this.http.post<{ message: string }>(`${environment.server}/products/comment`, commentObj)
        .pipe(take(1))
        .subscribe(
          res => {
  
            this.store.dispatch(endLoading())
  
            this.toastController.create({
              message: res.message,
              duration: 3000,
              color: 'primary',
              position: 'top'
            }).then((toast) => {
              toast.present()
            })

            this.modalCtrl.dismiss()
  
            this.store.dispatch(getProduct({ productID: Number(this.productId) , details:'true' }))
  
          },
          err => {
  
            this.store.dispatch(endLoading())
  
            err.error.message && this.toastController.create({
              message: err.error.message=="No authorization header" ? "Please log in to comment" : err.error.message,
              duration: 3000,
              color: 'danger',
              position: 'top'
            }).then((toast) => {
              toast.present()
            })
  
            !err.error.message && this.toastController.create({
              message: "Sorry! unable to comment product. Try again.",
              duration: 3000,
              color: 'danger',
              position: 'top'
            }).then((toast) => {
              toast.present()
            })
  
          }
        )

  }

  closeModal(){
    this.modalCtrl.dismiss()
  }

  constructor(private modalCtrl: ModalController,private toastController:ToastController,private http:HttpClient,private store:Store<AppState>) { }

  ngOnInit() {
    console.log(this.productId)
  }

}
