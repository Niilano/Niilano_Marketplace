import { Component, OnInit } from '@angular/core';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import {
  AlertController,
  ModalController,
  NavController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  clearFilter,
  filterProducts,
  getProducts,
} from 'src/app/store/products/products.action';
import { AppState } from 'src/app/types/AppState';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { SearchComponent } from 'src/app/components/search/search.component';
import { regionData } from '../list-product/regions';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage {
  // Page Subscribtions
  private subscriptions: Subscription[] = [];

  pageTitle = 'Products';

  isLoggedIn = false;
  userProfile: any = {};

  handleRefresh(event: any) {
    // do some work to refresh the content here
    // ...

    location.reload();

    // when the refresh is complete, call the complete() method
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  products: any = [];
  categoriesAndSubcategories: any = [];

  showFilter = true;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  checkScreen() {
    let windowWidth = window.innerWidth;
    if (windowWidth < 768) {
      this.showFilter = false;
    }
  }

  getRange(n: number): number[] {
    return [...Array(n).keys()];
  }

  productsAvailable: any;

  selectedCategory: any;
  selectedSubcategory: any;
  priceRange: any;

  masonry: any;

  navigateToProductDetails(productId: string) {
    this.navCtrl.navigateForward('/product-details', {
      queryParams: { product: productId },
    });
  }

  constructor(
    private popoverController: PopoverController,
    private store: Store<AppState>,
    private productsService: ProductsserviceService,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private router: Router,
    private navCtrl: NavController,
    private activeRoute: ActivatedRoute,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  getProducts = false;
  getProductsComplete = false;
  filteringProducts = false;
  productsLoading = true;

  navigateBack() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    this.regions = regionData.map((data) => data.region);
    // Getting all avialable categories and subcategories
    this.productsService
      .getCategoriesAndSubCategoies()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.categoriesAndSubcategories = res;

          this.activeRoute.queryParams.subscribe(async (params) => {
            let sortCategory = params['category'];
            let openFilter = params['openFilter'];
            if (openFilter && openFilter == 'true') {
              this.showFilter = true;
            } else {
              this.checkScreen();
            }
            if (sortCategory) {
              let categoryName = this.categoriesAndSubcategories.find(
                (cat: { id: any }) => cat.id == sortCategory
              );
              this.pageTitle = categoryName.name;
              this.filterData.selectedCatInfo.category_id = categoryName.id;
              this.filterData.selectedCatInfo.category_name = categoryName.name;
              this.sendFilterData();
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );

    this.store.select('checkLogin').subscribe((res) => {
      if (res.loggedIn) {
        this.isLoggedIn = res.loggedIn;
        this.userProfile = res.profile;
      }
    });

    // Getting the states of the products at each time
    this.subscriptions.push(
      this.store.select('products').subscribe((res) => {
        if (!this.getProducts) {
          this.getProducts = true;
          if (res.products.length < 1) {
            this.store.dispatch(getProducts({ page: 1 }));
            this.productsLoading = true;
          }
        }

        if (res.process) {
          this.productsLoading = true;
        }

        if (res.success) {
          this.productsLoading = false;
          this.products =
            this.products.length > 0
              ? [...this.products, ...res.products]
              : res.products;

          this.productsAvailable = res.productsAvailable;
        }

        if (res.failure) {
          this.toastController
            .create({
              message: res.message
                ? res.message
                : "Sorry, we're unable to retrieve products at the moment. Please try again later.",
              color: 'danger',
              position: 'bottom',
              cssClass: 'flex-contianer',
              buttons: [
                {
                  text: 'Retry',
                  handler: () => {
                    this.store.dispatch(getProducts({ page: 1 }));
                    this.productsService
                      .getCategoriesAndSubCategoies()
                      .pipe(take(1))
                      .subscribe(
                        (res) => {
                          this.categoriesAndSubcategories = res;
                        },
                        (err) => {
                          console.log(err);
                        }
                      );
                  },
                },
              ],
            })
            .then((toast) => toast.present());
        }
      })
    );
  }

  async presentLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Login Required',
      message: 'Please login/register to continue.',
      buttons: [
        {
          text: 'Sign in',
          handler: () => {
            this.router.navigateByUrl('auth?page=login');
          },
        },
        {
          text: 'Register Now',
          handler: () => {
            this.router.navigateByUrl('auth?page=register');
          },
        }
      ],
    });

    await alert.present();
  }

  async presentListProductModal() {
    // Migration: not using modals for listing anymore moving on to pages

    if (!this.isLoggedIn) {
      this.presentLoginAlert();
      return;
    } else {
      this.router.navigate(['/list-product']);
    }
  }

  ionViewWillLeave() {
    console.log('Page Exited');
  }

  loadMoreProducts(event: any) {
    // Fetch more products from your database or service

    let nextPage: number = Number(localStorage.getItem('currentPage'));

    if (this.getProducts) {
      this.store.dispatch(getProducts({ page: nextPage + 1 }));
    }

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async searchI() {
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  // Method to calculate the discounted price
  calculateDiscountedPrice(price: string, discountPercentage: string): number {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercentage);
    const discountAmount = (discount / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
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

  // Filter Section

  filterData: any = {
    selectedCatInfo: {},
    discount: false,
  };

  filterPriceRange = {
    minPrice: 0,
    maxPrice: 0,
  };

  categoryModal = false;

  toggleCategoryModal() {
    this.categoryModal = !this.categoryModal;
  }

  categorySelection(data: any) {
    this.filterData.selectedCatInfo.category_id = data.category_id;
    this.filterData.selectedCatInfo.category_name = data.category_name;
    this.filterData.selectedCatInfo.subcategory_id = data.subcategory_id;
    this.filterData.selectedCatInfo.subCategory_name = data.subCategory_name;
    this.filterData.selectedCatInfo.productCategory = data;
    console.log(this.filterData.selectedCatInfo.productCategory);
    // this.categoryModal.dismiss();
    this.categoryModal = false;
  }

  locationModal = false;

  regions: any = [];

  toggleLocationModal() {
    this.locationModal = !this.locationModal;
  }

  receiveLocationData(data: any) {
    this.filterData.location = data;
    // console.log(this.productInfo.productLocation)
    this.locationModal = false;
  }

  filteringData = false;

  sendFilterData() {
    this.productsLoading = true;
    this.showFilter = window.innerWidth < 768 ? false : true;
    // if(this.filterData.selectedCatInfo.category_id == "0" && filteringData==false){
    //   this.productsLoading = false
    //   return
    // }
    this.getProducts = false;
    this.http
      .get(
        `${environment.server}/products/filter/${
          this.filterData.selectedCatInfo.category_id
        }/${this.filterData.selectedCatInfo.subcategory_id}/${
          this.filterData.location
        }/${JSON.stringify(this.filterPriceRange)}/${this.filterData.discount}`
      )
      .subscribe((res: any) => {
        this.filteringData = true;
        // console.log(res.products)
        this.productsLoading = false;
        this.products = res.products;
        this.getProducts = true;
      });
  }

  clearFilter() {
    this.filteringData = false;

    this.showFilter = window.innerWidth < 768 ? false : true;

    this.filterData = {
      selectedCatInfo: {},
      discount: false,
    };

    this.filterPriceRange = {
      minPrice: 0,
      maxPrice: 0,
    };

    this.products = [];

    this.store.dispatch(getProducts({ page: 1 }));
  }
}
