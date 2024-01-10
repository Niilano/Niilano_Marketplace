import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DataSharingService } from 'src/app/services/data-sharing/data-sharing.service';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';
import { isArray } from 'util';

@Component({
  selector: 'app-equipments-rent-listing-form',
  templateUrl: './equipments-rent-listing-form.component.html',
  styleUrls: ['./equipments-rent-listing-form.component.scss'],
})
export class EquipmentsRentListingFormComponent implements OnInit {
  equipmentTypes: string[] = [
    'Excavators',
    'Loaders',
    'Bulldozers',
    'Trucks',
    'Cranes',
    'Concrete Mixers',
    'Scaffold',
    'Road Rollers',
    'Backhoes',
    'Generators',
    'Forklifts',
    'Skid Steer Loaders',
    'Graders',
    'Pavers',
    'Trenchers',
    'Dump Trucks',
    'Rollers',
    'Compactors',
    'Aerial Lifts',
    'Tractors',
    'Trailers',
    'Utility Vehicles',
    'Crawler Dozers',
    'Wheel Dozers',
    'Mini Excavators',
    'Towable Boom Lifts',
    'Scissor Lifts',
    'Articulating Boom Lifts',
    'Telescopic Boom Lifts',
    'Air Compressors',
    'Trench Rollers',
    'Cement Silos',
    'Cement Mixers',
    'Demolition Hammers',
    'Welders',
    'Towable Light Towers',
    'Concrete Saws',
    'Ride-On Trowels',
    'Power Buggies',
    'Pressure Washers',
    'Jackhammers',
    'Saws',
    'Drills',
    'Compaction Plates',
    'Core Drills',
    'Trowels',
    'Skid Steer Loaders',
    'Utility Tractors',
    'Utility Carts',
    'Utility Trailers',
    'Backhoe Loaders',
    'Telescopic Handlers',
    'Front-End Loaders',
    'Excavator Loaders',
    'Motor Graders',
    'Compact Track Loaders',
    'Compact Utility Loaders',
    'Utility Excavators',
    'Articulated Dump Trucks',
    'Dump Trailers',
    'Scrapers',
    'Motor Scrapers',
    'Draglines',
    'Pipelayers',
    'Crushing Plants',
    'Screening Plants',
    'Conveyors',
    'Material Handlers',
    'Forestry Equipment',
    'Mining Equipment',
    'Agricultural Equipment',
  ];

  @Input() equipmentDetailsFormModal: any = {
    equipmentType: '',
    regNo: '',
    rentalCompany: '',
    regionalLocation: '',
    location: '',
    priceWithinRegion: '',
    priceRegionsAround: '',
    priceRegionsFarAway: '',
    discountPercentage: '',
    equipmentFeatures: [],
    description: '',
    mobile: '',
    mainImage: '',
    mainImagePreview: '',
    additionalImage: '',
    additionalImagePreview: '',
  };

  @Input() editingListing = false;

  newFeature: string = '';

  // Function to add a new feature
  addFeature() {
    if (this.newFeature.trim() !== '') {
      this.equipmentDetailsFormModal.equipmentFeatures.unshift(this.newFeature); // Add the new feature to the top of the list
      this.newFeature = ''; // Clear the input field
    }
  }

  // Function to remove a feature
  removeFeature(index: number) {
    this.equipmentDetailsFormModal.equipmentFeatures.splice(index, 1);
  }

  currentSection = 1;
  sectionTitle = 'Machinery/Equipment Type';
  totalSections = 5;

  async nextSection() {
    if (
      this.currentSection == 1 &&
      !this.equipmentDetailsFormModal.equipmentType
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    } else if (
      this.currentSection == 2 &&
      (!this.equipmentDetailsFormModal.rentalCompany ||
        !this.equipmentDetailsFormModal.regionalLocation ||
        !this.equipmentDetailsFormModal.location)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    } else if (
      this.currentSection == 3 &&
      (!this.equipmentDetailsFormModal.priceWithinRegion ||
        !this.equipmentDetailsFormModal.priceRegionsAround ||
        !this.equipmentDetailsFormModal.priceRegionsFarAway)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    } else if (
      this.currentSection == 4 &&
      (!this.equipmentDetailsFormModal.description ||
        !this.equipmentDetailsFormModal.mobile)
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

    this.currentSection++;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Machinery/Equipment Type';
        break;
      case 2:
        this.sectionTitle = 'Location and details';
        break;
      case 3:
        this.sectionTitle = 'Pricing and discounts';
        break;
      case 4:
        this.sectionTitle = 'Features and description';
        break;
      case 5:
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
        this.sectionTitle = 'Machinery/Equipment Type';
        break;
      case 2:
        this.sectionTitle = 'Location and details';
        break;
      case 3:
        this.sectionTitle = 'Pricing and discounts';
        break;
      case 4:
        this.sectionTitle = 'Features and description';
        break;
      case 5:
        this.sectionTitle = 'Images';
        break;

      default:
        break;
    }
  }

