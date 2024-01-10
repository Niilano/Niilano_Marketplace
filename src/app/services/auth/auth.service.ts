import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { checkLogin } from 'src/app/store/checkLogin/checklogin.actions';
import { getUserMessages } from 'src/app/store/getUserMessages/userMessages.action';
import { endLoading } from 'src/app/store/loading/loading.action';
import { logout } from 'src/app/store/login/login.action';
import { registrationDetails } from 'src/app/store/register/registrationDetails';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  
login({email,password}:{email:string,password:string}):Observable<{message:string}>{
  return new Observable((observer)=>{
    this.http.post<{accessToken:string,message:string,success:boolean}>(`${environment.server}/users/login`,{email,password})
    .pipe(take(1))
    .subscribe(async(res)=>{
      localStorage.setItem("access_token",res.accessToken)
      observer.next({message:res.message})
      observer.complete()
    },(err)=>{
      observer.error({message:err.error.message})
      observer.complete()
    })

  })
}


  register(registrationDetails:registrationDetails):Observable<{message:string}>{
    console.log(registrationDetails)
    return new Observable((observer)=>{
      this.http.post<{accessToken:string,message:string,success:boolean}>(`${environment.server}/users/register`,registrationDetails)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message})
        observer.complete()
      },(err)=>{
        observer.error({message:err.error.message})
        observer.complete()
      })

    })
  }

  async logout(){

    this.menuController.close()

    // Remove any user data or tokens from storage
    localStorage.removeItem('access_token');

    this.store.dispatch(logout())

    this.toastController.create({
      message: "Logout Successfull.",
      duration: 2000,
      color: 'dark',
      position: 'bottom'
    }).then((toast) => {
      toast.present()
    })

    this.store.dispatch(checkLogin())

    this.store.dispatch(getUserMessages())

    // if(this.router.url == '/home'){
    //   location.reload()
    //   return
    // }

    this.navController.navigateRoot('/home');

    this.store.dispatch(endLoading())

  }


  recoverPassword({email}:{email:string}){
    const mainDomain = window.location.origin;

    return this.http.post(`${environment.server}/users/requestresetpassword`,{email,mainDomain})
  }


  constructor(private http:HttpClient,private navController:NavController,private router:Router,private store:Store<AppState>,private toastController:ToastController,private menuController:MenuController) {
    
   }
}
