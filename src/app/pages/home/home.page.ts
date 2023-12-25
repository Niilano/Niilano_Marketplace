import {
  Component, ElementRef, ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/types/AppState';
import { Router } from '@angular/router';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import {
  AlertController,
  ModalController,
  Platform,
  ScrollDetail,
  ToastController,
} from '@ionic/angular';
import { getProducts } from 'src/app/store/products/products.action';
import { Subscription, take } from 'rxjs';
import { SearchComponent } from 'src/app/components/search/search.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ListRentItemModalComponent } from 'src/app/components/list-rent-item-modal/list-rent-item-modal.component';
import { ListServicesComponent } from 'src/app/components/list-services/list-services.component';
import {
  DataSharingService,
  ScrollDirection,
} from 'src/app/services/data-sharing/data-sharing.service';
import { getProductsSummary } from 'src/app/store/productsSummary/productsSummary.action';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  pageTitle = 'home';

  // This method takes care of refreshing the page
  handleRefresh(event: any) {

    // this.initialActions();
    this.store.dispatch(getProductsSummary())

    // when the refresh is complete, call the complete() method
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  // Stores the user logged in status, by default it's false until checked
  isLoggedIn = false;

  products: any = [];
  rentingProducts: any;
  servicesProducts: any;

  welcomeMessage = false;

  isIOS!: boolean;

  onScroll(event: CustomEvent<ScrollDetail>) {

    // Define a variable to store the previous scroll position
    let previousScrollTop = 0;
    // Get the current scroll position
    const currentScrollTop = event.detail.scrollTop;

    // Determine the scroll direction
    const scrollDirection =
      currentScrollTop > previousScrollTop
        ? ScrollDirection.Down
        : ScrollDirection.Up;

    if (scrollDirection == ScrollDirection.Down) {
      this.dataSharing.endScroll(scrollDirection);
    } else {
      this.dataSharing.startScroll(scrollDirection);
    }

    // Update the previous scroll position
    previousScrollTop = currentScrollTop;
  }

  constructor(
    private store: Store<AppState>, private router: Router,
    private toastController: ToastController,
    private platform: Platform,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private dataSharing: DataSharingService
  ) {
    this.isIOS = this.platform.is('ios');
  }

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

  // Page Subscribtions
  private subscriptions: Subscription[] = [];

  connected!: boolean;

  // Incase of connection error this method retry getting the products again
  retry() {
    // this.initialActions();
    this.store.dispatch(getProductsSummary())
  }

  slidesPerView = 1.5

  checkScreen() {
    let innerWidth = window.innerWidth;
    switch (true) {
      case 340 <= innerWidth && innerWidth <= 400:
        this.slidesPerView = 1.5
        break;
      case 401 <= innerWidth && innerWidth <= 700:
        this.slidesPerView = 1.6
        break;
      case 701 <= innerWidth && innerWidth <= 900:
        this.slidesPerView = 3.2
        break;
      case 901 <= innerWidth && innerWidth <= 1000:
        this.slidesPerView = 4.5
        break;
      case 1001 <= innerWidth:
        this.slidesPerView = 5.5
        break;
    }
  }

  modifyImageUrl(url: string): string {
    if (url) {
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
    }

    return url
      ? url
      : 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
  }

  // Smooth loading of products images
  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.classList.add('loaded');
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

  async presentRentItemsModal() {
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
        component: ListRentItemModalComponent,
        showBackdrop: true,
      });
      return await modal.present();
    }
  }

  async presentListProductModal() {
    // Migration: not using modals for listing anymore moving on to pages
    if (localStorage.getItem('access_token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    if (!this.isLoggedIn) {
      this.presentLoginAlert();
      return;
    } else {
      this.router.navigate(['/list-product']);
    }
  }

  loadMoreProducts(event: any) {
    // Not Used
    // Fetch more products from the database or service

    let nextPage: number = Number(localStorage.getItem('currentPage'));

    this.store.dispatch(getProducts({ page: nextPage + 1 }));

    event.target.complete();
  }

  // Opens the search modal component
  async searchI() {
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  totalUnreadMessages = 0;

  // Opens the filter modal
  openfilter() {
    this.router.navigate(['/products'], { queryParams: { openFilter: true } });
  }

  // Method to calculate the discounted price
  calculateDiscountedPrice(price: string, discountPercentage: string): number {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercentage);
    const discountAmount = (discount / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  initialActions() {
    this.store.dispatch(startLoading())
    // Get summary of all products belonging to discounted, trending and for sale
    this.subscriptions.push(
      this.http
        .get<{ products: any }>(
          `${environment.server}/products/productsSummary/1`
        )
        .pipe(take(1))
        .subscribe((res) => {
          // console.log(res);
          this.products = res
          this.connected = true
          this.store.dispatch(endLoading())
        }, err => {
          console.log(err)
          this.store.dispatch(endLoading())
          this.connected = false
          this.toastController
            .create({
              message: err.error.error ? err.error.error : 'Unable to connect',
              duration: 4000,
              header: 'Connection error',
              color: 'danger',
              position: 'top',
            })
            .then((toast) => {
              toast.present();
            });
        })
    );
  }

  getProducts = false

  ionViewWillEnter() {



    setTimeout(() => {
      this.checkScreen();
    }, 1000);

    this.subscriptions.push(
      this.platform.resize.subscribe(async () => {
        this.checkScreen();
      })
    );

    this.subscriptions.push(
      this.store.select('getProductsSummary').subscribe(
        (res) => {
          if (res.loading) {
            this.store.dispatch(startLoading());
          }
          else {
            if (!res.data.productsAvailable && !res.data.trendingProducts && !res.data.discountProducts) {
              if (!this.getProducts) {
                //  console.log("Working")
                this.getProducts = true
                this.store.dispatch(getProductsSummary())
              }
            }
          }

          if (res.success && res.data) {
            this.connected = true
            this.store.dispatch(endLoading());
            // Assuming res.data is an object with properties
            this.products = res.data;
          }

          if (res.failed) {
            // console.log(res.message)
            this.store.dispatch(endLoading())
            this.connected = false
            this.toastController
              .create({
                message: res.message ? res.message : 'Unable to connect',
                duration: 4000,
                header: 'Connection error',
                color: 'danger',
                position: 'top',
              })
              .then((toast) => {
                toast.present();
              });
          }
        }
      )
    );


    // this.subscriptions.push(
    //   this.websocketservice.totalUnreadMessages.subscribe((res) => {
    //     this.totalUnreadMessages = res;
    //   })
    // );

    if (localStorage.getItem('access_token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  ionViewWillLeave() {
    // Unsubscribe from subscriptions
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
