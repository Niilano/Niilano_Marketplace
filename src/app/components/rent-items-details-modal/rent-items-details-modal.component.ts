import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-rent-items-details-modal',
  templateUrl: './rent-items-details-modal.component.html',
  styleUrls: ['./rent-items-details-modal.component.scss'],
})
export class RentItemsDetailsModalComponent implements OnInit {
  house: any; // Input to receive the house details data

  closeModal() {
    this.modalCtrl.dismiss();
  }

  slideOpts: any = {
    initialSlide: 1,
    speed: 1000,
    slidesPerView: 1.2,
    spaceBetween: 5,
    loop: true,
    zoom: true,
    lazy: true,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 2000,
      autoplayDisableOnInteraction: true,
      autoplayEnableOnInteraction: true,
    },
  };

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.house = navParams.get('data');
    console.log(this.house);
  }

  ngOnInit() {}
}
