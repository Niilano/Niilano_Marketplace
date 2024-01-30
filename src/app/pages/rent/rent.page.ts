import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RentItemsDetailsModalComponent } from 'src/app/components/rent-items-details-modal/rent-items-details-modal.component';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ListRentItemModalComponent } from 'src/app/components/list-rent-item-modal/list-rent-item-modal.component';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/types/AppState';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.page.html',
  styleUrls: ['./rent.page.scss'],
})
export class RentPage implements OnInit {
  pageTitle = 'rent';

  private subscriptions: Subscription[] = [];

  slideOpts: any = {
    initialSlide: 0,
    speed: 1000,
    slidesPerView: 1.2,
    spaceBetween: 5,
    loop: true,
    zoom: true,
    lazy: true,
    grabCursor: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // autoplay: {
    //   delay: 2000,
    //   autoplayDisableOnInteraction : true,
    //   autoplayEnableOnInteraction : true
    // },
  };

  houseImages(houseItem: any): any[] {
    const images = [
      houseItem.bedroomImage,
      houseItem.washroomImage,
      houseItem.compoundImage,
      houseItem.infrontImage,
      houseItem.additionalImage,
    ];
    return images.filter((image) => !!image); // Filter out undefined or null images
  }

  vehicleImages(vehicleItem: any): any[] {
    const images = [
      vehicleItem.frontImage,
      vehicleItem.sideImage,
      vehicleItem.interiorImage,
      vehicleItem.additionalImage,
    ];
    return images.filter((image) => !!image); // Filter out undefined or null images
  }

  machineryImages(machineryItem: any): any[] {
    const images = [machineryItem.mainImage, machineryItem.additionalImage];
    return images.filter((image) => !!image); // Filter out undefined or null images
  }

