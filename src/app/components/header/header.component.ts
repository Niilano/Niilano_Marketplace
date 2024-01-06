import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { SaveditemsService } from 'src/app/services/saveditems.service';
import { SearchComponent } from '../search/search.component';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/types/AppState';
import { ListServicesComponent } from '../list-services/list-services.component';
import { ListRentItemModalComponent } from '../list-rent-item-modal/list-rent-item-modal.component';
import { regionData } from '../../pages/list-product/regions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isIOS!: boolean;

  redirect(path: string) {
    this.router.navigate([path]);
  }

  async searchI() {
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  @Input() segmentValue: string = 'home';

  handleSegmentChange(event: any) {
    const segmentValue = event.detail.value;

    if (segmentValue === 'home') {
      // this.router.navigate(['/home']);
      this.navCtrl.navigateRoot('/home');
    } else if (segmentValue === 'products') {
      // this.router.navigate(['/products']);
      this.navCtrl.navigateRoot('/products');
    } else if (segmentValue === 'rent') {
      // this.router.navigate(['/rent']);
      this.navCtrl.navigateRoot('/rent');
    } else if (segmentValue === 'services') {
      // this.router.navigate(['/services']);
      this.navCtrl.navigateRoot('/services');
    }
  }

  changePage(page: string) {
    this.router.navigate([`/${page}`]);
  }  

  toSignInPage(){
    this.router.navigateByUrl('/auth?page=login');
  }

  toProducts(){
    this.router.navigateByUrl('/products?openFilter=true')
  }

  savedItems: any;

  isLoggedIn = false
  userProfile : any = {}

  regions:any = []

  closed$ = new Subject<any>();

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

  async presentListServicesModal() {

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

    if (!this.isLoggedIn) {
      this.presentLoginAlert();
      return;
    } else {
      this.router.navigate(['/list-product']);
    }
  }

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private savedItemsService: SaveditemsService,
    private platform: Platform,
    private modalCtrl: ModalController,
    private store:Store<AppState>,
    private alertController:AlertController
  ) {}

  ngOnInit() {

    this.regions = regionData.map((data) => data.region);

    this.store.select('checkLogin')
      .subscribe((res) => {
        if(res.loggedIn){
          this.isLoggedIn = res.loggedIn;
        this.userProfile = res.profile
        // console.log(res)
        // console.log(this.userProfile)
        } else{
          this.isLoggedIn = res.loggedIn;
        this.userProfile = {}
        }
      });

    // console.log(this.segmentValue)
    this.savedItems = this.savedItemsService.getAllSavedItems();

    this.isIOS = this.platform.is('ios');
  }

  ngOnDestroy() {
    // console.log("Component Destroyed")
  }
}
