import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private editCompletedSource = new BehaviorSubject<boolean>(false);
  editCompleted$ = this.editCompletedSource.asObservable();

  setEditCompleted(value: boolean) {
    this.editCompletedSource.next(value);
  }

  private scrollStartSource = new Subject<ScrollDirection>();
  private scrollEndSource = new Subject<ScrollDirection>();

  scrollStarted$ = this.scrollStartSource.asObservable();
  scrollEnded$ = this.scrollEndSource.asObservable();

  startScroll(direction: ScrollDirection) {
    this.scrollStartSource.next(direction);
  }

  endScroll(direction: ScrollDirection) {
    this.scrollEndSource.next(direction);
  }

  getUserLocation(): Observable<any> {
    return new Observable((observer) => {
      this.http.get('https://ipinfo.io/?token=24a54d08bbf879')
        .pipe(take(1))
        .subscribe(
          res => {
            observer.next(res)
            observer.complete();
          },
          err=>{
            observer.error(err)
          }
        )
    });
  }

  constructor(private http: HttpClient) { }
}

export enum ScrollDirection {
  Up = 'up',
  Down = 'down',
}