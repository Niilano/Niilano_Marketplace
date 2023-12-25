import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-house-listing',
  templateUrl: './house-listing.component.html',
  styleUrls: ['./house-listing.component.scss'],
})
export class HouseListingComponent implements OnInit {
  // House Retning Form inputs ngModels

  @Input() houseDetailsFormModal: any = {
    placeType: '',
    isStoreyBuilding: '',
    tenantPlaceType: '',
    houseRegionLocation: '',
    houseLocation: '',
    bedRoomNo: '',
    bathRoomsNo: '',
    bathroomLocation: '',
    isSecurityAvailable: '',
    isCarParkAvailable: '',
    isFurnishedAlready: '',
    amenitiesAvailable: '',
    houseDescription: '',
    pricePerMonth: '',
    discountPercentage: '',
    mobile: '',
    compoundImage: '',
    compoundImagePreview: '',
    infrontImage: '',
    infrontImagePreview: '',
    bedroomImage: '',
    bedroomImagePreview: '',
    washroomImage: '',
    washroomImagePreview: '',
    additionalImage: '',
    additionalImagePreview: '',
  };

  @Input() editingListing = false;

  currentSection = 1;

  totalSections = 6;

  sectionTitle = 'Property Type';

  // All sessions included

  removedImages: any = [];

  async uploadCompoundImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (this.houseDetailsFormModal.compoundImage.imageUrl) {
        this.removedImages.push(
          this.houseDetailsFormModal.compoundImage.publicId
        );
      }

