import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-display-image-modal',
  templateUrl: './display-image-modal.component.html',
  styleUrls: ['./display-image-modal.component.scss'],
})
export class DisplayImageModalComponent implements OnInit {

  dismiss() {
    this.modalController.dismiss();
  }

  @Input() imageUrl: string | undefined;

  constructor(private modalController:ModalController) { }

  ngOnInit() {}

}
