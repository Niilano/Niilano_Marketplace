import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ListRentItemModalComponent } from 'src/app/components/list-rent-item-modal/list-rent-item-modal.component';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rent-items-details',
  templateUrl: './rent-items-details.page.html',
  styleUrls: ['./rent-items-details.page.scss'],
})
export class RentItemsDetailsPage implements OnInit {
  private subscriptions: Subscription[] = [];

  slidesPerView = 1.2

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
    breakpoints: {
      // When window width is >= 576px
      576: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      // When window width is >= 768px
      768: {
        slidesPerView: 3.1,
        spaceBetween: 15,
      },
      // When window width is >= 992px
      992: {
        slidesPerView: 3.5,
        spaceBetween: 20,
      },
      // When window width is >= 1200px
      1200: {
        slidesPerView: 5,
        spaceBetween: 25,
      },
    },
  };

  // Method to calculate the discounted price
  calculateDiscountedPrice(price: string, discountPercentage: string): number {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercentage);
    const discountAmount = (discount / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  house: any;
  vehicle: any;
  machinery: any;
  eventItem: any;

  get houseImages() {
    return [
      this.house.bedroomImage,
      this.house.washroomImage,
      this.house.compoundImage,
      this.house.infrontImage,
      this.house.additionalImage,
    ].filter((image) => !!image); // Filter out undefined or null images
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router,
    private store: Store<AppState>,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  async handleCall(phoneNumber: any) {
    const alert = await this.alertCtrl.create({
      header: 'Call',
      message: `Do you want to call this number?<br>0${phoneNumber}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Call',
          handler: () => {
            window.location.href = `tel:0${phoneNumber}`;
          },
        },
      ],
    });

    await alert.present();
  }

  async handleRequestCallback() {
    const alert = await this.alertCtrl.create({
      header: 'Request Call Back',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Your Name',
        },
        {
          name: 'phoneNumber',
          type: 'tel',
          placeholder: 'Phone Number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: (data) => {
            // Handle the data submitted by the user
            // console.log('Name:', data.name);
            // console.log('Phone Number:', data.phoneNumber);

            let requestData;

            if (this.house) {
              requestData = {
                listingId: this.house.id,
                userRequestingName: data.name,
                userRequestingPhone: data.phoneNumber,
                listingType: 'houseRent',
              };
            } else if (this.vehicle) {
              requestData = {
                listingId: this.vehicle.id,
                userRequestingName: data.name,
                userRequestingPhone: data.phoneNumber,
                listingType: 'vehicleRent',
              };
            } else if (this.machinery) {
              requestData = {
                listingId: this.machinery.id,
                userRequestingName: data.name,
                userRequestingPhone: data.phoneNumber,
                listingType: 'machineryRent',
              };
            } else if (this.eventItem) {
              requestData = {
                listingId: this.eventItem.id,
                userRequestingName: data.name,
                userRequestingPhone: data.phoneNumber,
                listingType: 'eventItemRent',
              };
            }

            this.http
              .post<{ msg: string }>(
                `${environment.server}/renting/requestCallback`,
                requestData
              )
              .subscribe(
                (res) => {
                  this.toastController
                    .create({
                      message: res.msg,
                      duration: 2000,
                      header: 'Callback requested',
                      color: 'primary',
                      position: 'bottom',
                    })
                    .then((toast) => {
                      toast.present();
                    });
                },
                (err) => {
                  // console.log(err.error)
                  this.toastController
                    .create({
                      message: err.error.error
                        ? err.error.error
                        : 'An unexpected error happened...',
                      duration: 2000,
                      header: 'Error',
                      color: 'danger',
                      position: 'bottom',
                    })
                    .then((toast) => {
                      toast.present();
                    });
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }

  navigateBack() {
    this.navCtrl.back();
  }

  isLoggedIn = false;

  async presentRentItemsModal() {
    if (localStorage.getItem('access_token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    if (!this.isLoggedIn) {
      // this.presentLoginAlert();
      return;
    } else {
      const modal = await this.modalCtrl.create({
        component: ListRentItemModalComponent,
        showBackdrop: true,
        componentProps: {
          selectedCategory: this.selectedCategory,
          data: this.data,
        },
      });
      return await modal.present();
    }
  }

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

  ngOnInit() {}

  selectedCategory = '';

  data = {};

  ionViewDidEnter() {
    this.subscriptions.push(
      this.activeRoute.queryParams.subscribe((params) => {
        if (!params['id'] && !params['item']) {
          this.toastController
            .create({
              message: 'Your item does not have an id',
              duration: 3000,
              header: 'Item Error',
              color: 'danger',
              position: 'bottom',
            })
            .then((toast) => {
              toast.present();
              toast.onDidDismiss().then(() => {
                this.router.navigate(['rent']);
              });
            });
        } else {
          if (params['item'] == 'house') {
            this.selectedCategory = 'housing';
            this.store.dispatch(startLoading());
            this.http
              .get(`${environment.server}/renting/getHouse/${params['id']}`)
              .subscribe((res) => {
                this.store.dispatch(endLoading());
                this.house = res;
              });
          } else if (params['item'] == 'vehicle') {
            this.selectedCategory = 'vehicles';
            this.store.dispatch(startLoading());
            this.http
              .get(`${environment.server}/renting/getVehicle/${params['id']}`)
              .subscribe((res) => {
                // console.log(res);
                this.store.dispatch(endLoading());
                this.vehicle = res;
              });
          } else if (params['item'] == 'machinery') {
            this.selectedCategory = 'equipment';
            this.store.dispatch(startLoading());
            this.http
              .get(`${environment.server}/renting/getmachinery/${params['id']}`)
              .subscribe((res) => {
                // console.log(res);
                this.store.dispatch(endLoading());
                this.machinery = res;
              });
          } else if (params['item'] == 'events') {
            this.selectedCategory = 'events and decor';
            this.store.dispatch(startLoading());
            this.http
              .get(
                `${environment.server}/renting/geteventsitems/${params['id']}`
              )
              .subscribe((res) => {
                // console.log(res);
                this.store.dispatch(endLoading());
                this.eventItem = res;
              });
          }
        }

        if (params['data']) {
          this.data = JSON.parse(params['data']);
        }
      })
    );
  }

  ionViewWillLeave() {
    // Unsubscribe from all subscriptions when the component is leaving
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
