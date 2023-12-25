import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth/auth.service';
import { checkLogin } from './store/checkLogin/checklogin.actions';
import { getUserMessages } from './store/getUserMessages/userMessages.action';
import { startLoading } from './store/loading/loading.action';
import { AppState } from './types/AppState';
import {
  DataSharingService,
  ScrollDirection,
} from './services/data-sharing/data-sharing.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription, filter, take, takeUntil } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';
import { WelcomeComponent } from './components/welcome/welcome.component';
import Swiper from 'swiper';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  isDesktop: boolean | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateIsDesktop();
  }

  isLoggedIn: boolean;

  @ViewChild('tabBar', { read: ElementRef })
  tabBar!: ElementRef;

  // Function to toggle the display style
  toggleElementDisplay() {
    const element = this.tabBar.nativeElement as HTMLElement;
    if (element.style.display === 'none') {
      element.style.display = 'flex'; // Change the display style to your preference
    } else {
      element.style.display = 'none';
    }
  }

  constructor(
    private actionSheetController: ActionSheetController,
    private store: Store<AppState>,
    private authService: AuthService,
    private dataSharing: DataSharingService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    if (localStorage.getItem('access_token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    // console.log(this.isDesktop);
  }

  updateIsDesktop() {
    this.isDesktop = window.innerWidth >= 600 ? true : false;
  }

  closed$ = new Subject<any>();
  showTabs = true; // <-- show tabs by default

  async setStatusBar() {
    await StatusBar.setBackgroundColor({ color: '#1A4640' });
    await StatusBar.setStyle({ style: Style.Dark });
    await NavigationBar.setColor({ color: 'black', darkButtons: false });
  }

  async presentWelcomeModal() {
    const modal = await this.modalCtrl.create({
      component: WelcomeComponent,
      initialBreakpoint: 0.75,
      breakpoints: [0.75, 0.8, 0.9, 1],
      showBackdrop: true,
      backdropDismiss: true,
    });
    return await modal.present();
  }

  ngOnInit() {
    // this.presentWelcomeModal()

    this.subscriptions.push(
      this.store.select('register').subscribe((registerState) => {
        if (localStorage.getItem('registered')) {
          localStorage.removeItem('registered');
          this.presentWelcomeModal();
        }
      })
    );

    this.setStatusBar();

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.closed$)
      )
      .subscribe((event: any) => {
        if (
          event['url'] === '/auth?page=register' ||
          event['url'] === '/auth?page=login' ||
          event['url'].startsWith('/product-details') ||
          event['url'].startsWith('/rent-items-details') ||
          event['url'].startsWith('/service-detail') ||
          event['url'].startsWith('/list' ||
          event['url'] === '/my-products')
        ) {
          this.showTabs = false; // <-- hide tabs on specific pages
          // const element = this.myElement.nativeElement as HTMLElement;
          // element.style.display = 'none';
        } else {
          this.showTabs = true;
        }
      });

    this.updateIsDesktop();
    this.store.dispatch(checkLogin());
    // this.store.dispatch(getUserMessages());

    this.store.select('checkLogin')
    .pipe(take(1))
    .subscribe((res) => {
      this.isLoggedIn = res.loggedIn;
    });

  }

  ngAfterViewInit() {
    // Subscribe to scroll events in ngAfterViewInit
    // this.subscriptions.push(
    //   this.dataSharing.scrollEnded$.subscribe((direction) => {
    //     const element = this.tabBar.nativeElement as HTMLElement;
    //     element.style.display = 'none';
    //     // console.log('scrolling down');
    //   })
    // );

    // this.subscriptions.push(
    //   this.dataSharing.scrollStarted$.subscribe((direction) => {
    //     const element = this.tabBar.nativeElement as HTMLElement;
    //     element.style.display = 'flex';
    //     // console.log('scrolling up');
    //   })
    // );
  }

  ngOnDestroy() {
     this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.closed$.next(1); // <-- close subscription when component is destroyed
  }

  async logout() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Confirm Log out',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            // do nothing
          },
        },
        {
          text: 'Confirm',
          icon: 'log-out-outline',
          role: 'destructive',
          handler: () => {
            this.store.dispatch(startLoading());

            this.authService.logout();
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
