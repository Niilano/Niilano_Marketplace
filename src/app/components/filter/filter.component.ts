import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {

  categoriesAndSubcategories: any
  subcategories: any;


  selectedCategory: any;
  selectedSubcategory: any;
  priceRange: any;

  lowestPrice = 0
  highestPrice = 0

  constructor(private navParams: NavParams, private popoverController: PopoverController, private platform: Platform, private modalCtrl: ModalController) { }

  onCategoryChange() {
    // logic to update subcategories based on selected category

    this.selectedSubcategory = undefined

    let category = this.categoriesAndSubcategories.find((cat: any) => cat.id === this.selectedCategory);

    this.subcategories = category.Subcategories

  }

  onPriceChange() {
    // logic to update price range
    if (this.priceRange == "high") {
      this.lowestPrice = 1000
      this.highestPrice = 999999999999999
    } else if (this.priceRange == "medium") {
      this.lowestPrice = 300
      this.highestPrice = 1000
    } else if (this.priceRange == "low") {
      this.lowestPrice = 0
      this.highestPrice = 300
    }
  }

  applyFilter() {
    // logic to apply filter and dismiss popover

    let filterOBJ = {
      selectedCategory: this.selectedCategory,
      selectedSubCategory: this.selectedSubcategory,
      priceRange: {
        des: this.priceRange,
        lowest: this.lowestPrice,
        highest: this.highestPrice
      }
    }

    // console.log(filterOBJ)

    this.modalCtrl.dismiss(filterOBJ);
  }

  clearFilter() {
    // logic to clear filter options and dismiss popover
    // this.modalCtrl.dismiss();
    this.selectedCategory = undefined
    this.selectedSubcategory = undefined
    this.priceRange = undefined
    this.highestPrice = 0
    this.lowestPrice = 0
  }

  dismiss() {
    // logic to dismiss modal without applying filter
    this.modalCtrl.dismiss();
  }

  ngOnInit() {

    this.selectedCategory = this.navParams.get('selectedCategory') ? this.navParams.get('selectedCategory') : undefined;

    if (this.selectedCategory) {
      let category = this.categoriesAndSubcategories.find((cat: any) => cat.id === this.selectedCategory);

      this.subcategories = category.Subcategories

      this.selectedSubcategory = this.navParams.get('selectedSubcategory') ? this.navParams.get('selectedSubcategory') : undefined;
    }

    this.priceRange = this.navParams.get('priceRange')?.des ? this.navParams.get('priceRange')?.des : '';
    if (this.priceRange) {
      this.highestPrice = this.navParams.get('priceRange').highest
      this.lowestPrice = this.navParams.get('priceRange').lowest
    }

    this.categoriesAndSubcategories = this.navParams.get('categoriesAndSubcategories');

    // console.log(this.selectedCategory, this.selectedSubcategory, this.priceRange)

  }

  ngOnDestroy() {
    // console.log("Filter component destroyed")
  }

}
