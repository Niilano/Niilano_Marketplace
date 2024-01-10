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
  selector: 'app-events-renting-listing-form',
  templateUrl: './events-renting-listing-form.component.html',
  styleUrls: ['./events-renting-listing-form.component.scss'],
})
export class EventsRentingListingFormComponent implements OnInit {
  eventItemTypes: string[] = [
    'Audio/Visual Equipment',
    'Stage and Podium',
    'Seating Arrangements',
    'Decorations',
    'Lighting Equipment',
    'Water Dispensers',
    'Videography Equipment',
    'Event-specific Props or Equipment',
    'Portable Restrooms',
    'Tables',
    'Chairs',
    'Linens',
    'Catering Equipment',
    'Dance Floor',
    'Tents and Canopies',
    'Sound Systems',
    'Photography Equipment',
    'Projectors and Screens',
    'Event Signage',
    'Outdoor Furniture',
    'Party Games and Activities',
    'Bar Equipment',
    'Security and Crowd Control',
    'Health and Safety Equipment',
    'Generators and Power Equipment',
    'Transportation (e.g., golf carts)',
    'Audio/Visual Technicians',
    'Event Planners and Coordinators',
    'Floral Arrangements',
    'Balloons and Party Decor',
    'Staging and Rigging',
    'A/V Cables and Accessories',
    'Props and Backdrops',
    'Curtains and Drapery',
    'Event Furniture',
    'Event Flooring',
    'Crowd Barriers',
    'Podiums and Lecterns',
    'Event Software and Apps',
    'Tableware and Cutlery',
    'Event Wearables (e.g., badges)',
    'Event Marketing Materials',
    'Miscellaneous Event Items',
  ];

  @Input() eventDetailsFormModal: any = {
    eventItemType: '',
    rentalCompany: '',
    regionalLocation: '',
    location: '',
    priceWithinRegion: '',
    priceRegionsAround: '',
    priceRegionsFarAway: '',
    discountPercentage: '',
    itemFeatures: [],
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
      this.eventDetailsFormModal.itemFeatures.unshift(this.newFeature); // Add the new feature to the top of the list
      this.newFeature = ''; // Clear the input field
    }
  }

  // Function to remove a feature
  removeFeature(index: number) {
    this.eventDetailsFormModal.itemFeatures.splice(index, 1);
  }

  sectionTitle = 'Event Item Type';

  currentSection = 1;

  totalSections = 5;

  async nextSection() {
    if (
      this.currentSection == 1 &&
      (!this.eventDetailsFormModal.eventItemType ||
        !this.eventDetailsFormModal.rentalCompany)
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
      (!this.eventDetailsFormModal.regionalLocation ||
        !this.eventDetailsFormModal.location)
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
      (!this.eventDetailsFormModal.priceWithinRegion ||
        !this.eventDetailsFormModal.priceRegionsAround ||
        !this.eventDetailsFormModal.priceRegionsFarAway)
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
      (!this.eventDetailsFormModal.description ||
        !this.eventDetailsFormModal.mobile)
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
        this.sectionTitle = 'Event Item Type';
        break;
      case 2:
        this.sectionTitle = 'Location and region';
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
        this.sectionTitle = 'Event Item Type';
        break;
      case 2:
        this.sectionTitle = 'Location and region';
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
      this.eventDetailsFormModal.mainImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.eventDetailsFormModal.mainImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadAdditionalImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.eventDetailsFormModal.additionalImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.eventDetailsFormModal.additionalImagePreview =
          reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async submitEventItemsDetailsForm() {
    // Checking if all required fields are filled, except for the optional additionalImage and discount

    if (
      !this.eventDetailsFormModal.eventItemType ||
      !this.eventDetailsFormModal.rentalCompany ||
      !this.eventDetailsFormModal.regionalLocation ||
      !this.eventDetailsFormModal.location ||
      !this.eventDetailsFormModal.priceWithinRegion ||
      !this.eventDetailsFormModal.priceRegionsAround ||
      !this.eventDetailsFormModal.priceRegionsFarAway ||
      !this.eventDetailsFormModal.description ||
      !this.eventDetailsFormModal.mainImage ||
      !this.eventDetailsFormModal.mobile
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      // return;
    }

    this.closeModal();

    this.store.dispatch(startLoading());

    const formData = new FormData();

    const keysToExclude = ['mainImagePreview', 'additionalImagePreview'];

    // Loop through each property in the equipmentDetailsFormModal and append them to the FormData
    for (const key in this.eventDetailsFormModal) {
      if (
        this.eventDetailsFormModal.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        if (Array.isArray(this.eventDetailsFormModal[key])) {
          let value = JSON.stringify(this.eventDetailsFormModal[key]);
          formData.append(key, value);
        } else {
          let value = this.eventDetailsFormModal[key];
          formData.append(key, value);
        }
      }
    }

    this.http
      .post<{ message: string; id: number }>(
        `${environment.server}/renting/publisheventitems`,
        formData
      )
      .subscribe(
        async (res) => {
          const routePath = '/rent-items-details';
          const queryParams = { item: 'events', id: res.id };
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
      !this.eventDetailsFormModal.eventItemType ||
      !this.eventDetailsFormModal.rentalCompany ||
      !this.eventDetailsFormModal.regionalLocation ||
      !this.eventDetailsFormModal.location ||
      !this.eventDetailsFormModal.priceWithinRegion ||
      !this.eventDetailsFormModal.priceRegionsAround ||
      !this.eventDetailsFormModal.priceRegionsFarAway ||
      !this.eventDetailsFormModal.description ||
      !this.eventDetailsFormModal.mainImage ||
      !this.eventDetailsFormModal.mobile
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      // return;
    }

    this.closeModal();

    this.store.dispatch(startLoading());

    const formData = new FormData();

    const keysToExclude = ['mainImagePreview', 'additionalImagePreview'];

    // Loop through each property in the equipmentDetailsFormModal and append them to the FormData
    for (const key in this.eventDetailsFormModal) {
      if (
        this.eventDetailsFormModal.hasOwnProperty(key) &&
        !keysToExclude.includes(key)
      ) {
        if (Array.isArray(this.eventDetailsFormModal[key])) {
          let value = JSON.stringify(this.eventDetailsFormModal[key]);
          formData.append(key, value);
        } else {
          let value = this.eventDetailsFormModal[key];
          formData.append(key, value);
        }
      }
    }

    this.http
      .put<{ message: string; id: number }>(
        `${environment.server}/renting/editeventitems`,
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
    private dataSharingService : DataSharingService,
    private platform: Platform
  ) {
    this.isIOSDevice = this.platform.is('ios')
  }

  ngOnInit() {
    this.eventDetailsFormModal.mainImagePreview = this
      .eventDetailsFormModal.mainImage?.imageUrl
      ? this.modifyImageUrl(this.eventDetailsFormModal.mainImage?.imageUrl)
      : '';

      this.eventDetailsFormModal.mainImagePreview = this
      .eventDetailsFormModal.mainImage?.imageUrl
      ? this.modifyImageUrl(this.eventDetailsFormModal.mainImage?.imageUrl)
      : '';
  }
}
