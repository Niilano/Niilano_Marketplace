import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ListServicesComponent } from 'src/app/components/list-services/list-services.component';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  pageTitle = 'services';

  slideOpts: any = {
    initialSlide: 0,
    speed: 1000,
    slidesPerView: 2.5,
    spaceBetween: 10,
    zoom: true,
    lazy: true,
    grabCursor: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // autoplay: {
    //   delay: 2000,
    //   autoplayDisableOnInteraction : true,
    //   autoplayEnableOnInteraction : true
    // },
  };

  isLoggedIn = false;

  async presentLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Login Required',
      message: 'Please login/register to continue.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigateByUrl('auth?page=login');
          },
        },
      ],
    });

    await alert.present();
  }

  async presentListServicesModal() {
    if (localStorage.getItem('access_token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    if (!this.isLoggedIn) {
      this.presentLoginAlert();
      return;
    } else {
      const modal = await this.modalCtrl.create({
        component: ListServicesComponent,
        showBackdrop: true,
      });
      return await modal.present();
    }
  }

  servicesData: any = [];

  dataAvailable = true;

  getServices() {
    this.store.dispatch(startLoading());
    this.http
      .get<[]>(`${environment.server}/services/getAllListings`)
      .subscribe(
        (res) => {
          this.store.dispatch(endLoading());
          // console.log(res)
          this.servicesData = res;
          if (this.servicesData.length < 1) {
            this.dataAvailable = false;
          }
          // console.log(this.servicesData);
        },
        (err) => {
          this.store.dispatch(endLoading());
          console.log(err);
        }
      );
  }

  ionViewWillEnter() {
    if (this.servicesData.length < 1) {
      this.getServices();
    }
  }

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) {}

  ngOnInit() {}
}
