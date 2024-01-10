import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { regionData } from './regions';
import { categoriesData } from './categories';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/types/AppState';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { listProduct, listProductComplete } from 'src/app/store/listProduct/list.actions';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { getProduct } from 'src/app/store/product/product.actions';
import { editProduct, resetEditProductStateValues } from 'src/app/store/editProducts/editProductState.actions';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.page.html',
  styleUrls: ['./list-product.page.scss'],
})
export class ListProductPage implements OnInit, OnDestroy {
  // Declare an array to store subscriptions
  private subscriptions: Subscription[] = [];

  pageTitle = "Advertise your product"

  sectionTitle = 'Product Details';

  // This stores the current section and the total section
  currentSection = 1;
  totalSections = 4;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageUrl: any = '';
  ImageSection = '';

  cropImageModal = false;

  imageLoading = false;

  fileChangeEvent(event: any, section: string): void {
    this.imageLoading = true;
    this.imageChangedEvent = event;
    this.cropImageModal = true;
    this.ImageSection = section;
  }

  closeCropImageModal() {
    this.cropImageModal = false;
  }

  productInfo: any = {
    name: '',
    description: '',
    condition: '',
    features: [],
    price: '',
    negotiable: true,
    discount_percent: '',
    quantity: '',
    sellerContact: '',
    whatsappContact: '',
    productCategory: {},
    category_id: '',
    subcategory_id: '',
    subCategory_name: '',
    location: '',
    productMainImage: '',
    productMainImageURL: '',
    productOtherImages: [],
    productOtherImagesURL: [],
  };

  // This method is responsible for receiving the cropped image from the crop component
  croppedImageRes(ev: any) {
    if (this.ImageSection == 'mainImage') {
      this.productInfo.productMainImage = ev.blob;
      this.productInfo.productMainImageURL =
        this.sanitizer.bypassSecurityTrustUrl(ev.objectUrl as string);
      this.cropImageModal = false;
    } else if (this.ImageSection == 'addtionalImages') {
      this.productInfo.productOtherImages.push({ blob: ev.blob, url: this.sanitizer.bypassSecurityTrustUrl(ev.objectUrl as string) });
      // this.productInfo.productOtherImagesURL.push(
      //   this.sanitizer.bypassSecurityTrustUrl(ev.objectUrl as string)
      // );
      this.cropImageModal = false;
    }
  }

  removeOtherImages(index: number) {
    // Ensure that the index is within the bounds of the array
    if (index >= 0 && index < this.productInfo.productOtherImages.length) {
      let image = this.productInfo.productOtherImages[index];
      // Use splice to remove the element at the specified index
      this.productInfo.productOtherImages.splice(index, 1);
      image.public_id && this.productInfo.removedImagesPublicId.push(image.public_id)
    } else {
      console.error('Invalid index:', index);
    }
  }


  categories: any = []
  regions: any = [];

  navigateBack() {
    this.navCtrl.back();

    this.productInfo = {
      name: '',
      description: '',
      condition: '',
      features: [],
      price: '',
      negotiable: true,
      discount_percent: '',
      quantity: '',
      sellerContact: '',
      whatsappContact: '',
      productCategory: {},
      category_id: '',
      subcategory_id: '',
      subCategory_name: '',
      location: '',
      productMainImage: '',
      productMainImageURL: '',
      productOtherImages: [],
      productOtherImagesURL: [],
    }
  }

