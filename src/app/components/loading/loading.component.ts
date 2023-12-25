import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadingStateInterface } from 'src/app/store/loading/loadingStateInterface';
import { AppState } from 'src/app/types/AppState';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  loadingState$: Observable<loadingStateInterface>

  constructor(private store : Store<AppState>) {
    this.loadingState$ = this.store.select('loading')
   }

  ngOnInit() {}

}
