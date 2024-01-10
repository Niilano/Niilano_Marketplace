import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserMessagesService {

  getUserMessages():Observable<{message:string,usersMessages:[],totalUnreadMessages:number}>{
    
      return new Observable((observer)=>{
        this.http.get<{message:string,usersMessages:[],totalUnreadMessages:number}>(`${environment.server}/messaging/messages`)
        .pipe(take(1))
        .subscribe(async(res)=>{
          observer.next({message:res.message,usersMessages:res.usersMessages,totalUnreadMessages:res.totalUnreadMessages})
          observer.complete()
        },(err)=>{
          observer.error({message:err.error.message})
          observer.complete()
        })
    
      })
    
  }

  constructor(private http:HttpClient) {
  }
}