      this.houseDetailsFormModal.compoundImage = file;

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.houseDetailsFormModal.compoundImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadInfrontImage(event: any) {
    // Handle infront image upload and preview in a similar way
    const file = event.target.files[0];
    if (file) {
      if (this.houseDetailsFormModal.infrontImage.imageUrl) {
        this.removedImages.push(
          this.houseDetailsFormModal.infrontImage.publicId
        );
      }

      this.houseDetailsFormModal.infrontImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.houseDetailsFormModal.infrontImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadBedroomImage(event: any) {
    // Handle bedroom image upload and preview in a similar way
    const file = event.target.files[0];
    if (file) {
      if (this.houseDetailsFormModal.bedroomImage.imageUrl) {
        this.removedImages.push(
          this.houseDetailsFormModal.bedroomImage.publicId
        );
      }

      this.houseDetailsFormModal.bedroomImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.houseDetailsFormModal.bedroomImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadWashroomImage(event: any) {
    // Handle bedroom image upload and preview in a similar way
    const file = event.target.files[0];
    if (file) {
      if (this.houseDetailsFormModal.washroomImage.imageUrl) {
        this.removedImages.push(
          this.houseDetailsFormModal.washroomImage.publicId
        );
      }

      this.houseDetailsFormModal.washroomImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.houseDetailsFormModal.washroomImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadAdditionalImage(event: any) {
    // Handle bedroom image upload and preview in a similar way
    const file = event.target.files[0];
    if (file) {
      if (this.houseDetailsFormModal.additionalImage.imageUrl) {
        this.removedImages.push(
          this.houseDetailsFormModal.additionalImage.publicId
        );
      }

      this.houseDetailsFormModal.additionalImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.houseDetailsFormModal.additionalImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // method to move to next sections
  async nextSection() {
    if (
      this.currentSection === 1 &&
      (!this.houseDetailsFormModal.placeType ||
        !this.houseDetailsFormModal.isStoreyBuilding)
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
      (!this.houseDetailsFormModal.tenantPlaceType ||
        !this.houseDetailsFormModal.houseRegionLocation ||
        !this.houseDetailsFormModal.houseLocation)
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
      (!this.houseDetailsFormModal.bedRoomNo ||
        !this.houseDetailsFormModal.bathRoomsNo ||
        !this.houseDetailsFormModal.bathroomLocation ||
        !this.houseDetailsFormModal.isSecurityAvailable ||
        !this.houseDetailsFormModal.isCarParkAvailable ||
        !this.houseDetailsFormModal.isFurnishedAlready)
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
      this.currentSection === 4 &&
      !this.houseDetailsFormModal.houseDescription
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
      this.currentSection === 5 &&
      (!this.houseDetailsFormModal.pricePerMonth ||
        !this.houseDetailsFormModal.mobile)
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

    // Proceed to the next section
    this.currentSection++;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Property Type';
        break;
      case 2:
        this.sectionTitle = 'Guest Accommodation';
        break;
      case 3:
        this.sectionTitle = 'Property Details';
        break;
      case 4:
        this.sectionTitle = 'Additional Details';
        break;
      case 5:
        this.sectionTitle = 'Pricing & Discounts';
        break;
      case 6:
        this.sectionTitle = 'Images';
        break;

      default:
        break;
    }
  }

  prevSection() {
    this.currentSection--;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Property Type';
        break;
      case 2:
        this.sectionTitle = 'Guest Accommodation';
        break;
      case 3:
        this.sectionTitle = 'Property Details';
        break;
      case 4:
        this.sectionTitle = 'Additional Details';
        break;
      case 5:
        this.sectionTitle = 'Pricing & Discounts';
        break;
      case 6:
        this.sectionTitle = 'Images';
        break;

      default:
        break;
    }
  }

  async submitHouseDetailsForm() {
    // Checking if all required fields are filled, except for the optional additionalImage,discount and amenities
    if (
      !this.houseDetailsFormModal.placeType ||
      !this.houseDetailsFormModal.isStoreyBuilding ||
      !this.houseDetailsFormModal.tenantPlaceType ||
      !this.houseDetailsFormModal.houseRegionLocation ||
      !this.houseDetailsFormModal.houseLocation ||
      !this.houseDetailsFormModal.bedRoomNo ||
      !this.houseDetailsFormModal.bathRoomsNo ||
      !this.houseDetailsFormModal.bathroomLocation ||
      !this.houseDetailsFormModal.isSecurityAvailable ||
      !this.houseDetailsFormModal.isCarParkAvailable ||
      !this.houseDetailsFormModal.isFurnishedAlready ||
      !this.houseDetailsFormModal.houseDescription ||
      !this.houseDetailsFormModal.pricePerMonth ||
      !this.houseDetailsFormModal.mobile ||
      !this.houseDetailsFormModal.compoundImage ||
      !this.houseDetailsFormModal.infrontImage ||
      !this.houseDetailsFormModal.bedroomImage ||
      !this.houseDetailsFormModal.washroomImage
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    }

    this.closeModal();

    this.store.dispatch(startLoading());

    const formData = new FormData();
    formData.append('placeType', this.houseDetailsFormModal.placeType);
    formData.append(
      'isStoreyBuilding',
      this.houseDetailsFormModal.isStoreyBuilding
    );
    formData.append(
      'tenantPlaceType',
      this.houseDetailsFormModal.tenantPlaceType
    );
    formData.append(
      'houseRegionLocation',
      this.houseDetailsFormModal.houseRegionLocation
    );
    formData.append('houseLocation', this.houseDetailsFormModal.houseLocation);
    formData.append('bedRoomNo', this.houseDetailsFormModal.bedRoomNo);
    formData.append('bathRoomsNo', this.houseDetailsFormModal.bathRoomsNo);
    formData.append(
      'bathroomLocation',
      this.houseDetailsFormModal.bathroomLocation
    );
    formData.append(
      'isSecurityAvailable',
      this.houseDetailsFormModal.isSecurityAvailable
    );
    formData.append(
      'isCarParkAvailable',
      this.houseDetailsFormModal.isCarParkAvailable
    );
    formData.append(
      'isFurnishedAlready',
      this.houseDetailsFormModal.isFurnishedAlready
    );
    formData.append(
      'amenitiesAvailable',
      JSON.stringify(this.houseDetailsFormModal.amenitiesAvailable)
    );
    formData.append(
      'houseDescription',
      this.houseDetailsFormModal.houseDescription
    );
    formData.append('pricePerMonth', this.houseDetailsFormModal.pricePerMonth);
    formData.append(
      'discountPercentage',
      this.houseDetailsFormModal.discountPercentage
    );

    formData.append('mobile', this.houseDetailsFormModal.mobile);

    formData.append('compoundImage', this.houseDetailsFormModal.compoundImage);
    formData.append('infrontImage', this.houseDetailsFormModal.infrontImage);
    formData.append('bedroomImage', this.houseDetailsFormModal.bedroomImage);
    formData.append('washroomImage', this.houseDetailsFormModal.washroomImage);
    formData.append(
      'additionalImage',
      this.houseDetailsFormModal.additionalImage
    );

    this.http
      .post<{ message: string; id: number }>(
        `${environment.server}/renting/listhouse`,
        formData
      )
      .subscribe(
        async (res) => {
          const routePath = '/rent-items-details';
          const queryParams = { item: 'house', id: res.id };
          this.router.navigate([routePath], { queryParams });

          const toast = await this.toastController.create({
            message: res.message,
            duration: 2000,
            position: 'bottom',
            color: 'primary',
          });
          toast.present();

          this.store.dispatch(endLoading());
        },
        async (err) => {
          console.log(err);
          this.store.dispatch(endLoading());
          const toast = await this.toastController.create({
            message: err.error.message ? err.error.message : 'Error',
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          toast.present();
        }
      );
  }

  @Output() editCompleted: EventEmitter<void> = new EventEmitter<void>();

  submitEditListing() {
    this.closeModal();

    this.store.dispatch(startLoading());

    const formData = new FormData();
    formData.append('id', this.houseDetailsFormModal.id);
    formData.append('placeType', this.houseDetailsFormModal.placeType);
    formData.append(
      'isStoreyBuilding',
      this.houseDetailsFormModal.isStoreyBuilding
    );
    formData.append(
      'tenantPlaceType',
      this.houseDetailsFormModal.tenantPlaceType
    );
    formData.append(
      'houseRegionLocation',
      this.houseDetailsFormModal.houseRegionLocation
    );
    formData.append('houseLocation', this.houseDetailsFormModal.houseLocation);
    formData.append('bedRoomNo', this.houseDetailsFormModal.bedRoomNo);
    formData.append('bathRoomsNo', this.houseDetailsFormModal.bathRoomsNo);
    formData.append(
      'bathroomLocation',
      this.houseDetailsFormModal.bathroomLocation
    );
    formData.append(
      'isSecurityAvailable',
      this.houseDetailsFormModal.isSecurityAvailable
    );
    formData.append(
      'isCarParkAvailable',
      this.houseDetailsFormModal.isCarParkAvailable
    );
    formData.append(
      'isFurnishedAlready',
      this.houseDetailsFormModal.isFurnishedAlready
    );
    formData.append(
      'amenitiesAvailable',
      JSON.stringify(this.houseDetailsFormModal.amenitiesAvailable)
    );
    formData.append(
      'houseDescription',
      this.houseDetailsFormModal.houseDescription
    );
    formData.append('pricePerMonth', this.houseDetailsFormModal.pricePerMonth);
    formData.append(
      'discountPercentage',
      this.houseDetailsFormModal.discountPercentage
    );

    formData.append('mobile', this.houseDetailsFormModal.mobile);

    formData.append('compoundImage', this.houseDetailsFormModal.compoundImage);
    formData.append('infrontImage', this.houseDetailsFormModal.infrontImage);
    formData.append('bedroomImage', this.houseDetailsFormModal.bedroomImage);
    formData.append('washroomImage', this.houseDetailsFormModal.washroomImage);
    formData.append(
      'additionalImage',
      this.houseDetailsFormModal.additionalImage
    );

    this.http
      .put<{ message: string }>(
        `${environment.server}/renting/edithouse`,
        formData
      )
      .subscribe(
        async (res) => {
          // const routePath = '/rent-items-details';
          // const queryParams = { item: 'house', id: res.id };
          // this.router.navigate([routePath], { queryParams });

          // localStorage.setItem('updateUserRentItems', 'true');

          // Notify the parent component that editing is completed
          this.dataSharingService.setEditCompleted(true);

          const toast = await this.toastController.create({
            message: res.message,
            duration: 2000,
            position: 'bottom',
            color: 'primary',
          });
          toast.present();

          this.store.dispatch(endLoading());
        },
        async (err) => {
          // console.log(err);
          this.store.dispatch(endLoading());
          const toast = await this.toastController.create({
            message: err.error.message ? err.error.message : 'Error',
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          toast.present();
        }
      );
  }

  closeModal(updateUserRentItems = false) {
    this.modalController.dismiss(updateUserRentItems);
  }

  isIOSDevice:any

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router,
    private dataSharingService: DataSharingService,
    private platform: Platform
  ) {
    this.isIOSDevice = this.platform.is('ios')
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

  ngOnInit() {

    this.houseDetailsFormModal.compoundImagePreview = this.houseDetailsFormModal
      .compoundImage.imageUrl
      ? this.modifyImageUrl(this.houseDetailsFormModal.compoundImage.imageUrl)
      : '';

    this.houseDetailsFormModal.infrontImagePreview = this.houseDetailsFormModal
      .infrontImage.imageUrl
      ? this.modifyImageUrl(this.houseDetailsFormModal.infrontImage.imageUrl)
      : '';

    this.houseDetailsFormModal.bedroomImagePreview = this.houseDetailsFormModal
      .bedroomImage.imageUrl
      ? this.modifyImageUrl(this.houseDetailsFormModal.bedroomImage.imageUrl)
      : '';

    this.houseDetailsFormModal.washroomImagePreview = this.houseDetailsFormModal
      .washroomImage.imageUrl
      ? this.modifyImageUrl(this.houseDetailsFormModal.washroomImage.imageUrl)
      : '';

    this.houseDetailsFormModal.additionalImagePreview = this
      .houseDetailsFormModal.additionalImage?.imageUrl
      ? this.modifyImageUrl(this.houseDetailsFormModal.additionalImage.imageUrl)
      : '';
  }
}
