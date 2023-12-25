import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-rent-item-modal',
  templateUrl: './list-rent-item-modal.component.html',
  styleUrls: ['./list-rent-item-modal.component.scss'],
})
export class ListRentItemModalComponent implements OnInit {
  @Input() selectedCategory: string = 'Select Category';
  @Input() data : {} = {}
  @Input() editingListing = false
  // @Input() updateUserRentItems = false

  // @Input() selectedCategoryEdit: any;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  selectCategory() {
    // this.modalController.dismiss(this.selectedCategory);
  }

  ngOnInit() {
    // console.log(this.data);
  }
}
