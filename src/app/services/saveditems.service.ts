import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export interface SaveItem {
  id: number,
  image:string,
  name: string,
  price: number,
  quantity: number,
  sellerId : number,
  seller:string
}

@Injectable({
  providedIn: 'root'
})
export class SaveditemsService {
  
  private savedItems: SaveItem[] = [];

  // Add a new saved item
  addSavedItem(item: SaveItem) {
    // Check if the item is already saved
    const existingItem = this.savedItems.find(i => i.id === item.id);
    if (existingItem) {
      // If the item already exists, update the quantity
      existingItem.quantity += item.quantity;
    } else {
      // If the item does not exist, add it to the array
      this.savedItems.push(item);
    }

    // Save the updated array to localStorage
    localStorage.setItem('savedItems', JSON.stringify(this.savedItems));

    this.toastController.create({
      message: "Product Saved",
      duration: 1500,
      color: 'dark',
      position: 'top'
    }).then((toast) => {
      toast.present()
    })

  }
  
  // Remove a saved item
  removeSavedItem(itemId: number) {
    // Find the index of the item in the array
    const index = this.savedItems.findIndex(i => i.id === itemId);
    if (index !== -1) {
      // If the item is found, remove it from the array
      this.savedItems.splice(index, 1);

      // Save the updated array to localStorage
      localStorage.setItem('savedItems', JSON.stringify(this.savedItems));
    }
  }

  // Get all saved items
  getAllSavedItems() {
    return this.savedItems;
  }

  constructor(private toastController:ToastController) {
    // Check if there are any saved items in localStorage
    const savedItemsJson = localStorage.getItem('savedItems');
    if (savedItemsJson) {
      this.savedItems = JSON.parse(savedItemsJson);
    }
  }

}
