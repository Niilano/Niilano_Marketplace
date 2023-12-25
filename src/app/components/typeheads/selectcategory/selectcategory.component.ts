import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selectcategory',
  templateUrl: './selectcategory.component.html',
  styleUrls: ['./selectcategory.component.scss'],
})
export class SelectcategoryComponent implements OnInit {
  title = 'Select Category';

  @Input() categories: any = [];
  filteredCategories: any = [];

  @Input() selectedValues: any = [];

  filteredSubCategories: any = [];

  selectedCategory = false;
  categorySelected: any = [];

  @Output() modalClose = new EventEmitter<void>();
  @Output() confirmChanges: any = new EventEmitter<string[]>();

  filterCategories(ev: any) {
    let value = ev.target.value;
    if (value === undefined) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter((cat: any) =>
        cat.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterSubCategories(ev: any) {
    let value = ev.target.value;
    if (value === undefined) {
      this.filteredSubCategories = this.categorySelected.Subcategories;
    } else {
      this.filteredSubCategories = this.categorySelected.Subcategories.filter(
        (cat: any) => cat.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  selectCategory(id: number) {
    if (id) {
      this.selectedCategory = true;
      this.categorySelected = this.categories.find((cat: any) => cat.id === id);
      this.filteredSubCategories = this.categorySelected.Subcategories;
      this.title = 'Select SubCategory';
    }
  }

  selectedSubCategory: any = '';

  done() {
    // console.log(this.selectedSubCategory);
    let finalValues = {
      category_id: this.categorySelected.id,
      subcategory_id: this.selectedSubCategory,
      subCategory_name: this.categorySelected.Subcategories.find(
        (cat: any) => cat.id === this.selectedSubCategory
      ).name,
    };

    this.confirmChanges.emit(finalValues);
  }

  backSelection() {
    this.selectedCategory = false;
    this.categorySelected = '';
    this.filteredSubCategories = '';
    this.title = 'Select Category';
    this.selectedSubCategory = '';
  }

  closeModal() {
    this.modalClose.emit();
  }

  modifyImageUrl(url: string): string {
    if (url) {
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
    }

    return url
      ? url
      : 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
  }

  constructor() {}

  ngOnInit() {
    this.filteredCategories = this.categories;

    // console.log(this.selectedValues);

    if (this.selectedValues.category_id) {
      this.selectCategory(this.selectedValues.category_id);
      this.selectedSubCategory = this.selectedValues.subcategory_id;
    }
  }
}