  async nextSection() {
    if (
      this.currentSection === 1 &&
      (!this.productInfo.name ||
        !this.productInfo.description ||
        !this.productInfo.condition)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return; // Stop execution if fields are not filled in
    } else if (
      this.currentSection === 2 &&
      (!this.productInfo.price ||
        !this.productInfo.sellerContact || !this.productInfo.whatsappContact)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return; // Stop execution if fields are not filled in
    } else if (
      this.currentSection === 3 &&
      (!this.productInfo.category_id || !this.productInfo.location)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return; // Stop execution if fields are not filled in
    }

    this.currentSection++;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Product Details';
        break;
      case 2:
        this.sectionTitle = 'Pricing & Discount';
        break;
      case 3:
        this.sectionTitle = 'Category & Location';
        break;
      case 4:
        this.sectionTitle = 'Product Images';
        break;

      default:
        break;
    }
  }

  prevSection() {
    this.currentSection--;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Product Details';
        break;
      case 2:
        this.sectionTitle = 'Pricing & Discount';
        break;
      case 3:
        this.sectionTitle = 'Category & Location';
        break;
      case 4:
        this.sectionTitle = 'Product Images';
        break;

      default:
        break;
    }
  }

  mainImage: any;

  onSelectMainImage(event: any) {
    const file = event.target.files[0];
    if (file.type.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.productInfo.productMainImage = {
        img: reader.result,
        file: file,
      };

      // console.log(this.productInfo.productMainImage)
    };
  }

  onSelectOtherImages(event: any) {
    const file = event.target.files[0];
    if (file.type.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.productInfo.productOtherImages.push({
        img: reader.result,
        file: file,
      });

      // console.log(this.productInfo.productMainImage)
    };
  }

  newFeature: string = '';

  // Function to add a new feature
  addFeature() {
    if (this.newFeature.trim() !== '') {
      this.productInfo.features.unshift(this.newFeature); // Add the new feature to the top of the list
      this.newFeature = ''; // Clear the input field
    }
  }

  // Function to remove a feature
  removeFeature(index: number) {
    this.productInfo.productFeatures.splice(index, 1);
  }

  // @ViewChild('categoryModal', { static: true }) categoryModal!: IonModal;
  categoryModal = false;

  toggleCategoryModal() {
    this.categoryModal = !this.categoryModal;
  }

  categorySelection(data: any) {
    this.productInfo.category_id = data.category_id;
    this.productInfo.subcategory_id = data.subcategory_id;
    this.productInfo.subCategory_name = data.subCategory_name;
    this.productInfo.productCategory = data;
    // console.log(this.productInfo.productCategory);
    // this.categoryModal.dismiss();
    this.categoryModal = false;
  }

  removeCategoryItem(itemId: number) {
    this.productInfo.productCategory.subCategory =
      this.productInfo.productCategory.subCategory.filter(
        (item: any) => item.id !== itemId
      );
  }

  // @ViewChild('locationModal', { static: true }) locationModal!: IonModal;

  locationModal = false;

  toggleLocationModal() {
    this.locationModal = !this.locationModal;
  }

  receiveLocationData(data: any) {
    this.productInfo.location = data;
    // console.log(this.productInfo.productLocation)
    this.locationModal = false;
  }

  submitProductListing() {
    // console.log(this.productInfo);

    if (!this.productInfo.productMainImage) {
      this.toastController.create({
        message: "Please select a main image before proceeding.",
        duration: 3000,
        header: "Error",
        color: 'danger',
        position: 'bottom',
      }).then((toast) => {
        toast.present()
      })

      return;
    }

    if (this.productInfo.productOtherImages.length < 1) {
      this.toastController.create({
        message: "Select at least one additional image",
        duration: 3000,
        header: "Error",
        color: 'danger',
        position: 'bottom',
      }).then((toast) => {
        toast.present()
      })

      return;
    }


    // Create a new FormData instance to store form data
    const formData = new FormData();

    // Define an array of keys to exclude from form data (if needed)
    const keysToExclude = ['productOtherImages'];

    if (!this.productInfo.discount_percent) {
      this.productInfo.discount_percent = 0;
    }

    // Loop through each property in the productInfo and append them to the FormData
    for (const key in this.productInfo) {
      // Check if the key is a property of the productInfo and not in the keysToExclude array
      if (
        this.productInfo.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        // Get the value associated with the current key
        const value = this.productInfo[key];

        if (
          Array.isArray(value) ||
          (typeof value === 'object' && !(value instanceof Blob))
        ) {
          // Serialize arrays and non-Blob objects to JSON and append to FormData
          formData.append(key, JSON.stringify(value));
        } else {
          // For other types, append the value as is to FormData
          formData.append(key, value);
        }
      }
    }

    this.productInfo.productOtherImages.forEach((element: any) => {
      element.blob && formData.append('productOtherImages', element.blob);
    });

    // Now the formData object contains all the properties from productInfo
    // with arrays and objects serialized to JSON when needed.

    this.store.dispatch(listProduct({ formData }))
  }

  submitEditProductListing() {
    console.log(this.productInfo)

    // Create a new FormData instance to store form data
    const formData = new FormData();

    // Define an array of keys to exclude from form data (if needed)
    const keysToExclude = ['productOtherImages'];

    if (!this.productInfo.discount_percent) {
      this.productInfo.discount_percent = 0;
    }

    // Loop through each property in the productInfo and append them to the FormData
    for (const key in this.productInfo) {
      // Check if the key is a property of the productInfo and not in the keysToExclude array
      if (
        this.productInfo.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        // Get the value associated with the current key
        const value = this.productInfo[key];

        if (
          Array.isArray(value) ||
          (typeof value === 'object' && !(value instanceof Blob))
        ) {
          // Serialize arrays and non-Blob objects to JSON and append to FormData
          formData.append(key, JSON.stringify(value));
        } else {
          // For other types, append the value as is to FormData
          formData.append(key, value);
        }
      }
    }

    this.productInfo.productOtherImages.forEach((element: any) => {
      element.blob && formData.append('productOtherImages', element.blob);
    });

    this.store.dispatch(editProduct({ formData }))
  }

  ionViewDidEnter() {
    this.subscriptions.push(
      this.store.select('addProduct')
        .subscribe(
          res => {

            if (res.process) {
              this.store.dispatch(startLoading())
            }

            if (res.success) {
              this.store.dispatch(endLoading())
              // this.store.dispatch(getUserProducts())
              // this.store.dispatch(getProducts({page:1}))
              const routePath = '/product-details';
              const queryParams = { product: res.productID };
              // Use NavigationExtras to set replaceUrl option to true
              const navigationExtras: NavigationExtras = {
                queryParams,
                replaceUrl: true,
              };

              this.store.dispatch(listProductComplete())
              // this.router.navigate([routePath], { queryParams });
              this.router.navigate([routePath, queryParams], navigationExtras);

              this.toastController.create({
                message: res.message,
                duration: 3000,
                header: "Product Listed",
                color: 'primary',
                position: 'bottom',
              }).then((toast) => {
                toast.present()
              })

            }

            if (res.failure) {
              this.store.dispatch(endLoading())

              this.toastController.create({
                message: res.message,
                duration: 3000,
                header: "Product Listing Error",
                color: 'danger',
                position: 'bottom',
              }).then((toast) => {
                toast.present()
              })

            }

          }
        ))

    this.subscriptions.push(
      this.store.select('editProduct')
        .subscribe(
          res => {

            if (res.process) {
              this.store.dispatch(startLoading())
            }

            if (res.success) {
              this.store.dispatch(endLoading())

              this.router.navigate(['my-products']);

              // Notify the parent component that editing is completed
              this.dataSharingService.setEditCompleted(true);

              this.store.dispatch(resetEditProductStateValues())

              this.productInfo = {
                name: '',
                description: '',
                condition: '',
                features: [],
                price: '',
                negotiable: true,
                discount_percent: '',
                quantity: '',
                sellerContact: '',
                whatsappContact: '',
                productCategory: {},
                category_id: '',
                subcategory_id: '',
                subCategory_name: '',
                location: '',
                productMainImage: '',
                productMainImageURL: '',
                productOtherImages: [],
                productOtherImagesURL: [],
              }

              this.toastController.create({
                message: res.message,
                duration: 3000,
                header: "Product Updated",
                color: 'primary',
                position: 'bottom',
              }).then((toast) => {
                toast.present()
              })

            }

            if (res.failure) {
              this.store.dispatch(endLoading())

              this.toastController.create({
                message: res.message,
                duration: 3000,
                header: "Product Update Error",
                color: 'danger',
                position: 'bottom',
              }).then((toast) => {
                toast.present()
              })

            }

          }
        )
    )

  }
  ionViewWillLeave() {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

  }

  constructor(
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private navCtrl: NavController,
    private activeRouted: ActivatedRoute,
    private dataSharingService: DataSharingService
  ) { }

  editProduct = false
  editProductId!: any;

  ngOnInit() {
    this.regions = regionData;
    this.categories = categoriesData;

    this.subscriptions.push(
      this.activeRouted.queryParams.subscribe((params) => {
        if (params['product']) {
          this.pageTitle = "Make Changes"
          this.editProductId = params['product'];
          this.store.dispatch(getProduct({ productID: Number(this.editProductId), details: 'false' }));
          this.editProduct = true
        } else {
          this.editProductId = ''
          this.editProduct = false
        }
      })
    )

    this.subscriptions.push(
      this.store.select('product').subscribe(
        (prod: any) => {
          if (prod.process) {
            this.store.dispatch(startLoading());
          }
          if (prod.success && this.editProduct) {
            this.store.dispatch(endLoading());

            // this.product = JSON.parse(JSON.stringify(prod.product));
            this.productInfo = JSON.parse(JSON.stringify(prod.product))

            this.productInfo.productCategory = {
              category_id: this.productInfo.category_id,
              subcategory_id: this.productInfo.subcategory_id
            }
            this.productInfo.subCategory_name = this.categories.find((cat: any) => cat.id == this.productInfo.category_id).Subcategories.find((sub: any) => sub.id == this.productInfo.subcategory_id).name
            this.productInfo.productOtherImages = this.productInfo.images
            this.productInfo.productMainImageURL = this.productInfo.image.url
            this.productInfo.removedImagesPublicId = []
            // this.productInfo.productOtherImagesURL = this.productInfo.images.map((img: any) => img.url)
            this.productInfo.productId = this.editProductId
            // console.log(this.productInfo)
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
        }
      ))
  }

  ngOnDestroy() {
    // console.log('bye bye')
  }
}