  async uploadMainImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.equipmentDetailsFormModal.mainImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.equipmentDetailsFormModal.mainImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadAdditionalImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.equipmentDetailsFormModal.additionalImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.equipmentDetailsFormModal.additionalImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async submitMachineryDetailsForm() {
    // Checking if all required fields are filled, except for the optional additionalImage and discount

    if (
      !this.equipmentDetailsFormModal.equipmentType ||
      !this.equipmentDetailsFormModal.rentalCompany ||
      !this.equipmentDetailsFormModal.regionalLocation ||
      !this.equipmentDetailsFormModal.location ||
      !this.equipmentDetailsFormModal.priceWithinRegion ||
      !this.equipmentDetailsFormModal.priceRegionsAround ||
      !this.equipmentDetailsFormModal.priceRegionsFarAway ||
      !this.equipmentDetailsFormModal.description ||
      !this.equipmentDetailsFormModal.mainImage ||
      !this.equipmentDetailsFormModal.mobile
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

    const keysToExclude = ['mainImagePreview', 'additionalImagePreview'];

    // Loop through each property in the equipmentDetailsFormModal and append them to the FormData
    for (const key in this.equipmentDetailsFormModal) {
      if (
        this.equipmentDetailsFormModal.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        if (Array.isArray(this.equipmentDetailsFormModal[key])) {
          let value = JSON.stringify(this.equipmentDetailsFormModal[key]);
          formData.append(key, value);
        } else {
          let value = this.equipmentDetailsFormModal[key];
          formData.append(key, value);
        }
      }
    }

    this.http
      .post<{ message: string; id: number }>(
        `${environment.server}/renting/publishmachinery`,
        formData
      )
      .subscribe(
        async (res) => {
          const routePath = '/rent-items-details';
          const queryParams = { item: 'machinery', id: res.id };
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
      !this.equipmentDetailsFormModal.equipmentType ||
      !this.equipmentDetailsFormModal.rentalCompany ||
      !this.equipmentDetailsFormModal.regionalLocation ||
      !this.equipmentDetailsFormModal.location ||
      !this.equipmentDetailsFormModal.priceWithinRegion ||
      !this.equipmentDetailsFormModal.priceRegionsAround ||
      !this.equipmentDetailsFormModal.priceRegionsFarAway ||
      !this.equipmentDetailsFormModal.description ||
      !this.equipmentDetailsFormModal.mainImage ||
      !this.equipmentDetailsFormModal.mobile
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

    const keysToExclude = ['mainImagePreview', 'additionalImagePreview'];

    // Loop through each property in the equipmentDetailsFormModal and append them to the FormData
    for (const key in this.equipmentDetailsFormModal) {
      if (
        this.equipmentDetailsFormModal.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        if (Array.isArray(this.equipmentDetailsFormModal[key])) {
          let value = JSON.stringify(this.equipmentDetailsFormModal[key]);
          formData.append(key, value);
        } else {
          let value = this.equipmentDetailsFormModal[key];
          formData.append(key, value);
        }
      }
    }

    this.http
      .put<{ message: string; id: number }>(
        `${environment.server}/renting/editmachinery`,
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

  isIOSDevice:any

  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private dataSharingService: DataSharingService,
    private platform: Platform
  ) {
    this.isIOSDevice = this.platform.is('ios')
  }

  ngOnInit() {
    this.equipmentDetailsFormModal.mainImagePreview = this
      .equipmentDetailsFormModal.mainImage?.imageUrl
      ? this.modifyImageUrl(this.equipmentDetailsFormModal.mainImage?.imageUrl)
      : '';

    this.equipmentDetailsFormModal.additionalImagePreview = this
      .equipmentDetailsFormModal.additionalImage?.imageUrl
      ? this.modifyImageUrl(
          this.equipmentDetailsFormModal.additionalImage?.imageUrl
        )
      : '';
  }
}
