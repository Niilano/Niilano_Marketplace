import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import Masonry from 'masonry-layout';
import { take } from 'rxjs';
import { ProductsserviceService } from 'src/app/services/productsservice/productsservice.service';
import { editProduct } from 'src/app/store/editProducts/editProductState.actions';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { getUserProducts } from 'src/app/store/userProducts/userproducts.actions';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss'],
})
export class EditproductComponent implements OnInit,OnDestroy {

  hasDiscount = false

  campus = false

  setDiscount() {

    if (!this.hasDiscount) {
      console.log(this.hasDiscount)
      this.editProductForm.get('discount_percent')?.setValue('')
    }

  }

  setCampus() {
    
    if (!this.campus) {
      this.editProductForm.get('Campus')?.setValue('')
    }

  }

  imagePreview: any


  mainImage: File[] = [];

  removeMainImage=false

  removedImagesPublicID: any = []

  onChangeMainImage(event: any) {

    const file = event.target.files[0];;
    if (file.type.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      if(!this.removeMainImage){
      this.removedImages.push(this.editProductForm.get('image').value)
      this.removeMainImage = true
      }

      this.imagePreview = reader.result;
      this.editProductForm.get('image').setValue(file)
      
    };

  }

  onChangeOtherImage(event: any) {

    const file = event.target.files[0];;
    if (file.type.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagesPreviewArray.push({url:reader.result})
      this.newImagesArray.push(file)

      setTimeout(() => {
        let otherimages = document.querySelector('.otherimages') as HTMLElement
        let masonry = new Masonry(otherimages, {
          itemSelector: '.otherImagesPreview'
        })
      }, 500);
      
    };

  }

  removedImages:any = []