  eventsItemsImages(eventsItems: any): any[] {
    const images = [eventsItems.mainImage, eventsItems.additionalImage];
    return images.filter((image) => !!image); // Filter out undefined or null images
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

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {}

  selectedSegment = 'housing';

  handleSegmentChange(event: any) {
    const segmentValue = event.detail.value;

    this.selectedSegment = segmentValue;

    if (segmentValue === 'housing') {
      if (this.rentingHouses.length < 1) {
        // Call the function to fetch the renting houses when the component initializes
        this.subscriptions.push(
          this.getRentingHouses().subscribe(
            (data: any) => {
              // Handle the data received from the server (array of house listings)
              // console.log(data);
              this.store.dispatch(endLoading());
              this.rentingHouses = data;
              if (this.rentingHouses.length < 1) {
                this.emptyData = true;
              }
              // Update the data in your component as needed
            },
            (error) => {
              this.store.dispatch(endLoading());
              console.error('Error fetching renting houses:', error);
              // Handle the error if the request fails
            }
          )
        );
      } else {
        this.emptyData = false;
      }
    } else if (segmentValue === 'vehicles') {
      if (this.rentingVehicles.length < 1) {
        this.emptyData = false;
        this.rentingVehiclesData();
      } else {
        this.emptyData = false;
      }
    } else if (segmentValue === 'machinery') {
      if (this.machineryListings.length < 1) {
        this.emptyData = false;
        this.rentingMachineryData();
      } else {
        this.emptyData = false;
      }
    } else if (segmentValue === 'events') {
      if (this.eventsItemsListings.length < 1) {
        this.emptyData = false;
        this.rentingEventsData();
      } else {
        this.emptyData = false;
      }
    }
  }

  rentingHouses: any = [];
  rentingVehicles: any = [];
  machineryListings: any = [];
  eventsItemsListings: any =[]
  emptyData = false;

  // Method to fetch the renting houses
  getRentingHouses() {
    this.store.dispatch(startLoading());
    const apiUrl = `${environment.server}/renting/getHouses`;
    return this.http.get(apiUrl);
  }

  // Method to fetch the renting vehicles
  getRentingVehicles() {
    this.store.dispatch(startLoading());
    const apiUrl = `${environment.server}/renting/getVehicles`;
    return this.http.get(apiUrl);
  }

  // Method to fetch the renting machinery
  getRentingMachinery() {
    this.store.dispatch(startLoading());
    const apiUrl = `${environment.server}/renting/getmachinery`;
    return this.http.get(apiUrl);
  }

  // Method to fetch the renting events items
  getRentingEvents() {
    this.store.dispatch(startLoading());
    const apiUrl = `${environment.server}/renting/geteventsitems`;
    return this.http.get(apiUrl);
  }

  rentingVehiclesData() {
    // Call the function to fetch the renting vehicles when the segment value changes to vehicles
    this.subscriptions.push(
      this.getRentingVehicles().subscribe(
        (data: any) => {
          // Handle the data received from the server (array of vehicle listings)
          // console.log(data);
          this.store.dispatch(endLoading());
          this.rentingVehicles = data;
          if (this.rentingVehicles.length < 1) {
            this.emptyData = true;
          }
          // Update the data in your component as needed
        },
        (error) => {
          this.store.dispatch(endLoading());
          console.error('Error fetching renting houses:', error);
          // Handle the error if the request fails
        }
      )
    );
  }

  rentingMachineryData() {
    // Call the function to fetch the renting vehicles when the segment value changes to vehicles
    this.subscriptions.push(
      this.getRentingMachinery().subscribe(
        (data: any) => {
          // Handle the data received from the server (array of machinery listings)
          console.log(data);
          this.store.dispatch(endLoading());
          this.machineryListings = data;
          if (this.machineryListings.length < 1) {
            this.emptyData = true;
          }
          // Update the data in your component as needed
        },
        (error) => {
          this.store.dispatch(endLoading());
          console.error('Error fetching renting machinery:', error);
          // Handle the error if the request fails
        }
      )
    );
  }

   rentingEventsData() {
    // Call the function to fetch the renting vehicles when the segment value changes to vehicles
    this.subscriptions.push(
      this.getRentingEvents().subscribe(
        (data: any) => {
          // Handle the data received from the server (array of events items listings)
          console.log(data);
          this.store.dispatch(endLoading());
          this.eventsItemsListings = data;
          if (this.eventsItemsListings.length < 1) {
            this.emptyData = true;
          }
          // Update the data in your component as needed
        },
        (error) => {
          this.store.dispatch(endLoading());
          console.error('Error fetching renting events items:', error);
          // Handle the error if the request fails
        }
      )
    );
  }

  ionViewDidEnter() {
    this.store.select('checkLogin')
      .subscribe((res) => {
        if(res.loggedIn){
          this.isLoggedIn = res.loggedIn;
        this.userProfile = res.profile
        // console.log(res)
        // console.log(this.userProfile)
        }
      });

    if (this.rentingHouses.length < 1) {
      // Call the function to fetch the renting houses when the component initializes
      this.subscriptions.push(
        this.getRentingHouses().subscribe(
          (data: any) => {
            // Handle the data received from the server (array of house listings)
            // console.log(data);
            this.store.dispatch(endLoading());
            this.rentingHouses = data;
            if (this.rentingHouses.length < 1) {
              this.emptyData = true;
            }
            // Update the data in your component as needed
          },
          (error) => {
            this.store.dispatch(endLoading());
            console.error('Error fetching renting houses:', error);
            // Handle the error if the request fails
          }
        )
      );
    }
  }

  // Method to calculate the discounted price
  calculateDiscountedPrice(price: string, discountPercentage: string): number {
    const originalPrice = parseFloat(price);
    const discount = parseFloat(discountPercentage);
    const discountAmount = (discount / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  }

  isLoggedIn = false;
  userProfile : any = {}

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

  async presentRentItemsModal() {

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

  async openHouseDetailsModal(house: any) {
    const modal = await this.modalCtrl.create({
      component: RentItemsDetailsModalComponent,
      componentProps: {
        data: house, // Pass the house details data to the modal component
        item: 'house',
      },
    });

    return await modal.present();
  }

  ionViewWillLeave() {
    // Unsubscribe from all subscriptions when the component is leaving
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
