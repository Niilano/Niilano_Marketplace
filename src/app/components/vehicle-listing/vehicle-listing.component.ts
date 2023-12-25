import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vehicle-listing',
  templateUrl: './vehicle-listing.component.html',
  styleUrls: ['./vehicle-listing.component.scss'],
})
export class VehicleListingComponent implements OnInit {
  sectionTitle = 'Vehicle Type';
  currentSection = 1;

  totalSections = 7;

  @Input() vehicleDetailsFormModal: any = {
    vehicleType: '',
    vehicleMake: '',
    modelYear: '',
    mileage: '',
    color: '',
    regNumber: '',
    transmissionType: '',
    fuel: '',
    seats: '',
    isCarRentalCompany: '',
    drivenBy: '',
    regionLocation: '',
    location: '',
    isTrackingSystemAvailable: '',
    vehicleFeatures: '',
    tagline: '',
    mobile: '',
    priceWithinRegionSD: '',
    priceRegionsAroundSD: '',
    priceRegionsFarAwaySD: '',
    discountPercentageSD: '',
    priceWithinRegionCD: '',
    priceRegionsAroundCD: '',
    priceRegionsFarAwayCD: '',
    discountPercentageCD: '',
    frontImage: '',
    frontImagePreview: '',
    sideImage: '',
    sideImagePreview: '',
    interiorImage: '',
    interiorImagePreview: '',
    additionalImage: '',
    additionalImagePreview: '',
  };

  @Input() editingListing = false;

  vehicleModelYearOptions: any = [];

  // nextSection() {
  //   this.currentSection = 2;
  // }

  // method to move to next sections
  async nextSection() {
    if (
      this.currentSection === 1 &&
      (!this.vehicleDetailsFormModal.vehicleType ||
        !this.vehicleDetailsFormModal.vehicleMake ||
        !this.vehicleDetailsFormModal.modelYear)
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
      (!this.vehicleDetailsFormModal.color ||
        !this.vehicleDetailsFormModal.regNumber ||
        !this.vehicleDetailsFormModal.mileage)
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
      (!this.vehicleDetailsFormModal.transmissionType ||
        !this.vehicleDetailsFormModal.fuel ||
        !this.vehicleDetailsFormModal.seats)
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
      (!this.vehicleDetailsFormModal.isCarRentalCompany ||
        !this.vehicleDetailsFormModal.drivenBy ||
        !this.vehicleDetailsFormModal.regionLocation ||
        !this.vehicleDetailsFormModal.location ||
        !this.vehicleDetailsFormModal.isTrackingSystemAvailable)
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
      (!this.vehicleDetailsFormModal.vehicleFeatures ||
        !this.vehicleDetailsFormModal.tagline ||
        !this.vehicleDetailsFormModal.mobile)
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
      this.currentSection === 6 &&
      this.vehicleDetailsFormModal.drivenBy == 'Self drive' &&
      (!this.vehicleDetailsFormModal.priceWithinRegionSD ||
        !this.vehicleDetailsFormModal.priceRegionsAroundSD ||
        !this.vehicleDetailsFormModal.priceRegionsFarAwaySD)
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
      this.currentSection === 6 &&
      this.vehicleDetailsFormModal.drivenBy == 'Chauffeur only' &&
      (!this.vehicleDetailsFormModal.priceWithinRegionCD ||
        !this.vehicleDetailsFormModal.priceRegionsAroundCD ||
        !this.vehicleDetailsFormModal.priceRegionsFarAwayCD)
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
      this.currentSection === 6 &&
      this.vehicleDetailsFormModal.drivenBy == 'both' &&
      (!this.vehicleDetailsFormModal.priceWithinRegionCD ||
        !this.vehicleDetailsFormModal.priceRegionsAroundCD ||
        !this.vehicleDetailsFormModal.priceRegionsFarAwayCD ||
        !this.vehicleDetailsFormModal.priceWithinRegionSD ||
        !this.vehicleDetailsFormModal.priceRegionsAroundSD ||
        !this.vehicleDetailsFormModal.priceRegionsFarAwaySD)
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
        this.sectionTitle = 'Vehicle Type';
        break;
      case 2:
        this.sectionTitle = 'Vehicle Details';
        break;
      case 3:
        this.sectionTitle = 'Specifications';
        break;
      case 4:
        this.sectionTitle = 'Driving and Location';
        break;
      case 5:
        this.sectionTitle = 'Features and Description';
        break;
      case 6:
        this.sectionTitle = 'Pricing and Discounts';
        break;
      case 7:
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
        this.sectionTitle = 'Vehicle Type';
        break;
      case 2:
        this.sectionTitle = 'Vehicle Details';
        break;
      case 3:
        this.sectionTitle = 'Specifications';
        break;
      case 4:
        this.sectionTitle = 'Driving and Location';
        break;
      case 5:
        this.sectionTitle = 'Features and Description';
        break;
      case 6:
        this.sectionTitle = 'Pricing and Discounts';
        break;
      case 7:
        this.sectionTitle = 'Images';
        break;

      default:
        break;
    }
  }

  async uploadFrontImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vehicleDetailsFormModal.frontImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.vehicleDetailsFormModal.frontImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadSideImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vehicleDetailsFormModal.sideImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.vehicleDetailsFormModal.sideImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadInteriorImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vehicleDetailsFormModal.interiorImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.vehicleDetailsFormModal.interiorImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadAdditionalImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vehicleDetailsFormModal.additionalImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.vehicleDetailsFormModal.additionalImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
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

