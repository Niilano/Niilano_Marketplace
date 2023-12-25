import { Injectable, OnDestroy } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { loginSuccess } from '../store/login/login.action';
import { AppState } from '../types/AppState';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad,OnDestroy {

  message(){
    this.toastController.create({
      message:"Please log in...",
      duration:1500,
      color:'danger',
      position : 'bottom'
    }).then(toast=>toast.present())
  }

  constructor(private store : Store<AppState>, private router : Router,private toastController:ToastController) { }

  ngOnDestroy(): void {
    localStorage.removeItem('access_token')
  }


  canLoad() {

    const token = localStorage.getItem('access_token');

    if (!token) {
      this.message();
      this.router.navigateByUrl('home');
      return false;
    }

    // try{

    //   const decoded = jwt_decode(token) as any;

    //   const expirationDate = new Date(0);
    //   expirationDate.setUTCSeconds(decoded.exp);

    //   if (expirationDate < new Date()) {
    //     console.log("Token expired");
    //     // handle token expiration
    //     this.message();
    //     this.router.navigateByUrl('login');
    //     return false;
    //   }
    // }
    // catch{
    //   this.message();
    //     this.router.navigateByUrl('login');
    //     return false;
    // }


      return true;

    
  }
  

}
