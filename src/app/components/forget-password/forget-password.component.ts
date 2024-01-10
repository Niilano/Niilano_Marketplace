import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {

  resetPasswordForm!: any

  changePasswordForm!: FormGroup;

  displayResetForm!: boolean;
  resetToken!: string;

  showPassword = false

  constructor(
    // Inject required services and modules for the component
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private http: HttpClient,
    private navParams: NavParams,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  // Method to recreate the modal
  async reCreateModal() {
    const modal = await this.modalController.create({
      component: ForgetPasswordComponent
    });
    await modal.present();
  }

  // Method to dismiss the modal
  dismiss() {
    // If the reset password form is displayed, navigate to the login page
    if (this.displayResetForm) {
      this.router.navigate(['/auth'], { queryParams: { page: 'login' } });
    }
    // Dismiss the modal
    this.modalController.dismiss();
  }

  // Method to handle submission of the reset password form
  submitResetPasswordForm() {

    // Extract email from the form
    const email = this.resetPasswordForm.get('email').value;

    // Dispatch the start loading action
    this.store.dispatch(startLoading())

    // Dismiss the modal
    this.dismiss()

    // Get the main domain of the application
    const mainDomain = `${location.protocol}//${location.hostname}`;

    // Prepare data to send to the server
    const data = {
      email: email,
      mainDomain: mainDomain
    }

    // Send a post request to the server to reset the password
    this.http.post<{ message: string }>(`${environment.server}/users/requestresetpassword`, data)
      .pipe(take(1))
      .subscribe(res => {
        // If there is a message in the response, show it in an alert
        res.message ? this.presentAlert(res.message, '') : ''
        // Dispatch the end loading action
        this.store.dispatch(endLoading())
      }, err => {
        // If there is an error, show it in an alert and recreate the modal
        err.error.message ? this.presentAlert(err.error.message, '') : this.presentAlert("Unable to connect", '')
        this.store.dispatch(endLoading())

        this.reCreateModal()

      })
    // Display success/failure message to user
  }

  resetLinkError!: string;

  httpOptions!: { headers: HttpHeaders };

  ngOnInit() {

    this.displayResetForm = this.navParams.get('displayResetForm');
    this.resetToken = this.navParams.get('token');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.resetToken}`,
        'Content-Type': 'application/json'
      })
    };

    if (this.displayResetForm) {

      this.http.get(`${environment.server}/users/resetpassword/decodejwt`, this.httpOptions)
        .pipe(take(1))
        .subscribe(
          res => {
            // console.log(res)
          },
          err => {
            this.resetLinkError = err.error.message ? err.error.message : "Unable to connect"
          }
        )
    }

    // console.log(this.displayResetForm)

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.changePasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      retypePassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });

  }

  onSubmit() {
    if (this.changePasswordForm.valid) {

      this.dismiss()

      this.store.dispatch(startLoading())

      const data = {
        newPassword: this.changePasswordForm.get('newPassword')?.value
      }

      this.http.post<{ message: string }>(`${environment.server}/users/resetpassword`, data, this.httpOptions)
        .pipe(take(1))
        .subscribe(res => {
          this.presentAlert(res.message, '')
          this.store.dispatch(endLoading())
        }, err => {
          err.error.message ? this.presentAlert(err.error.message, '') : this.presentAlert("Unable to connect", '')
          this.store.dispatch(endLoading())
          this.reCreateModal()
        })

    }
  }

  private checkPasswords(group: FormGroup) {
    const password = group.controls['newPassword'].value;
    const confirmPassword = group.controls['retypePassword'].value;

    return password === confirmPassword ? null : { notSame: true };
  }

  async presentAlert(message: string, icon: string) {
    const alert = await this.alertController.create({
      header: 'Password Reset',
      message: message,
      mode: 'ios',
      backdropDismiss: true,
      buttons: [{
        text: 'OK',
        handler: () => {
          // console.log('OK clicked');
        }
      }],
      animated: true,
      translucent: true
    });

    await alert.present();
  }


}
