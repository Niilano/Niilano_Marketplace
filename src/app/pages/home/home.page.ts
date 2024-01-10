import { Component, ElementRef, ViewChild } from '@angular/core';
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
    // this.store.dispatch(getProductsSummary())

    // when the refresh is complete, call the complete() method
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  navigateProductsCategories(catId: number) {
    this.router.navigateByUrl(`products?category=${catId}`);
  }

  // Stores the user logged in status, by default it's false until checked
  isLoggedIn = false;
  userProfile = {}

  // Determines whether to show a welcome message to a new user upon successful registration
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
    private store: Store<AppState>,
    private router: Router,
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
    // this.store.dispatch(getProductsSummary());
  }

  slidesPerView = 2.5;
  slidesPerViewRent = 2;
  slidesPerViewCat = 1.5;

  checkScreen() {
    let innerWidth = window.innerWidth;
    switch (true) {
      case 340 <= innerWidth && innerWidth <= 400:
        this.slidesPerView = 2.5;
        this.slidesPerViewRent = 2;
        this.slidesPerViewCat = 1.5;
        break;
      case 401 <= innerWidth && innerWidth <= 500:
        this.slidesPerView = 2.5;
        this.slidesPerViewRent = 2;
        this.slidesPerViewCat = 1.5;
        break;
      case 500 <= innerWidth && innerWidth <= 767:
        this.slidesPerView = 4.5;
        this.slidesPerViewRent = 4;
        this.slidesPerViewCat = 1.5;
        break;
      case 767 <= innerWidth && innerWidth <= 900:
        this.slidesPerView = 3.5;
        this.slidesPerViewRent = 3.5;
        break;
      case 901 <= innerWidth && innerWidth <= 1000:
        this.slidesPerView = 4.5;
        this.slidesPerViewRent = 4.5;
        break;
      case 1001 <= innerWidth:
        this.slidesPerView = 5.5;
        this.slidesPerViewRent = 4.5;
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

  // Not Used
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

  // Redirects to the products page and pens the filter modal
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

  getProducts = false;

  trendingProducts: any = [];
  trendingProductsLoading = true;

  discountProducts: any = [];
  discountProductsLoading = true;

  productCategories: any = [];
  productCategoriesLoading = true;

  houses: any = [];
  housesLoading = true;

  vehicles: any = [];
  vehiclesLoading = true;

  getRange(n: number): number[] {
    return [...Array(n).keys()];
  }

  ionViewWillEnter() {
    this.checkScreen();

    this.subscriptions.push(
      this.platform.resize.subscribe(async () => {
        this.checkScreen();
      })
    );

    this.trendingProducts.length < 1 &&
      this.subscriptions.push(
        this.http
          .get(`${environment.server}/products/trendingProducts`)
          .subscribe((res) => {
            // console.log(res)
            this.trendingProductsLoading = false;
            this.trendingProducts = res;
          })
      );

    this.discountProducts.length < 1 &&
      this.subscriptions.push(
        this.http
          .get(`${environment.server}/products/discountProducts`)
          .subscribe((res) => {
            // console.log(res)
            this.discountProductsLoading = false;
            this.discountProducts = res;
          })
      );

    this.productCategories.length < 1 &&
      this.subscriptions.push(
        this.http
          .get(`${environment.server}/products/categories-only`)
          .subscribe((res) => {
            // console.log(res)
            this.productCategoriesLoading = false;
            this.productCategories = res;
          })
      );

    // get houses
    this.houses.length < 1 &&
      this.subscriptions.push(
        this.http
          .get(`${environment.server}/renting/getHouses`)
          .subscribe((res) => {
            // console.log(res)
            this.housesLoading = false;
            this.houses = res;
          })
      );

    // get vehicles
    this.vehicles.length < 1 &&
      this.subscriptions.push(
        this.http
          .get(`${environment.server}/renting/getVehicles`)
          .subscribe((res) => {
            // console.log(res)
            this.vehiclesLoading = false;
            this.vehicles = res;
          })
      );

      this.store.select('checkLogin')
      .pipe(take(1))
      .subscribe((res) => {
        this.isLoggedIn = res.loggedIn;
        this.userProfile = res.profile
      });

  }

  ionViewWillLeave() {
    // Unsubscribe from subscriptions
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
