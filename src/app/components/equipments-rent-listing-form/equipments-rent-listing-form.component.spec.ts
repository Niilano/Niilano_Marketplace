import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentsRentListingFormComponent } from './equipments-rent-listing-form.component';

describe('EquipmentsRentListingFormComponent', () => {
  let component: EquipmentsRentListingFormComponent;
  let fixture: ComponentFixture<EquipmentsRentListingFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentsRentListingFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentsRentListingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
