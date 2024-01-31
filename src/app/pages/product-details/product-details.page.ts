import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { getProduct } from 'src/app/store/product/product.actions';
import { AppState } from 'src/app/types/AppState';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CommentModalComponent } from 'src/app/components/comment-modal/comment-modal.component';
import { OrderModalComponent } from 'src/app/components/order-modal/order-modal.component';
import { UserprofileService } from 'src/app/services/userprofile/userprofile.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subscription, firstValueFrom, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  SaveditemsService,
  SaveItem,
} from 'src/app/services/saveditems.service';
import { Meta, Title } from '@angular/platform-browser';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage {
  // Page Subscribtions
  private subscriptions: Subscription[] = [];
  isLoggedIn = false;

  product: any = {};

  selectedMainImage!: string;

  otherImages: any = [];

  isLiked = false;

  isFollowing = false;

  likes = 0;

  currentUserId!: number;

  navigateBack() {
    this.navCtrl.back();
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
        },
      ],
    });

    await alert.present();
  }

  async handleCall(phoneNumber: any) {
    if (!this.currentUserId) {
      this.presentLoginAlert();

      return;
    }

    if (phoneNumber) {
      let phoneNumberStr = phoneNumber.toString().replace(/\D/g, ''); // Remove non-numeric characters

      if (phoneNumberStr.length === 9 && !phoneNumberStr.startsWith('0')) {
        phoneNumberStr = '0' + phoneNumberStr; // Add '0' to the beginning
      }

      const alert = await this.alertCtrl.create({
        header: 'Safety Guidelines',
        message: `<ul>
        <li>Please be cautious and avoid making any upfront payments.</li>
        <li>Always arrange meetings with the seller in safe, public locations.</li>
        <li>Examine the items to ensure they meet your requirements.</li>
        <li>Pay if you're satisfied with what seller presents to you.</li>
        </ul>
       `,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Call',
            handler: () => {
              window.location.href = `tel:${phoneNumberStr}`;
              // log call
              // get product id and user id
              const callDetails = {
                productId: this.product.id,
                sellerId: this.product.id,
              };

              this.http
                .post(`${environment.server}/callback/call`, callDetails)
                .subscribe((res) => {});
            },
          },
        ],
      });

      await alert.present();
    } else {
      this.toastController
        .create({
          message: 'Sorry, seller contact not available',
          duration: 1000,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => {
          toast.present();
        });
    }
  }

  async handleRequestCallback() {
    if (!this.currentUserId) {
      this.presentLoginAlert();

      return;
    }
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

            requestData = {
              listingId: this.product.id,
              userRequestingName: data.name,
              userRequestingPhone: data.phoneNumber,
            };

            this.http
              .post<{ msg: string }>(
                `${environment.server}/callback/requestCallback`,
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

  // Method to calculate the discounted price
  calculateDiscountedPrice(price: string, discountPercentage: string): number {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercentage);
    const discountAmount = (discount / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  toggleLike() {
    // this.store.dispatch(startLoading());

    if (!this.isLiked) {
      this.isLiked = true;
      this.likes = this.likes + 1;
      let likeEffect = document.getElementById('likeEffect') as HTMLElement;

      likeEffect.classList.remove('d-none');
      likeEffect.classList.add('d-flex');

      setTimeout(() => {
        likeEffect.classList.remove('d-flex');
        likeEffect.classList.add('d-none');
      }, 1000);
    } else {
      this.isLiked = false;
      this.likes = this.likes - 1;
    }

    this.http
      .put<{ status: number; message: string }>(
        `${environment.server}/products/like/${this.productId}`,
        null
      )
      .pipe(take(1))
      .subscribe(
        (res) => {
          // this.store.dispatch(endLoading());

          if (res.status == 1) {
            // let likeEffect = document.getElementById(
            //   'likeEffect'
            // ) as HTMLElement;
            // likeEffect.classList.remove('d-none');
            // likeEffect.classList.add('d-flex');
            // setTimeout(() => {
            //   likeEffect.classList.remove('d-flex');
            //   likeEffect.classList.add('d-none');
            //   this.toastController
            //     .create({
            //       message: res.message,
            //       duration: 1000,
            //       color: 'primary',
            //       position: 'top',
            //     })
            //     .then((toast) => {
            //       toast.present();
            //     });
            // }, 1000);
          } else {
            this.toastController
              .create({
                message: res.message,
                duration: 1000,
                color: 'primary',
                position: 'top',
              })
              .then((toast) => {
                toast.present();
              });
          }

          // this.store.dispatch(
          //   getProduct({ productID: Number(this.productId) })
          // );
        },
        (err) => {
          // this.store.dispatch(endLoading());

          err.error.message &&
            this.toastController
              .create({
                message:
                  err.error.message == 'No authorization header'
                    ? 'Please log in to like product'
                    : err.error.message,
                duration: 1000,
                color: 'danger',
                position: 'top',
              })
              .then((toast) => {
                toast.present();
              });

          !err.error.message &&
            this.toastController
              .create({
                message: 'Sorry! unable to like product. Try again.',
                duration: 1000,
                color: 'danger',
                position: 'top',
              })
              .then((toast) => {
                toast.present();
              });
        }
      );
  }

  quantityCount: number = 1;

  increaseQuantity() {
    if (this.quantityCount >= this.product.quantity) {
      this.quantityCount = this.quantityCount;

      this.toastController
        .create({
          message: 'You have reached the maximum quantity of this product.',
          duration: 1500,
          color: 'dark',
          position: 'bottom',
        })
        .then((toast) => {
          toast.present();
        });

      return;
    }
    this.quantityCount++;
  }

  decreaseQuantity() {
    if (this.quantityCount >= 2) {
      this.quantityCount--;
    } else {
      this.quantityCount = 1;

      this.toastController
        .create({
          message: 'You have reached the minimum order of this product.',
          duration: 1500,
          color: 'dark',
          position: 'bottom',
        })
        .then((toast) => {
          toast.present();
        });
    }
  }

  changeMainImage(image: any) {
    this.selectedMainImage = image.url;
  }

  scrollUp() {
    let imagesCol = document.querySelector('.products-thumb') as HTMLElement;
    imagesCol.scrollBy({
      top: -20,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollDown() {
    let imagesCol = document.querySelector('.products-thumb') as HTMLElement;
    imagesCol.scrollBy({
      top: 20,
      left: 0,
      behavior: 'smooth',
    });
  }

  relatedProducts: any = [];
  productId: number | undefined;
  similarProducts: any = [];

  getSimilarProducts() {
    let subcategoryId = this.product.subcategory_id;
    let productId = this.product.id;
    this.http
      .get(
        `${environment.server}/products/similarProducts/${subcategoryId}/${productId}`
      )
      .subscribe(
        (res) => {
          // console.log(res)
          this.similarProducts = res;
        },
        (err) => {
          console.log(err);
        }
      );
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

  slidesPerView = 1.5;

  checkScreen() {
    let innerWidth = window.innerWidth;
    switch (true) {
      case 340 <= innerWidth && innerWidth <= 400:
        this.slidesPerView = 1.5;
        break;
      case 401 <= innerWidth && innerWidth <= 700:
        this.slidesPerView = 1.6;
        break;
      case 701 <= innerWidth && innerWidth <= 900:
        this.slidesPerView = 3.2;
        break;
      case 901 <= innerWidth && innerWidth <= 1000:
        this.slidesPerView = 4.5;
        break;
      case 1001 <= innerWidth:
        this.slidesPerView = 5.5;
        break;
    }
  }

  @ViewChild(IonContent)
  content!: IonContent;

  scrollToTop() {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the top instead of instantly
    this.content.scrollToTop(500);
  }

  constructor(
    private store: Store<AppState>,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private socialSharing: SocialSharing,
    private modalCtrl: ModalController,
    private userProfile: UserprofileService,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private authService: AuthService,
    private saveItemService: SaveditemsService,
    private titleService: Title,
    private metaService: Meta,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private dataSharingService: DataSharingService,
    private alertController: AlertController
  ) {}

  saveItemForLater() {
    let selectedItem: SaveItem = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.discount_percent
        ? this.calculateDiscountedPrice(
            this.product.price,
            this.product.discount_percent
          )
        : this.product.price,
      quantity: this.quantityCount,
      sellerId: this.product.user.id,
      seller: this.product.user.username,
      image: this.product.image.url,
    };

    this.saveItemService.addSavedItem(selectedItem);
  }

  async presentCommentModal() {
    if (!this.isLoggedIn) {
      this.toastController
        .create({
          message: 'Please Login to continue...',
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => {
          toast.present();
        });

      return;
    }

    const modal = await this.modalCtrl.create({
      component: CommentModalComponent,
      showBackdrop: true,
      initialBreakpoint: 0.4,
      breakpoints: [0.4, 0.45, 0.5, 0.6],
      componentProps: { productId: this.productId },
    });
    return await modal.present();
  }

  selectedItem: any;

  async presentOrderModal() {
    if (!this.isLoggedIn) {
      this.toastController
        .create({
          message: 'Please Login to continue...',
          duration: 3000,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => {
          toast.present();
        });

      return;
    }

    this.selectedItem = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.discount_price
        ? this.product.discount_price
        : this.product.price,
      quantity: this.quantityCount,
      sellerId: this.product.user.id,
    };

    const modal = await this.modalCtrl.create({
      component: OrderModalComponent,
      showBackdrop: true,
      initialBreakpoint: 1,
      componentProps: {
        selectedItem: this.selectedItem,
      },
    });
    return await modal.present();
  }

  chatSellerMessageContent: string = '';

  chatSeller() {

    if (!this.currentUserId) {
      this.presentLoginAlert();

      return;
    }

    if (!this.chatSellerMessageContent) {
      this.toastController
        .create({
          message: 'Please type a message to send to seller...',
          duration: 1500,
          color: 'danger',
          position: 'bottom',
        })
        .then((toast) => {
          toast.present();
        });

      return;
    }

    const link = `${window.location.href}`;

    const productInfo = `*${this.product.name} - GH₵ ${this.product.price} ${
      this.product.discount_percent > 0
        ? '- ' + this.product.discount_percent + '% discount'
        : ''
    } on niilano marketplace.*%0A${link}%0A%0A`;

    // Check if WhatsApp contact exists
    let whatsappNumber = this.product.whatsappContact;

    // If WhatsApp contact doesn't exist, check seller contact
    if (!whatsappNumber) {
      whatsappNumber = this.product.sellerContact;
    }

    // If neither WhatsApp nor seller contact exists, fallback to profile contact
    if (!whatsappNumber) {
      whatsappNumber = this.product.user?.phone_number;
    }

    if (!whatsappNumber) {
      this.toastController
        .create({
          message: 'Sorry, this sellers contact is unknown.',
          duration: 1500,
          color: 'danger',
          position: 'bottom',
        })
        .then((toast) => {
          toast.present();
        });

      return;
    }

    if (whatsappNumber) {
      // Check if the number starts with "+233" or "233" already
      if (
        !whatsappNumber.startsWith('+233') &&
        !whatsappNumber.startsWith('233')
      ) {
        // If it doesn't, add the country code
        whatsappNumber = `+233${whatsappNumber}`;
      }
    }

    const encodedMessage = `${productInfo} ${this.chatSellerMessageContent}`;
    const whatsappLink = `whatsapp://send?phone=${`${whatsappNumber}`}&text=${encodedMessage}`;

    // log message
    // get product id and user id
    const messageDetails = {
      productId: this.product.id,
      sellerId: this.product.id,
      to: this.product.id,
      content : this.chatSellerMessageContent
    };

    this.http
      .post(`${environment.server}/messaging/send`, messageDetails)
      .subscribe((res) => {});

    // Open the link
    window.open(whatsappLink, '_blank');

  }

  ionViewDidEnter() {
    this.store.select('checkLogin').subscribe((res) => {
      this.isLoggedIn = res.loggedIn;
    });

    this.subscriptions.push(
      this.activeRoute.queryParams.subscribe(async (params) => {
        if (!params['product']) {
          this.toastController
            .create({
              message: 'Your product does not have an id',
              duration: 3000,
              header: 'Product Error',
              color: 'danger',
              position: 'bottom',
            })
            .then((toast) => {
              toast.present();
              toast.onDidDismiss().then(() => {
                this.router.navigate(['products']);
              });
            });
        } else {
          this.productId = params['product'];
          this.store.dispatch(
            getProduct({ productID: Number(this.productId), details: 'true' })
          );
        }
      })
    );

    this.subscriptions.push(
      this.store.select('product').subscribe(async (prod) => {
        if (prod.process) {
          this.store.dispatch(startLoading());
        }
        if (prod.success) {
          this.store.dispatch(endLoading());

          this.scrollToTop();

          this.product = JSON.parse(JSON.stringify(prod.product));

          let viewEventData: any = {
            product_id: '',
            device: {},
            location: {},
            seller_id: '',
            category_id: '',
            subcategory_id: '',
          };

          viewEventData.product_id = this.productId;
          viewEventData.seller_id = this.product.user.id;
          viewEventData.category_id = this.product.category_id;
          viewEventData.subcategory_id = this.product.subcategory_id;

          try {
            // console.log(viewEventData)
            // Wait for viewEventActions to complete
            await this.viewEventActions(viewEventData);

            // Now the viewEventData has been initialized, and you can make the HTTP request
            this.http
              .post(
                `${environment.server}/products/logClickEvent`,
                viewEventData
              )
              .subscribe(
                (res) => {
                  //  console.log(res);
                },
                (err) => {
                  console.log(err);
                }
              );
          } catch (error) {
            console.error('Error:', error);
          }

          // Filter following and followers arrays to remove objects with status = 'inactive'
          this.product.user.following = this.product.user.following.filter(
            (obj: any) => obj.status !== 'inactive'
          );
          this.product.user.followers = this.product.user.followers.filter(
            (obj: any) => obj.status !== 'inactive'
          );

          this.selectedMainImage = this.product.image.url;

          this.otherImages = [this.product.image, ...this.product.images];

          this.likes = this.product.Likes.length;

          this.relatedProducts = this.product.user.products;

          // console.log(this.product)
          this.getSimilarProducts();

          this.titleService.setTitle(
            `${this.product.name} - GH₵${this.product.price}`
          );

          this.metaService.updateTag({
            property: 'og:title',
            content: `${this.product.name} - GH₵${this.product.price}`,
          });
          this.metaService.updateTag({
            name: 'twitter:title',
            content: `${this.product.name} - GH₵${this.product.price}`,
          });
          this.metaService.updateTag({
            property: 'og:description',
            content: this.product.description,
          });
          this.metaService.updateTag({
            name: 'twitter:description',
            content: this.product.description,
          });
          this.metaService.updateTag({
            property: 'og:image',
            content: this.product.image.url,
          });
          this.metaService.updateTag({
            name: 'twitter:image',
            content: this.product.image.url,
          });

          this.userProfile.myProfile().subscribe(
            async (res) => {
              this.currentUserId = await res.profile.id;
              // console.log(this.currentUserId)
              this.isLiked = this.product.Likes.some(
                (like: { user_id: number }) =>
                  like.user_id === this.currentUserId
              );
              this.isFollowing = this.product.user.followers.some(
                (follower: { followerId: number; status: string }) =>
                  follower.followerId === this.currentUserId &&
                  follower.status === 'active'
              );
              // console.log(this.isFollowing)
            },
            (err) => {
              console.log(err);
            }
          );
        }
        if (prod.failure) {
          this.store.dispatch(endLoading());
          console.log(prod.message);

          this.toastController
            .create({
              message: prod.message,
              duration: 3000,
              header: 'Product Error',
              color: 'danger',
              position: 'bottom',
            })
            .then((toast) => {
              toast.present();
              toast.onDidDismiss().then(() => {
                this.router.navigate(['products']);
              });
            });
        }
      })
    );

    // console.log(this.productId)

    setTimeout(() => {
      this.checkScreen();
    }, 500);

    this.subscriptions.push(
      this.platform.resize.subscribe(async () => {
        this.checkScreen();
      })
    );
  }

  ionViewDidLeave() {
    this.chatSellerMessageContent = '';

    // Unsubscribe from subscriptions
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  async viewEventActions(viewEventData: any): Promise<void> {
    try {
      // Assuming that getUserLocation returns an observable
      const location = await firstValueFrom(
        this.dataSharingService.getUserLocation()
      );
      viewEventData.location = location;

      if (this.platform.is('cordova')) {
        // App
        const ios = this.platform.is('ios');
        if (ios) {
          viewEventData.device = { type: 'iPhone', device: 'mobile' };
        } else {
          viewEventData.device = { type: 'Android', device: 'mobile' };
        }
      } else {
        // Probably Browser
        if (isMobile()) {
          if (navigator.userAgent.includes('iPhone')) {
            viewEventData.device = { type: 'iPhone', device: 'mobile' };
          } else if (navigator.userAgent.includes('Android')) {
            viewEventData.device = { type: 'Android', device: 'mobile' };
          } else {
            viewEventData.device = { type: 'Unknown', device: 'mobile' };
          }
        } else {
          if (navigator.userAgent.includes('Windows')) {
            viewEventData.device = { type: 'Windows', device: 'desktop' };
          } else {
            viewEventData.device = { type: 'Unknown', device: 'desktop' };
          }
        }
      }
    } catch (error) {
      console.error('Error in viewEventActions:', error);
      // throw error; // Rethrow the error to be caught by the caller
      if (this.platform.is('cordova')) {
        // App
        const ios = this.platform.is('ios');
        if (ios) {
          viewEventData.device = { type: 'iPhone', device: 'mobile' };
        } else {
          viewEventData.device = { type: 'Android', device: 'mobile' };
        }
      } else {
        // Probably Browser
        if (isMobile()) {
          if (navigator.userAgent.includes('iPhone')) {
            viewEventData.device = { type: 'iPhone', device: 'mobile' };
          } else if (navigator.userAgent.includes('Android')) {
            viewEventData.device = { type: 'Android', device: 'mobile' };
          } else {
            viewEventData.device = { type: 'Unknown', device: 'mobile' };
          }
        } else {
          if (navigator.userAgent.includes('Windows')) {
            viewEventData.device = { type: 'Windows', device: 'desktop' };
          } else {
            viewEventData.device = { type: 'Unknown', device: 'desktop' };
          }
        }
      }
    }

    function isMobile() {
      const regex =
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return regex.test(navigator.userAgent);
    }
  }

  async followUser() {
    if (!this.currentUserId) {
      const toast = await this.toastController.create({
        message: 'Please login to follow this user',
        duration: 1500,
        color: 'danger',
        position: 'bottom',
        mode: 'ios',
      });

      await toast.present();

      return;
    }

    this.userProfile
      .follow(this.product.user.id)
      .pipe(take(1))
      .subscribe(
        async (res) => {
          this.store.dispatch(
            getProduct({ productID: Number(this.productId), details: 'true' })
          );

          const toast = await this.toastController.create({
            message: res.msg,
            duration: 1500,
            color: 'dark',
            position: 'bottom',
            mode: 'ios',
          });

          await toast.present();
        },
        async (err) => {
          console.log(err);

          const toast = await this.toastController.create({
            message: 'An error occured',
            duration: 1500,
            color: 'danger',
            position: 'bottom',
            mode: 'ios',
          });

          await toast.present();
        }
      );
  }

  async share(platform: string) {
    // Logic to share content on selected platform

    const link = `${window.location.href}`;

    let shareUrl: any;

    const encodedDescription = encodeURIComponent(this.product.description)

    const message = `Hey, check out this product:%0A%0A${
      this.product.name
    }%0A%0A*Description:* ${encodedDescription}%0A%0A*Price:* ${
      this.product.discount_percent ? '~GH₵' + this.product.price + '~' : ''
    } GH₵${
      !this.product.discount_percent
        ? this.product.price
        : this.calculateDiscountedPrice(this.product.price,
          this.product.discount_percent)
    }${
      this.product.discount_percent
        ? '%0A%0A*Discount:* ' + this.product.discount_percent + '%'
        : ''
    }%0A%0A%0A*Visit this link to order now:*%0A${link}`;

    console.log(message)

    // ${this.product.discount_percent ? 'GH₵' + this.product.price : ''}

    const messageTweet = `%0A${link}%0A%0ACheck out this product:%0A${
      this.product.name
    }%0APrice: GH₵${this.product.price}${
      this.product.discount_percent
        ? '%0ADiscount Price: GH₵' + this.calculateDiscountedPrice(this.product.price,
          this.product.discount_percent)
        : ''
    }${
      this.product.discount_percent
        ? '%0ADiscount: ' + this.product.discount_percent + '%25'
        : ''
    }%0ADescription: ${encodedDescription}`;

    switch (platform) {
      case 'copy':
        // copy the link to the clipboard using the browser API
        try {
          await navigator.clipboard.writeText(link);

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
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
        break;

      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${messageTweet}`;
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

    // await this.popoverController.dismiss();
  }

  handleRefresh(event: any) {
    // do some work to refresh the content here
    // ...

    //let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    //refreshertext.style.color = "#000"

    location.reload();

    // when the refresh is complete, call the complete() method
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }
}
