import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  NavController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { EditproductComponent } from 'src/app/components/editproduct/editproduct.component';
import { ListProductComponent } from 'src/app/components/list-product/list-product.component';
import { ListRentItemModalComponent } from 'src/app/components/list-rent-item-modal/list-rent-item-modal.component';
import { ListServicesComponent } from 'src/app/components/list-services/list-services.component';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { getUserProducts } from 'src/app/store/userProducts/userproducts.actions';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.page.html',
  styleUrls: ['./my-products.page.scss'],
})
export class MyProductsPage implements OnInit {
  pageTitle = "My Catalog"
  userRentItems: any = [];
  userServicesListings:any = [];

  selectedCategory: 'selling' | 'renting' | 'services' = 'selling';

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

  modifyImageUrl(url: string): string {
    if(url){
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

    return url ? url : 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
}

  navigateBack() {
    this.navCtrl.back();
  }

  handleEditCompleted() {
    // Perform any actions you need here
    // For example, refresh data, show a message, etc.
    console.log('Editing completed in the child modal');
  }

  async presentRentItemsModalToMakeChanges(data: any, category: string) {
    let dataCopy = JSON.parse(JSON.stringify(data));
    this.dismissOpenPopovers();
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
        componentProps: {
          selectedCategory: category,
          data: dataCopy,
          editingListing: true,
        },
      });

      modal.onDidDismiss().then((data) => {
        console.log(data)
        // let updateUserRentItems = localStorage.getItem('updateUserRentItems');
        // if (updateUserRentItems=="true") {
        //   console.log("Working")
          // this.getRentingListingItems();
          // localStorage.removeItem('updateUserRentItems');
        // }
      });

