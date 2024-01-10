import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserprofileService } from 'src/app/services/userprofile/userprofile.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user: any

  isFollowing = false

  currentUserId!: number;

  username!: any

  constructor(private route: ActivatedRoute, private http: HttpClient, private titleService: Title, private metaService: Meta, private toastController: ToastController, private popoverController: PopoverController, private userProfile: UserprofileService) { }

  ngOnInit() {

    this.username = this.route.snapshot.paramMap.get('username');

    this.viewedUserProfile(this.username)

  }

  viewedUserProfile(username:any){
    this.http.get(`${environment.server}/users/public_profile/${username}`)
    .pipe(take(1))
    .subscribe(
      res => {
        this.user = res

        // Filter following and followers arrays to remove objects with status = 'inactive'
        this.user.following = this.user.following.filter((obj:any) => obj.status !== 'inactive');
        this.user.followers = this.user.followers.filter((obj:any) => obj.status !== 'inactive');

        this.currentUserProfile()

        this.titleService.setTitle(`${this.user.username} - ${this.user.first_name} ${this.user.last_name}`);

        this.metaService.updateTag({ property: 'og:title', content: `${this.user.username} - ${this.user.first_name} ${this.user.last_name}` });
        this.metaService.updateTag({ name: 'twitter:title', content: `${this.user.sername} - ${this.user.first_name} ${this.user.last_name}` });
        this.metaService.updateTag({ property: 'og:description', content: this.user.bio });
        this.metaService.updateTag({ name: 'twitter:description', content: this.user.bio });
        this.metaService.updateTag({ property: 'og:image', content: this.user.user_profile.url });
        this.metaService.updateTag({ name: 'twitter:image', content: this.user.user_profile.url });

      }
    )
  }

  currentUserProfile() {

    this.userProfile.myProfile()
      .pipe(take(1))
      .subscribe(
        async res => {
          this.currentUserId = await res.profile.id
          this.isFollowing = this.user.followers.some((follower: { followerId: number; status: string }) => follower.followerId === this.currentUserId && follower.status === 'active');
        },
        err => {
          console.log(err)
        }
      )

  }


  async followUser() {

    if(!this.currentUserId){

      const toast = await this.toastController.create({
        message: "Please login to follow this user",
        duration: 1500,
        color: 'danger',
        position: 'bottom',
        mode: 'ios'
      });

      await toast.present();

      return

    }

    this.userProfile.follow(this.user.id)
      .pipe(take(1))
      .subscribe(
        async res => {

          this.viewedUserProfile(this.username)

          const toast = await this.toastController.create({
            message: res.msg,
            duration: 1500,
            color: 'dark',
            position: 'bottom',
            mode: 'ios'
          });

          await toast.present();
        },
        async err => {
          console.log(err)

          const toast = await this.toastController.create({
            message: "An error occured",
            duration: 1500,
            color: 'danger',
            position: 'bottom',
            mode: 'ios'
          });

          await toast.present();
        }
      )

  }

  async share(platform: string) {
    // Logic to share content on selected platform

    const username = encodeURIComponent(this.user.username)

    const link = `${window.location.origin}/@/${username}`

    let shareUrl: any;

    const message = encodeURIComponent(`Meet our seller on Niilano! Explore their wide range of products by visiting their profile link.

${link}

#Niilano #${this.user.username} #ShopWithConfidence #OnlineMarketplace #WideRangeOfProducts #ExploreNow`)

    switch (platform) {
      case 'copy':

        // copy the link to the clipboard using the browser API
        try {

          await navigator.clipboard.writeText(message);

          const toast = await this.toastController.create({
            message: 'Link copied!',
            duration: 2000,
            color: 'dark'
          });

          await toast.present();

        } catch (err) {
          console.error('Failed to copy text: ', err);

          const toast = await this.toastController.create({
            color: 'danger',
            message: 'Failed to copy text!',
            duration: 2000
          });
        }

        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${message}`;
        break;

      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${message}`;
        break;

      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${message}`;
        break;

      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }

    await this.popoverController.dismiss();

  }


  handleRefresh(event: any) {
    // do some work to refresh the content here
    // ...

    //let refreshertext = document.querySelector(".refresher-refreshing-text") as HTMLElement

    //refreshertext.style.color = "#000"

    location.reload()

    // when the refresh is complete, call the complete() method
    setTimeout(() => {

      event.target.complete();

    }, 1500);
  }

}
