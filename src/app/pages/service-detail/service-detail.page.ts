import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit {
  serviceData: any = '';
  dataAvailable = true;

  getListing(listingId: any) {
    this.store.dispatch(startLoading());
    this.http
      .get(`${environment.server}/services/getListing/${listingId}`)
      .subscribe(
        (res) => {
          this.store.dispatch(endLoading());
          // console.log(res);
          this.serviceData = res;
        },
        async (err) => {
          this.dataAvailable = false;
          this.store.dispatch(endLoading());
          // console.log(err);
          const toast = await this.toastController.create({
            message: err.error.msg
              ? err.error.msg
              : 'An unexpected error happened.',
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          toast.present();
        }
      );
  }

  // Method to calculate the discounted price
  calculateDiscountedPrice(price: string, discountPercentage: string): number {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercentage);
    const discountAmount = (discount / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  async handleCall(phoneNumber: any) {
    const alert = await this.alertCtrl.create({
      header: 'Call',
      message: `Do you want to call this number?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Call',
          handler: () => {
            window.location.href = `tel:${phoneNumber}`;
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

            let requestData = {
              listingId: this.serviceData.id,
              userRequestingName: data.name,
              userRequestingPhone: data.phoneNumber,
            };

            this.http
              .post<{ msg: string }>(
                `${environment.server}/services/requestCallback`,
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

  constructor(
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private router: Router,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      if (!params['listingId']) {
        this.toastController
          .create({
            message: 'Your listing does not have an id',
            duration: 3000,
            header: 'Listing Error',
            color: 'danger',
            position: 'bottom',
          })
          .then((toast) => {
            toast.present();
            toast.onDidDismiss().then(() => {
              this.router.navigate(['services']);
            });
          });
      } else {
        let listingId = params['listingId'];
        console.log(listingId);
        this.getListing(listingId);
      }
    });
  }
}