  async submitVehicleDetailsForm() {
    // Checking if all required fields are filled, except for the optional additionalImage and discount
    if (
      !this.vehicleDetailsFormModal.vehicleType ||
      !this.vehicleDetailsFormModal.vehicleMake ||
      !this.vehicleDetailsFormModal.modelYear ||
      !this.vehicleDetailsFormModal.mileage ||
      !this.vehicleDetailsFormModal.color ||
      !this.vehicleDetailsFormModal.regNumber ||
      !this.vehicleDetailsFormModal.transmissionType ||
      !this.vehicleDetailsFormModal.fuel ||
      !this.vehicleDetailsFormModal.seats ||
      !this.vehicleDetailsFormModal.isCarRentalCompany ||
      !this.vehicleDetailsFormModal.drivenBy ||
      !this.vehicleDetailsFormModal.regionLocation ||
      !this.vehicleDetailsFormModal.location ||
      !this.vehicleDetailsFormModal.isTrackingSystemAvailable ||
      !this.vehicleDetailsFormModal.vehicleFeatures ||
      !this.vehicleDetailsFormModal.tagline ||
      !this.vehicleDetailsFormModal.mobile ||
      !this.vehicleDetailsFormModal.frontImage ||
      !this.vehicleDetailsFormModal.sideImage ||
      !this.vehicleDetailsFormModal.interiorImage
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

    const keysToExclude = [
      'frontImagePreview',
      'sideImagePreview',
      'interiorImagePreview',
      'additionalImagePreview',
    ];

    // Loop through each property in the vehicleDetailsFormModal and append them to the FormData
    for (const key in this.vehicleDetailsFormModal) {
      if (
        this.vehicleDetailsFormModal.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        let value = this.vehicleDetailsFormModal[key];
        formData.append(key, value); // Use || '' to handle undefined values
      }
    }

    this.http
      .post<{ message: string; id: number }>(
        `${environment.server}/renting/listvehicle`,
        formData
      )
      .subscribe(
        async (res) => {
          const routePath = '/rent-items-details';
          const queryParams = { item: 'vehicle', id: res.id };
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

  async submitEditListing() {
    // Checking if all required fields are filled, except for the optional additionalImage and discount
    if (
      !this.vehicleDetailsFormModal.vehicleType ||
      !this.vehicleDetailsFormModal.vehicleMake ||
      !this.vehicleDetailsFormModal.modelYear ||
      !this.vehicleDetailsFormModal.mileage ||
      !this.vehicleDetailsFormModal.color ||
      !this.vehicleDetailsFormModal.regNumber ||
      !this.vehicleDetailsFormModal.transmissionType ||
      !this.vehicleDetailsFormModal.fuel ||
      !this.vehicleDetailsFormModal.seats ||
      !this.vehicleDetailsFormModal.isCarRentalCompany ||
      !this.vehicleDetailsFormModal.drivenBy ||
      !this.vehicleDetailsFormModal.regionLocation ||
      !this.vehicleDetailsFormModal.location ||
      !this.vehicleDetailsFormModal.isTrackingSystemAvailable ||
      !this.vehicleDetailsFormModal.vehicleFeatures ||
      !this.vehicleDetailsFormModal.tagline ||
      !this.vehicleDetailsFormModal.mobile ||
      !this.vehicleDetailsFormModal.frontImage ||
      !this.vehicleDetailsFormModal.sideImage ||
      !this.vehicleDetailsFormModal.interiorImage
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

    const keysToExclude = [
      'frontImagePreview',
      'sideImagePreview',
      'interiorImagePreview',
      'additionalImagePreview',
    ];

    // Loop through each property in the vehicleDetailsFormModal and append them to the FormData
    for (const key in this.vehicleDetailsFormModal) {
      if (
        this.vehicleDetailsFormModal.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        let value = this.vehicleDetailsFormModal[key];
        formData.append(key, value); // Use || '' to handle undefined values
      }
    }

    this.http
      .put<{ message: string; id: number }>(
        `${environment.server}/renting/editvehicle`,
        formData
      )
      .subscribe(
        async (res) => {

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

  closeModal() {
    this.modalController.dismiss();
  }

  seatNumberOptions: any = [];

  isIOSDevice:any

  constructor(
    private toastController: ToastController,
    private store: Store<AppState>,
    private modalController: ModalController,
    private http: HttpClient,
    private router: Router,
    private dataSharingService:DataSharingService,
    private platform: Platform
  ) {
    this.isIOSDevice = this.platform.is('ios')
  }

  ngOnInit() {
    // Generate a list of years dynamically (e.g., from 2000 to the current year)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; year--) {
      this.vehicleModelYearOptions.push(year.toString());
    }

    for (let i = 1; i <= 40; i++) {
      this.seatNumberOptions.push(i.toString());
    }

    this.vehicleDetailsFormModal.frontImagePreview = this
      .vehicleDetailsFormModal.frontImage.imageUrl
      ? this.modifyImageUrl(this.vehicleDetailsFormModal.frontImage?.imageUrl)
      : '';

    this.vehicleDetailsFormModal.sideImagePreview = this.vehicleDetailsFormModal
      .sideImage.imageUrl
      ? this.modifyImageUrl(this.vehicleDetailsFormModal.sideImage?.imageUrl)
      : '';

    this.vehicleDetailsFormModal.interiorImagePreview = this
      .vehicleDetailsFormModal.interiorImage?.imageUrl
      ? this.modifyImageUrl(this.vehicleDetailsFormModal.interiorImage.imageUrl)
      : '';

    this.vehicleDetailsFormModal.additionalImagePreview = this
      .vehicleDetailsFormModal.additionalImage?.imageUrl
      ? this.modifyImageUrl(
          this.vehicleDetailsFormModal.additionalImage.imageUrl
        )
      : '';
  }
}
