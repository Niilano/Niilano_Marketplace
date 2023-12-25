import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { UserMessagesService } from 'src/app/services/userMessages/user-messages.service';
import { WebSocketServiceService } from 'src/app/services/web-socket-service.service';
import { getUserMessages } from 'src/app/store/getUserMessages/userMessages.action';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { AppState } from 'src/app/types/AppState';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  handleRefresh(event: any) {
    // do some work to refresh the content here
    // ...

    // let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    // refreshertext.style.color = "#000"

    location.reload()

    // when the refresh is complete, call the complete() method
    setTimeout(() => {

      event.target.complete();

    }, 1500);
  }

  chats: any

  back() {
    // this.messageRead = false
    this.router.navigate(['messages'], { replaceUrl: true })
  }


  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  selectedUser = false
  selectedUserMessages: any

  formatTimestamp(isoString: string): string {
    const now = new Date();
    const timestamp = new Date(isoString).getTime();
    const elapsed = now.getTime() - timestamp;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (elapsed < minute) {
      return 'Just now';
    } else if (elapsed < hour) {
      const minutes = Math.floor(elapsed / minute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (elapsed < day) {
      const hours = Math.floor(elapsed / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (elapsed < 2 * day) {
      return 'Yesterday';
    } else if (elapsed < week) {
      const days = Math.floor(elapsed / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const date = new Date(timestamp);
      return date.toLocaleString();
    }
  }

  content = ""

  addChat(messageToId: number) {

    let content

    if (localStorage.getItem("chatSellerMessageContent")) {
      content = localStorage.getItem("chatSellerMessageContent")
      localStorage.removeItem("chatSellerMessageContent")
      this.store.dispatch(startLoading())
    }
    else {
      content = this.content
    }

    const messageObj = {
      content: content,
      to: messageToId
    };

    const messageJSON = JSON.stringify(messageObj);
    this.websocketservice.sendMessage(messageJSON)
    this.content = ""

    // this.http.post(`${environment.server}/messaging/send`, { to: messageToId, content: content })
    //   .pipe(take(1))
    //   .subscribe(
    //     res => {
    //       this.content = ""
    //       this.store.dispatch(getUserMessages())
    //       this.store.dispatch(endLoading())
    //     },
    //     err => {

    //     }
    //   )

  }

  totalUnreadMessages = 0

  selectedUserId = 0

  viewMessage(userId: number) {

    // location.replace(`/messages/${userId}`)

    this.router.navigate([`/messages/${userId}`], { replaceUrl: true });
  }


  constructor(private activeRoute: ActivatedRoute, private router: Router, private userMessagesService: UserMessagesService, private store: Store<AppState>, private http: HttpClient, private websocketservice: WebSocketServiceService) { }

  messageRead = false

  newChat = false

  ngOnInit() {

    this.activeRoute.params
      .subscribe(async params => {

        let chatslist = document.getElementById('chatslist') as HTMLElement
        let chats = document.getElementById('chats') as HTMLElement

        if (!params["chat"]) {
          this.selectedUser = false
          this.selectedUserId = 0

          chatslist?.classList.remove('d-none')
          chats?.classList.add('d-none')
        }

        else {
          this.selectedUser = true
          this.selectedUserId = params["chat"]
        }

      })

    this.websocketservice.message$
      .subscribe(
        res => {
          // console.log(res)

          if (res) {
            this.totalUnreadMessages = res.totalUnreadMesages
            this.chats = res.usersMessages
          }

          if (this.selectedUserId != 0) {

            this.store.dispatch(startLoading())

            if (localStorage.getItem("chatSellerMessageContent")) {
              this.addChat(this.selectedUserId)
            }

            this.selectedUserMessages = this.chats.find((chat: { id: any; }) => (chat.id == this.selectedUserId))


            if (!this.selectedUserMessages) {

              this.newChat = true

              this.http.get<{ usersMessages: any[] }>(`${environment.server}/messaging/messages/user/${this.selectedUserId}`)
                .subscribe(
                  res => {

                    this.selectedUserMessages = res.usersMessages[0]

                    // console.log("u", res.usersMessages[0])

                  }
                )

            }

            // console.log('selected messages', this.selectedUserMessages)

           if(this.selectedUserMessages){
            this.selectedUserMessages.messages.forEach((element: any) => {

              if(element.read == false && element.from == this.selectedUserId){
                
                this.http.get(`${environment.server}/messaging/messages/read/${this.selectedUserMessages.id}`)
                .subscribe(res => {
                  // this.store.dispatch(getUserMessages())
                  // element.read = true
                  this.selectedUserMessages.unreadMessages = this.selectedUserMessages.unreadMessages - 1
                })
                // return
              }

            });
           }


            if (window.innerWidth <= 767) {

              setTimeout(() => {

                let chatslist = document.getElementById('chatslist') as HTMLElement
                let chats = document.getElementById('chats') as HTMLElement

                chatslist.classList.add('d-none')
                chats.classList.remove('d-none')

              }, 500);

            }

            this.store.dispatch(endLoading())


          }

        },
        error => {
          console.error('WebSocket error:', error);
        }
      )

    // this.store.select("getUserMessages")
    //   .subscribe(
    //     res => {

    //       if (res.success) {

    //         this.totalUnreadMessages = res.totalUnreadMesages
    //         this.chats = JSON.parse(JSON.stringify(res.userMessages))

    //         console.log(this.selectedUserId)

    // if (this.selectedUserId != 0) {

    //   this.store.dispatch(startLoading())

    //   if (localStorage.getItem("chatSellerMessageContent")) {
    //     this.addChat(this.selectedUserId)
    //   }

    //   this.selectedUserMessages = this.chats.find((chat: { id: any; }) => (chat.id == this.selectedUserId))

    //   if (!this.selectedUserMessages) {

    //     this.http.get<{ usersMessages: any[] }>(`${environment.server}/messaging/messages/user/${this.selectedUserId}`)
    //       .subscribe(
    //         res => {
    //           this.selectedUserMessages = res.usersMessages[0]

    //         }
    //       )

    //   }

    //   this.selectedUserMessages.messages.forEach((element: any) => {

    //     if(element.read == false && element.from == this.selectedUserId){
    //       this.http.get(`${environment.server}/messaging/messages/read/${this.selectedUserMessages.id}`)
    //       .subscribe(res => {
    //         this.store.dispatch(getUserMessages())
    //       })
    //       return
    //     }

    //   });


    //   if (window.innerWidth <= 767) {

    //     setTimeout(() => {

    //       let chatslist = document.getElementById('chatslist') as HTMLElement
    //       let chats = document.getElementById('chats') as HTMLElement

    //       chatslist.classList.add('d-none')
    //       chats.classList.remove('d-none')

    //     }, 500);

    //   }

    //     this.store.dispatch(endLoading())


    // }

    //       }

    //       if (res.fail) {
    //         this.totalUnreadMessages = 0
    //       }

    //     }
    //   )



  }

  // ionViewDidLeave() {
  //   // this.messageRead = false
  // }

  ngAfterViewInit() {



  }

}
