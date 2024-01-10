import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';
import { filterProducts } from 'src/app/store/products/products.action';
import { AppState } from 'src/app/types/AppState';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  categories: any = [];

  @ViewChild('popover') popover: any;

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  breakpoints = {
    // when window width is >= 320px
    320: {
      slidesPerView: 3.3,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 4,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 5,
    },

    760: {
      slidesPerView: 6.5,
    },
    800: {
      slidesPerView: 6.8,
    },
    1000: {
      slidesPerView: 11,
    },
  };

  constructor(
    private productsservice: ProductsserviceService,
    private store: Store<AppState>,
    private router: Router,
    private popoverController: PopoverController,
    private modalCtrl: ModalController
  ) {}

  productFilter(categoryID: Number, SubcategoryID: Number) {
    this.popoverController.dismiss();

    this.modalCtrl.dismiss();

    this.store.dispatch(
      filterProducts({
        filters: {
          category: categoryID,
          subcategory: SubcategoryID,
          priceRange: undefined,
        },
      })
    );

    this.router.navigateByUrl('products');

    // console.log({categoryID,SubcategoryID})
  }

  ngAfterViewInit() {
    // register Swiper custom elements
    register();

  }

  ngOnInit() {
    this.productsservice
      .getCategoriesAndSubCategoies()
      .pipe(first())
      .subscribe((categories) => {
        // console.log(categories)
        this.categories = categories;
      });
  }
}
