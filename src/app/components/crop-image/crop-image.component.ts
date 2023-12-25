import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss'],
})
export class CropImageComponent implements OnInit {
  @Input() loading = false;
  @Input() imageChangedEvent: any;
  @Output() croppedImage = new EventEmitter<any>();
  @Output() modalClose = new EventEmitter<void>();
  
  image: any = '';

  @ViewChild(ImageCropperComponent)
  cropper!: ImageCropperComponent;

  constructor(private sanitizer: DomSanitizer,private http:HttpClient) {}

  ngOnInit() {}

  closeModal() {
    this.modalClose.emit();
  }

  async cropImage() {
    const croppedImage:any = await this.cropper.crop();
    this.croppedImage.emit(croppedImage);
    this.modalClose.emit();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.image = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl as string);
  }

  done() {
    this.croppedImage.emit(this.image);
    this.modalClose.emit();
  }

  cropperReady() {
    // Handle cropper readiness
  }

  imageLoaded() {
    this.loading = false;
  }
}
