import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  orderProduct(formData:any):Observable<{message:string,seller:any}>{
    return new Observable((observer)=>{
      this.http.post<{message:string,seller:any}>(`${environment.server}/orders/place-order`,formData)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message,seller:res.seller})
        observer.complete()
      },(err)=>{
        err.error.message && observer.error({message:err.error.message})
        console.log(err)
        // !err.error.message && observer.error({message:err.error.})
        observer.complete()
      })
  
    })
  }

  acceptOrder(orderId:number):Observable<{message:string}>{
    return new Observable((observer)=>{
      this.http.get<{message:string}>(`${environment.server}/orders/accept-order/${orderId}`)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message})
        observer.complete()
      },(err)=>{
        err.error.message && observer.error({message:err.error.message})
        console.log(err)
        // !err.error.message && observer.error({message:err.error.})
        observer.complete()
      })
  
    })
  }


  rejectOrder(orderId:number,reason:string):Observable<{message:string}>{
    return new Observable((observer)=>{
      this.http.get<{message:string}>(`${environment.server}/orders/reject-order/${orderId}/${reason}`)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message})
        observer.complete()
      },(err)=>{
        err.error.message && observer.error({message:err.error.message})
        console.log(err)
        // !err.error.message && observer.error({message:err.error.})
        observer.complete()
      })
  
    })
  }

  confirmOrderDelivered(orderId:number):Observable<{message:string}>{
    return new Observable((observer)=>{
      this.http.get<{message:string}>(`${environment.server}/orders/confirm-order-delivery/${orderId}`)
      .pipe(take(1))
      .subscribe(async(res)=>{
        observer.next({message:res.message})
        observer.complete()
      },(err)=>{
        err.error.message && observer.error({message:err.error.message})
        console.log(err)
        // !err.error.message && observer.error({message:err.error.})
        observer.complete()
      })
  
    })
  }

  constructor(private http:HttpClient) { }
}
