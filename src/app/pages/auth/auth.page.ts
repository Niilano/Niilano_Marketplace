import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
  ToastController,
  isPlatform,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { ForgetPasswordComponent } from 'src/app/components/forget-password/forget-password.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { checkLogin } from 'src/app/store/checkLogin/checklogin.actions';
import { getUserMessages } from 'src/app/store/getUserMessages/userMessages.action';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { login } from 'src/app/store/login/login.action';
import { register, resetRegistrationStateValues } from 'src/app/store/register/register.action';
import { getUserProducts } from 'src/app/store/userProducts/userproducts.actions';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { getProductsSummary } from 'src/app/store/productsSummary/productsSummary.action';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  private subscriptions: Subscription[] = [];

  user: any;

  pageTitle = 'auth';

  // This stores the tab / section to show whether login / signup
  selectedTab:any

  // This stores the current registration section a user is currently on
  currentRegSection = 1;

  nextRegSection() {
    this.currentRegSection++;
  }

  prevRegSection() {
    this.currentRegSection--;
  } 

  handleRefresh(event: any) {
    // do some work to refresh the content here

    location.reload();

    // when the refresh is complete, call the complete() method
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  navigateBack() {
    this.navCtrl.back();
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  trimLoginEmail() {
    // Trimming login email to exclude spaces
    const emailFormControl = this.loginForm.get('email');
    emailFormControl?.setValue(emailFormControl.value.trim());
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(
      login({
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      })
    );
  }

  registerForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      this.matchPasswords.bind(this),
    ]),
    user_profile: new FormControl(''),
  });

  matchPasswords(control: AbstractControl): { [key: string]: any } | null {
    const password = control.root.get('password');
    const confirmPassword = control.value;

    if (password && confirmPassword !== password.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  showPassword = false;

  trimEmail() {
    // Trimming registration email to exclude spaces
    const emailFormControl = this.registerForm.get('email');
    emailFormControl?.setValue(emailFormControl.value.trim());
  }

  async presentTermsAndConditionsAlert() {
    // This method presents the terms and conditions to new users befor proceeding with registration.

    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      // console.log('invalid');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Terms of Service',
      message:
        'By registering you agree to our <a id="termsLink" class="terms-link" >terms of service</a>.',
      buttons: [
        {
          text: 'Decline',
          role: 'cancel',
          handler: () => {
            this.toastController
              .create({
                message:
                  'You must accept our terms of service before proceding with registration.',
                duration: 1500,
                header: 'Registration Declined',
                color: 'danger',
                position: 'bottom',
              })
              .then((toast) => toast.present());
          },
        },
        {
          text: 'Agree',
          handler: () => {
            // Perform register action here
            this.register();
          },
        },
      ],
    });

    await alert.present();

    // Add onclick event listener to the terms of service link
    let termsLink = document.getElementById('termsLink') as HTMLElement;

    termsLink.onclick = () => {
      alert.dismiss();
      this.router.navigate(['tos']);
    };
  }

  register() {
    this.store.dispatch(
      register({ registrationDetails: this.registerForm.value })
    );
  }

  authPageChange(page: string) {
    this.router.navigate(['/auth'], { queryParams: { page: page } });
  }

  currentRoute: any;

  navigationExtras: NavigationExtras = {
    replaceUrl: true,
  };

  toHome() {
    this.router.navigate(['home'],this.navigationExtras);
  }

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private menuController: MenuController,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private http: HttpClient,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {

    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
  }

  // Process to signup using google

  // googleSignUpRequireMobileNumberModalOpen = false;
  // googleSignUpMobileNumberInput = null;
  // googleRegistrationSubmit = false;

  async googleSignup() {
    this.user = await GoogleAuth.signIn();

    if (this.user) {
    //   this.googleSignUpRequireMobileNumberModalOpen = true;
    this.googleRegistration()
    }
  }

  googleRegistration() {
    // this.googleRegistrationSubmit = true;

    // set the form fields with the user data from google

    // Update the form values with Google information
    this.registerForm.patchValue({
      first_name: this.user.givenName,
      last_name: this.user.familyName,
      email: this.user.email,
      mobile: 'googleregistration', // Set the mobile number as an empty string initially
      password: 'notApplicable',
      confirmPassword: 'notApplicable',
      user_profile: this.user.imageUrl,
    });

    // console.log(this.registerForm.value);

    // this.googleSignUpRequireMobileNumberModalOpen = false;

    this.presentTermsAndConditionsAlert();
  }

  async googleSignIn() {
    this.user = await GoogleAuth.signIn();

    if (this.user) {
      this.loginForm.patchValue({
        email: this.user.email,
        password: 'notApplicable',
      });

      this.login();
    }
  }

  async presentForgetPasswordModal(display: boolean, token?: string) {
    const modal = await this.modalController.create({
      component: ForgetPasswordComponent,
      componentProps: {
        displayResetForm: display,
        token: token ? token : '',
      },
      showBackdrop: true,
    });
    return await modal.present();
  }

  ionViewWillEnter() {
    if (localStorage.getItem('currentroute')) {
      this.currentRoute = localStorage.getItem('currentroute');
    } else {
      this.currentRoute = 'home';
    }

    this.menuController.close();

    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        if (params['page'] == 'resetpassword' && params['token']) {
          this.presentForgetPasswordModal(true, params['token']);
        }

        this.selectedTab = params['page'];
        // Update the view with the new "id" value
      })
    );

    this.subscriptions.push(
      this.store.select('login').subscribe(
        async (loginState) => {
          if (loginState.isLogingIn) {
            this.store.dispatch(startLoading());
          }
          if (loginState.isLogedIn) {
            // console.log("Still working")
            this.store.dispatch(endLoading());

            // !localStorage.getItem('registered') &&
            this.toastController
              .create({
                message: loginState.message,
                duration: 1500,
                header: 'Login Successful',
                color: 'primary',
                position: 'bottom',
              })
              .then((toast) => toast.present());

            this.store.dispatch(getUserMessages());

            this.store.dispatch(checkLogin());

            this.store.dispatch(getUserProducts());

            if (this.currentRoute.includes('?')) {
              location.assign(this.currentRoute);
            } else {
              this.router.navigate([this.currentRoute],this.navigationExtras);
            }

            localStorage.removeItem('currentroute');

            this.store.dispatch(getProductsSummary())

            // localStorage.getItem('registered') &&
            //   localStorage.removeItem('registered');

              this.loginForm.reset()
          }
          if (loginState.isLogingInFailure) {
            this.store.dispatch(endLoading());
            this.toastController
              .create({
                message: loginState.message,
                duration: 4000,
                header: 'Login Failed',
                color: 'danger',
                position: 'top',
                mode: 'ios',
              })
              .then((toast) => toast.present());
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );

    this.subscriptions.push(
    this.store.select('register').subscribe((registerState) => {
        if (registerState.registering) {
          this.store.dispatch(startLoading());
        }

        if (registerState.registered) {
          console.log("Registration own still working...")
          this.store.dispatch(endLoading());

          localStorage.setItem('registered', 'true');

          this.store.dispatch(resetRegistrationStateValues())

          this.toastController
            .create({
              message: registerState.message,
              duration: 1500,
              header: 'Registration Successful',
              color: 'success',
              position: 'top',
            })
            .then((toast) => toast.present());

          this.store.dispatch(
            login({
              email: this.registerForm.get('email')?.value,
              password: this.registerForm.get('password')?.value,
            })
          );

          this.registerForm.reset();
        }

        if (registerState.registrationFail) {
          this.store.dispatch(endLoading());
          this.toastController
            .create({
              message: registerState.message,
              duration: 3000,
              header: 'Registration Failed',
              color: 'danger',
              position: 'bottom',
            })
            .then((toast) => toast.present());
          // this.registerForm.reset()
        }
      })
    )
  }

  ionViewDidLeave() {
    // Unsubscribe from all the subscriptions when the component is destroyed
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

  }

  ngOnDestroy(){
    // console.log('Destroyed');
  }
}
