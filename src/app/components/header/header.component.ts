import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { SaveditemsService } from 'src/app/services/saveditems.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  isIOS!: boolean;

  redirect(path:string){

    this.router.navigate([path])

  }

  async searchI() {
    const modal = await this.modalCtrl.create({
      component: SearchComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }
  
  @Input() segmentValue: string = "home";

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
  

  savedItems:any

  // ionView

  constructor(private router:Router,private navCtrl: NavController,private savedItemsService:SaveditemsService,private platform: Platform,private modalCtrl: ModalController) { }

  ngOnInit() {

    // console.log(this.segmentValue)
    this.savedItems = this.savedItemsService.getAllSavedItems()

    this.isIOS = this.platform.is('ios');
  }

  ngOnDestroy(){
    // console.log("Component Destroyed")
  }

}
