import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { BalanceComponent } from 'src/app/components/balance/balance.component';
import { DisplayImageModalComponent } from 'src/app/components/display-image-modal/display-image-modal.component';
import { EditProfileComponent } from 'src/app/components/editprofile/editprofile.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { SupportComponent } from 'src/app/components/support/support.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserprofileService } from 'src/app/services/userprofile/userprofile.service';
import { checkLogin } from 'src/app/store/checkLogin/checklogin.actions';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  coverImageUrl = 'https://images.pexels.com/photos/3906110/pexels-photo-3906110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  profileImageUrl: any = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor(private modalCtrl: ModalController, private userProfileService: UserprofileService, private actionSheetCtrl: ActionSheetController,private router : Router,private http:HttpClient,private store:Store<AppState>,private toastController:ToastController,private actionSheetController:ActionSheetController,private authService:AuthService) { }

  viewImage: any

  removedImages: any

  removeProfileImage = false

  newProfileImage: any

  modifyImageUrl(url: string): string {
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

    return url;
}

  onChangeProfileImage(event: any) {

    const file = event.target.files[0];;
    if (file.type.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {

      if (!this.removeProfileImage) {
        this.removedImages = this.user.user_profile
        this.removeProfileImage = true
      }

      this.newProfileImage = file

      this.profileImageUrl = reader.result;

      this.viewImage = { image: "New Image", url: this.profileImageUrl }
      let openmodal = document.querySelector("span#open-view-changed-profile-image-modal") as HTMLElement
      openmodal.click()

      // const modal = await this.modalCtrl.create({
      //   component: DisplayImageModalComponent,
      //   showBackdrop: true,
      //   componentProps : {imageUrl:this.profileImageUrl}
      // });
      // return await modal.present();

    };

  }

  onSaveNewProfileImage() {

    this.modalCtrl.dismiss()

    this.store.dispatch(startLoading())

    let formData = new FormData()

    formData.append('image',this.newProfileImage)

    formData.append("removedImage",JSON.stringify(this.removedImages))

    this.http.post<{message:string}>(`${environment.server}/users/change-profileimage`,formData)
    .pipe(take(1))
    .subscribe(
      res=>{
        this.store.dispatch(endLoading())

        this.toastController.create({
          message: res.message,
          duration: 1500,
          header: "Success",
          color: 'primary',
          position: 'top'
        }).then((toast) => {
          toast.present()
        })

        this.store.dispatch(checkLogin())

      },
      err=>{
        this.store.dispatch(endLoading())

        err.error.message && this.toastController.create({
          message: err.error.message,
          duration: 1500,
          header: "Error",
          color: 'danger',
          position: 'top'
        }).then((toast) => {
          toast.present()
        })

      }
    )

    this.removeProfileImage = false
    this.removedImages = ""

  }

  async onProfileImageClick() {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Profile Image',
      buttons: [
        {
          text: 'Change Image',
          role: 'default',
          icon: 'camera',
          handler: () => {
            // do nothing
            let changeProfileImage = document.querySelector("input#changeProfileImage") as HTMLElement
            changeProfileImage.click()
          }
        },
        {
          text: 'View Image',
          role: 'default',
          icon: 'image',
          handler: async () => {

            const modal = await this.modalCtrl.create({
              component: DisplayImageModalComponent,
              showBackdrop: true,
              componentProps : {imageUrl:this.user.user_profile.url}
            });
            return await modal.present();

          }
        },
        {
          text: 'Remove Image',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            // do something

            this.store.dispatch(startLoading())

            this.http.post<{message:string}>(`${environment.server}/users/remove-profileimage`,{image:this.user.user_profile})
            .pipe(take(1))
            .subscribe(
              res=>{

                this.store.dispatch(endLoading())

                this.toastController.create({
                  message: res.message,
                  duration: 3500,
                  header: "Success",
                  color: 'primary',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })
        
                this.store.dispatch(checkLogin())

              },
              err=>{

                this.store.dispatch(endLoading())
                
                err.error.message && this.toastController.create({
                  message: err.error.message,
                  duration: 3500,
                  header: "Error",
                  color: 'danger',
                  position: 'top'
                }).then((toast) => {
                  toast.present()
                })

              }
            )

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

  }

  async presentBalanceModal() {
    const modal = await this.modalCtrl.create({
      component: BalanceComponent,
      showBackdrop: true,
      initialBreakpoint: 0.4
    });
    return await modal.present();
  }

  isVerified = false;

  verifyAccount() {
    // Implement account verification logic here
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      showBackdrop: true,
      initialBreakpoint: 1,
      componentProps: { "user": this.user }
    });
    await modal.present();
    await modal.onDidDismiss().then(
      ()=>{
        this.store.dispatch(checkLogin())
      }
    )
  }

  user: any



  redirect(redirect: any) {
    // navigate to the products page
    // const navigationExtras: NavigationExtras = { replaceUrl: true };
    this.router.navigate([redirect]);
  }

  async logout(){
  

    const actionSheet = await this.actionSheetController.create({
      header: 'Confirm Log out',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          // do nothing
        }
      }, {
        text: 'Confirm',
        icon: 'log-out-outline',
        role: 'destructive',
        handler: () => {

          this.store.dispatch(startLoading())

          this.authService.logout()

        }
      }]
    });
    await actionSheet.present();

  }


  ngOnInit() {

    this.store.select('checkLogin')
    .subscribe(
      res=>{

        if(res.loggedIn){
          this.user = res.profile
        }

        if(!res.loggedIn){
          this.user = false
        }

      }
    )

  }

  async openSettingsModal(){
    
    const modal = await this.modalCtrl.create({
      component: SettingsComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  async openSupportModal(){
    
    const modal = await this.modalCtrl.create({
      component: SupportComponent,
      showBackdrop: true,
    });
    return await modal.present();
  }

  handleRefresh(event:any) {
    // do some work to refresh the content here
    // ...

    //let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    //refreshertext.style.color = "#000"

    location.reload()
  
    // when the refresh is complete, call the complete() method
    setTimeout(() => {

      event.target.complete();
      
    }, 1500);
  }

}