  async removeOtherImage(imageIndex:any,image: any) {
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to remove this Image?',
      subHeader: 'This action cannot be undone.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          // console.log('Cancel clicked');
          // do nothing
        }
      }, {
        text: 'Delete',
        icon: 'trash',
        role: 'destructive',
        handler: () => {

          this.removedImages.push(image)
          
          this.imagesPreviewArray.splice(imageIndex, 1);

          // console.log(this.removedImages)
          // Place your logic for deleting the product here
        }
      }]
    });
    await actionSheet.present();

  }


  product: any;


  constructor(private fb: FormBuilder, private modalCtrl: ModalController, private navParams: NavParams, private http: HttpClient, private actionSheetController: ActionSheetController,private productsService:ProductsserviceService,private store:Store<AppState>,private toastController:ToastController,private cdr: ChangeDetectorRef) {

  }

  submitted = false

  editProductForm: any = this.fb.group({
    productID : ['',Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    discount_percent: [''],
    discount_price: [''],
    quantity: ['', Validators.required],
    image: ['', Validators.required],
    images: ['', Validators.required],
    category_id: ['', Validators.required],
    subcategory_id: ['', Validators.required],
    location: ['', Validators.required],
    Campus: [''],
    removedImages: ['']
  })

  async makeChanges() {

    this.submitted = true

    const formData = new FormData()
    this.editProductForm.get('removedImages').setValue(this.removedImages)
    const formValue = this.editProductForm.value;

    if (this.editProductForm.invalid) {

      this.toastController.create({
        message: "Please fill in the required fields",
        duration: 3000,
        header: "Validation Error",
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return
    }

    else if (this.hasDiscount && !formValue.discount_percent) {

      this.toastController.create({
        message: "Note: Discount percentage is an optional field, but since you have indicated that you have a discount, please provide a valid discount percentage to calculate the discounted price.",
        duration: 5000,
        header: "Validation Error",
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    else if (this.campus && !formValue.Campus) {

      this.toastController.create({
        message: "Note: Campus location is an optional field, but since you have indicated that the product is located on a campus, please provide the name of the campus to proceed.",
        duration: 5000,
        header: "Validation Error",
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    else if (!this.mainImage) {

      this.toastController.create({
        message: "Please select a main image for your product",
        duration: 3000,
        header: "Validation Error",
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    else if (this.imagesPreviewArray.length < 1) {

      this.toastController.create({
        message: "Please select at least one(1) other image for your product",
        duration: 3000,
        header: "Validation Error",
        color: 'danger',
        position: 'top'
      }).then((toast) => {
        toast.present()
      })

      return

    }

    formData.append('productID', formValue.productID);
    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price);
    formData.append('discount_percent', formValue.discount_percent);
    formData.append('discount_price', formValue.discount_price);
    formData.append('quantity', formValue.quantity);
    formData.append('category_id', formValue.category_id);
    formData.append('subcategory_id', formValue.subcategory_id);
    formData.append('location', formValue.location);
    formData.append('Campus', formValue.Campus);
    
    formData.append('image', formValue.image);

    this.imagesPreviewArray.forEach((image:any) => {
      image.public_id && formData.append('images',JSON.stringify(image))
    });

    this.newImagesArray.forEach((image:any) => {
      formData.append('newImages',image)
    });

    formValue.removedImages.forEach((image:any) => {
      formData.append('removedImages',JSON.stringify(image))
    });

    this.store.dispatch(editProduct({formData}))
    
  }


  dismissModal() {
    // this.hasDiscount = false
    // this.campus = false
    this.modalCtrl.dismiss()
  }

  imagesPreviewArray: any
  newImagesArray:any = []

  categoriesAndSubcategories:any

  subCategory:any

  initialSubCategory(){
    this.subCategory = false
    let index = Number(this.editProductForm.get('category_id').value)
    index--
    this.subCategory = this.categoriesAndSubcategories[index].Subcategories
  }

  selectSubCategory(){
    this.editProductForm.get('subcategory_id').setValue('')
    this.subCategory = false
    let index = Number(this.editProductForm.get('category_id').value)
    index--
    this.subCategory = this.categoriesAndSubcategories[index].Subcategories
  }

  ngOnInit() {

    this.store.select('editProduct')
    .subscribe(
      res=>{

        if(res.process && this.submitted){
          this.modalCtrl.dismiss()
          this.store.dispatch(startLoading())
        }

        if(res.success && this.submitted){
          this.store.dispatch(endLoading())
          this.store.dispatch(getUserProducts())

          this.toastController.create({
            message: res.message,
            duration: 5000,
            header: "Product Updated",
            color: 'primary',
            position: 'bottom',
          }).then((toast) => {
            toast.present()
          })

        }

        if(res.failure && this.submitted){
          this.store.dispatch(endLoading())

          this.toastController.create({
            message: res.message,
            duration: 5000,
            header: "Product Update Error",
            color: 'danger',
            position: 'bottom',
          }).then((toast) => {
            toast.present()
          })

        }

      }
    )

    this.product = this.navParams.get('product')

    // console.log(this.product)

    if (this.product.discount_percent > 0) {
        this.hasDiscount = true
        // console.log(this.hasDiscount)
    }

    if (this.product.Campus) {
      this.campus = true
    }

    this.editProductForm.setValue({
      productID : this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      discount_percent: this.product.discount_percent,
      discount_price: this.product.discount_price,
      quantity: this.product.quantity,
      image: this.product.image,
      images: this.product.images,
      category_id: this.product.category_id,
      subcategory_id: this.product.subcategory_id,
      location: this.product.location,
      Campus: this.product.Campus,
      removedImages: ''
    });

    this.imagePreview = this.editProductForm.get('image').value.url

    this.imagesPreviewArray = JSON.parse(JSON.stringify(this.editProductForm.get('images').value))

    if(this.imagesPreviewArray){
      setTimeout(() => {
        let otherimages = document.querySelector('.otherimages') as HTMLElement
        let masonry = new Masonry(otherimages, {
          itemSelector: '.otherImagesPreview'
        })
      }, 500);
    }


    // Getting all avialable categories and subcategories
    this.productsService.getCategoriesAndSubCategoies()
    .pipe(take(1))
    .subscribe(
      (res) => {

        this.categoriesAndSubcategories = res

        this.initialSubCategory()

      },
      (err) => {

        console.log(err)

      })


  }

  ngOnDestroy() {
    // perform any cleanup tasks here
  }

}