      return await modal.present();
    }
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

  // Method to handle item edit
  editItem(item: any) {
    // Implement the edit logic, e.g., navigate to the edit page with item details
  }

  // Method to handle item deletion
  async deleteRentingItem(itemId: number, itemCategory: string) {
    this.dismissOpenPopovers();
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete this item?',
      subHeader: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            // do nothing
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.store.dispatch(startLoading());
            // logic for deleting the product here
            this.deleteRentingItemComplete(itemId, itemCategory);
          },
        },
      ],
    });
    await actionSheet.present();
  }

  deleteRentingItemComplete(itemId: number, itemCategory: string) {
    this.http
      .delete<{ message: string }>(
        `${environment.server}/renting/deleteUserRentingListings/${itemId}/${itemCategory}`
      )
      .subscribe(
        (res) => {
          this.store.dispatch(endLoading());
          this.toastController
            .create({
              message: res.message,
              duration: 4000,
              header: 'Listing Deleted',
              color: 'primary',
              position: 'bottom',
            })
            .then((toast) => {
              toast.present();
            });

          this.getRentingListingItems();
        },
        (err) => {
          this.store.dispatch(endLoading());
          this.toastController
            .create({
              message: err.error
                ? err.error.error
                : 'An unexpected error happened',
              duration: 4000,
              header: 'Error deleting listing',
              color: 'danger',
              position: 'bottom',
            })
            .then((toast) => {
              toast.present();
            });
        }
      );
  }

    // Method to handle service listing deletion
    async deleteServiceListing(itemId: number) {
      this.dismissOpenPopovers();
      const actionSheet = await this.actionSheetController.create({
        header: 'Are you sure you want to delete this service?',
        subHeader: 'This action cannot be undone.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close',
            handler: () => {
              // do nothing
            },
          },
          {
            text: 'Delete',
            icon: 'trash',
            role: 'destructive',
            handler: () => {
              this.store.dispatch(startLoading());
              // logic for deleting the product here
              this.deleteServiceListingComplete(itemId);
            },
          },
        ],
      });
      await actionSheet.present();
    }
  
    deleteServiceListingComplete(itemId: number) {
      this.http
        .delete<{ message: string }>(
          `${environment.server}/services/deleteUserServiceListing/${itemId}}`
        )
        .subscribe(
          (res) => {
            this.store.dispatch(endLoading());
            this.toastController
              .create({
                message: res.message,
                duration: 3000,
                header: 'Listing Deleted',
                color: 'primary',
                position: 'bottom',
              })
              .then((toast) => {
                toast.present();
              });
  
            this.getServicesListings();
          },
          (err) => {
            this.store.dispatch(endLoading());
            this.toastController
              .create({
                message: err.error
                  ? err.error.error
                  : 'An unexpected error happened',
                duration: 4000,
                header: 'Error deleting listing',
                color: 'danger',
                position: 'bottom',
              })
              .then((toast) => {
                toast.present();
              });
          }
        );
    }

  ionViewWillLeave() {
    this.dismissOpenPopovers();
  }

  dismissOpenPopovers() {
    this.popoverController.dismiss();
  }

  constructor(
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private store: Store<AppState>,
    private toastController: ToastController,
    private productsService: ProductsserviceService,
    private popoverController: PopoverController,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController,
    private dataSharingService: DataSharingService
  ) {}

  // async presentListProductModal() {
  //   if (!this.user.username) {
  //     this.toastController
  //       .create({
  //         message: 'Please provide a username to continue',
  //         duration: 2000,
  //         color: 'danger',
  //         position: 'bottom',
  //       })
  //       .then((toast) => {
  //         toast.present();
  //       });

  //     return;
  //   }

  //   const modal = await this.modalCtrl.create({
  //     component: ListProductComponent,
  //     showBackdrop: true,
  //   });
  //   return await modal.present();
  // }

  async presentEditProductModal(product: any) {
    const modal = await this.modalCtrl.create({
      component: EditproductComponent,
      showBackdrop: true,
      componentProps: { product },
    });
    return await modal.present();
  }

  async presentDeleteProductActionSheet(productID: Number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete this product?',
      subHeader: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            // do nothing
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.store.dispatch(startLoading());
            // logic for deleting the product here
            this.productsService
              .removeProduct(productID)
              .pipe(take(1))
              .subscribe(
                (res) => {
                  this.store.dispatch(endLoading());
                  this.toastController
                    .create({
                      message: res.message,
                      duration: 5000,
                      header: 'Product Deleted',
                      color: 'primary',
                      position: 'bottom',
                    })
                    .then((toast) => {
                      toast.present();
                    });

                  this.store.dispatch(getUserProducts());
                },
                (err) => {
                  this.store.dispatch(endLoading());
                  this.toastController
                    .create({
                      message: err.message,
                      duration: 5000,
                      header: 'Error deleting product',
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
    await actionSheet.present();
  }

  products: any;

  editProduct(product: any) {}

  user: any;

  ngOnInit() {

    this.dataSharingService.editCompleted$.subscribe(
      (editCompleted) => {
        if (editCompleted) {
          this.getRentingListingItems();
          this.store.dispatch(getUserProducts());
        }
      }
    );

    this.store.select('checkLogin').subscribe((res) => {
      if (res.loggedIn) {
        this.user = res.profile;
      }
    });

    this.store.dispatch(getUserProducts());

    this.store.select('userProducts').subscribe((products) => {
      if (products.process) {
        this.store.dispatch(startLoading());
      }

      if (products.success) {
        this.store.dispatch(endLoading());
        this.products = products.products;
      }

      if (products.failure) {
        this.store.dispatch(endLoading());

        this.toastController
          .create({
            message: products.message,
            duration: 5000,
            header: 'Error',
            color: 'danger',
            position: 'bottom',
          })
          .then((toast) => {
            toast.present();
          });
      }
    });
  }

  async share(platform: string) {
    // Logic to share content on selected platform

    const username = encodeURIComponent(this.user.username);

    const link = `${window.location.origin}/@/${username}`;

    const message =
      encodeURIComponent(`Meet our seller on Niilano! Explore their wide range of products by visiting their profile link.

${link}

#Niilano #${this.user.username} #ShopWithConfidence #OnlineMarketplace #WideRangeOfProducts #ExploreNow`);

    let shareUrl: any;

    switch (platform) {
      case 'copy':
        // copy the link to the clipboard using the browser API
        try {
          await navigator.clipboard.writeText(message);

          const toast = await this.toastController.create({
            message: 'Link copied!',
            duration: 2000,
            color: 'dark',
          });

          await toast.present();
        } catch (err) {
          console.error('Failed to copy text: ', err);

          const toast = await this.toastController.create({
            color: 'danger',
            message: 'Failed to copy text!',
            duration: 2000,
          });
        }

        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${message}`;
        break;

      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${message}`;
        break;

      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${message}`;
        break;

      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }

    await this.popoverController.dismiss();
  }

  getRentingListingItems() {
    this.http
      .get(`${environment.server}/renting/getUserRentingListings`)
      .subscribe((res) => {
        // console.log(res);
        this.userRentItems = res;
      });
  }

  getServicesListings() {
    this.http
      .get<{userListings:[]}>(`${environment.server}/services/getUserListings`)
      .subscribe((res) => {
        // console.log(res);
        this.userServicesListings = res.userListings;
      },err=>{
        console.log(err.error)
      });
  }

  ionViewWillEnter() {
    this.getRentingListingItems();
    this.getServicesListings();
  }

     // Method to calculate the discounted price
     calculateDiscountedPrice(price: string, discountPercentage: string): number {
      const originalPrice = parseFloat(price);
      const discount = parseFloat(discountPercentage);
      const discountAmount = (discount / 100) * originalPrice;
      const discountedPrice = originalPrice - discountAmount;
      return discountedPrice;
    }

  handleRefresh(event: any) {
    // do some work to refresh the content here
    // ...

    // let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    // refreshertext.style.color = "#000"

    location.reload();

    // when the refresh is complete, call the complete() method
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }
}
