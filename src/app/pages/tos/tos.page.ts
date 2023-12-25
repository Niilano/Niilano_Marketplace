import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.page.html',
  styleUrls: ['./tos.page.scss'],
})
export class TosPage implements OnInit {

  dropContent = ''

  dropDown(content:string){
    if(this.dropContent == content){
      this.dropContent = ''
      return
    }
    this.dropContent = content ? content : ''
  }

  constructor() { }

  ngOnInit() {
  }

}
