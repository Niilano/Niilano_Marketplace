import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  myProfile(): Observable<{ profile: any }> {
    return new Observable(observer => {

      this.http.get<{ profile: any }>(`${environment.server}/users/user-profile`)
        .pipe(take(1))
        .subscribe(async (res) => {
          // Filter following and followers arrays to remove objects with status = 'inactive'
          res.profile.following = res.profile.following.filter((obj:any) => obj.status !== 'inactive');
          res.profile.followers = res.profile.followers.filter((obj:any) => obj.status !== 'inactive');
          
          observer.next({ profile: res.profile })
          observer.complete()
        }, (err) => {
          observer.error({ message: err.error.message })
          observer.complete()
        })

    })
  }

  follow(followingId:number): Observable<{msg:string}> {
    return new Observable(observer => {

      this.http.get<{msg:string}>(`${environment.server}/users/follow/${followingId}`)
        .pipe(take(1))
        .subscribe(async (res) => {
          observer.next({ msg: res.msg })
          observer.complete()
        }, (err) => {
          observer.error({ msg: err.error.msg })
          observer.complete()
        })

    })
  }

  constructor(private http: HttpClient) {

    // this.follow(2)
    // .subscribe(
    //   res=>{
    //     console.log(res)
    //   }
    // )


  }
}
