import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  private socket!: WebSocket;
  totalUnreadMessages: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public message$: Observable<any> = this.messageSubject.asObservable();

  connect() {
    this.socket = new WebSocket(`${environment.wsServer}?token=${localStorage.getItem('access_token')}`);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      this.totalUnreadMessages.next(data.totalUnreadMessages)
      console.log(data);
      this.messageSubject.next(data); // Emit the received data
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  constructor() {
    // this.connect()
   }
}
