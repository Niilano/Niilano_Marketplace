import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selectlocation',
  templateUrl: './selectlocation.component.html',
  styleUrls: ['./selectlocation.component.scss'],
})
export class SelectlocationComponent implements OnInit {

  title = "Select Region"

  filteredRegions:any = []

  @Input() regions:any = []

  @Output() modalClose = new EventEmitter<void>();
  @Output() confirmChanges: any = new EventEmitter<string>();

  selectedRegion = false
  regionSelected:any = []

  closeModal() {
    this.modalClose.emit();
  }

  filterRegions(ev:any){
    let value = ev.target.value;
    if (value === undefined) {
      this.filteredRegions = this.regions;
    } else {
      this.filteredRegions = this.regions.filter((cat: any) =>
        cat.region.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filterCities(ev:any){
    let value = ev.target.value;
    if (value === undefined) {
      this.filteredCities = this.regionSelected.cities;
    } else {
      this.filteredCities = this.regionSelected.cities.filter(
        (city: string) => city.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  filteredCities:any

  selectRegion(region:string){
    if (region) {
      this.selectedRegion = true;
      this.regionSelected = this.regions.find((reg: any) => reg.region === region);
      this.filteredCities = this.regionSelected.cities;
      this.title = 'Select City / Town';
    }
  }

  selectedCity = ''

  checkCity(ev:any){

    const { checked, value } = ev.detail;

    if (checked) {
      this.selectedCity = value

      let location = `${this.regionSelected.region} Region, ${value}`
  
      this.confirmChanges.emit(location);

    } else {
      this.selectedCity = ""
    }

  }

  isChecked(city:string){}

  backSelection() {
    this.selectedRegion = false;
    this.regionSelected = '';
    this.filteredCities = '';
    this.title = 'Select Region';
    // this.workingSelectedValues = [];
  }

  constructor() { }

  ngOnInit() {
    this.filteredRegions = this.regions
    // console.log(this.filteredRegions)
  }

}
