import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {

  constructor(private modalCTRL : ModalController,private toastController:ToastController) { }

  dismissModal(){
    this.modalCTRL.dismiss()
  }

  availableBalance = 0
  pendingMoney = 0

  withdrawMoney(){
    
    this.toastController.create({
      message: "Sorry, you need at least GH₵10 to withdraw.",
      duration: 2000,
      color: 'danger',
      position: 'top'
    }).then((toast) => {
      toast.present()
    })

  }

  ngOnInit() {}

}
