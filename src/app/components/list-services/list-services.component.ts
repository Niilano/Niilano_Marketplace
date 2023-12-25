import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { endLoading, startLoading } from 'src/app/store/loading/loading.action';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrls: ['./list-services.component.scss'],
})
export class ListServicesComponent implements OnInit {

  customInterfaceOptions = {
  ios: 'action-sheet',
  md: 'alert'
};


  inputData: any = {
    serviceType: '',
    serviceCategory: '',
    description: '',
    yearsOfExperience: '',
    isCertified: '',
    regCompany: '',
    serviceDelivery: '',
    regionalLocation: '',
    location: '',
    mobile: '',
    price: '',
    priceUnit: '',
    discountPercentage: '',
    mainImage: '',
    mainImagePreview: '',
    additionalImage: '',
    additionalImagePreview: '',
  };

  portfolio: any = [];

  portfolioTitle = '';
  portfolioDes = '';
  portfolioImage = '';
  portfolioImagePreview = '';

  viewPortFolioForm = true;

  showPortfolioFormFunc() {
    this.viewPortFolioForm = !this.viewPortFolioForm;
  }

  async addPortfolio() {
    if (!this.portfolioTitle || !this.portfolioDes) {
      const toast = await this.toastController.create({
        message: 'Please complete the required info for your portfolio',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    }

    this.portfolio.push({
      title: this.portfolioTitle,
      Des: this.portfolioDes,
      image: this.portfolioImage,
      imagePreview: this.portfolioImagePreview,
    });

    this.portfolioTitle = '';
    this.portfolioDes = '';
    this.portfolioImage = '';
    this.portfolioImagePreview = '';

    this.viewPortFolioForm = false;

    // console.log(this.portfolio);
  }

  editingListing = false;

  yearsOfExperience = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+','15+','20+'];

  serviceCategories = [
    'Event planning',
    'Events and Decor',
    'Construction',
    'Computer and Software Repair',
    'IT Support',
    'Web Design and Development',
    'Graphic Design',
    'Printing Services',
    'Photography',
    'Videography',
    'Writing and Editing',
    'Tutoring',
    'Cleaning',
    'Plumbing',
    'Pest Control',
    'Roofing',
    'Beauty Services',
    'Massage therapy',
    'Aluminium fabrication',
    'Fitness Training',
    'Life Coaching',
    'Electrical Work',
    'HVAC Repair',
    'Welding',
    'Catering Services',
    'Legal Services',
    'Financial and Accounting Services',
    'Home Renovation',
    'Landscaping and Garden Services',
    'Interior Design',
    'Car Maintenance and Repair',
    'Pet Services',
    'App Development',
    'Home Appliance Repair',
    'Event Entertainment',
    'Home Inspection',
    'Consultation Services',
    'Translation and Language Services',
    'Marketing and Advertising Services',
    'Personal Styling and Fashion Consultation',
    'Transportation and Delivery Services',
    'Carpet and Upholstery Cleaning',
    'Environmental Services',
];

  sectionTitle = 'Info';

  currentSection = 1;

  totalSections = 5;

  async nextSection() {
    if (
      this.currentSection == 1 &&
      (!this.inputData.serviceType ||
        !this.inputData.serviceCategory ||
        !this.inputData.description)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    } else if (
      this.currentSection == 2 &&
      (!this.inputData.yearsOfExperience ||
        !this.inputData.isCertified ||
        !this.inputData.regCompany)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    } else if (
      this.currentSection == 3 &&
      (!this.inputData.serviceDelivery ||
        !this.inputData.regionalLocation ||
        !this.inputData.location ||
        !this.inputData.mobile)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    } else if (
      this.currentSection == 4 &&
      (!this.inputData.price || !this.inputData.priceUnit)
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    }

    this.currentSection++;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Info';
        break;
      case 2:
        this.sectionTitle = 'Experience';
        break;
      case 3:
        this.sectionTitle = 'Location Details';
        break;
      case 4:
        this.sectionTitle = 'Pricing and discounts';
        break;
      case 5:
        this.sectionTitle = 'Your Portfolio';
        break;

      default:
        break;
    }
  }

  prevSection() {
    this.currentSection--;

    switch (this.currentSection) {
      case 1:
        this.sectionTitle = 'Info';
        break;
      case 2:
        this.sectionTitle = 'Experience';
        break;
      case 3:
        this.sectionTitle = 'Location Details';
        break;
      case 4:
        this.sectionTitle = 'Pricing and discounts';
        break;
      case 5:
        this.sectionTitle = 'Your Portfolio';
        break;

      default:
        break;
    }
  }

  async uploadPortfolioImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.portfolioImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.portfolioImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadAdditionalImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.inputData.additionalImage = file;
      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.inputData.additionalImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  searchQuery = '';

  private services: string[] = [];

  async onSubmit() {
    // TODO: Submit the form data to the server
    // Checking if all required fields are filled, except for the optional additionalImage and discount

    if (this.portfolio.length < 1) {
      const toast = await this.toastController.create({
        message: 'Add at least one portfolio to this service',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    }

    if (
      !this.inputData.serviceType ||
      !this.inputData.serviceCategory ||
      !this.inputData.description ||
      !this.inputData.yearsOfExperience ||
      !this.inputData.isCertified ||
      !this.inputData.regCompany ||
      !this.inputData.serviceDelivery ||
      !this.inputData.regionalLocation ||
      !this.inputData.location ||
      !this.inputData.mobile ||
      !this.inputData.price ||
      !this.inputData.priceUnit
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in the required fields',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      toast.present();
      return;
    }

    this.closeModal();

    this.store.dispatch(startLoading());

    const formData = new FormData();

    const keysToExclude = ['mainImagePreview', 'additionalImagePreview'];

    // Loop through each property in the inputData and append them to the FormData
    for (const key in this.inputData) {
      if (this.inputData.hasOwnProperty(key) && !keysToExclude.includes(key)) {
        let value = this.inputData[key];
        formData.append(key, value); // Use || '' to handle undefined values
      }
    }

    this.portfolio.forEach((element: any) => {
      formData.append('portfolioImages', element.image);
    });

    const portfolioWithoutImages = this.portfolio.map((item:any) => {
      const { image, imagePreview, ...rest } = item;
      return rest;
    });
    
    formData.append('portfolio', JSON.stringify(portfolioWithoutImages));
    

    this.http
      .post<{ message: string; id: number }>(
        `${environment.server}/services/listService`,
        formData
      )
      .subscribe(
        async (res) => {
          const routePath = '/service-detail';
          const queryParams = { listingId: res.id };
          this.router.navigate([routePath], { queryParams });

          const toast = await this.toastController.create({
            message: res.message,
            duration: 2000,
            position: 'bottom',
            color: 'primary',
          });
          toast.present();

          this.store.dispatch(endLoading());
        },
        async (err) => {
          // console.log(err);
          this.store.dispatch(endLoading());
          const toast = await this.toastController.create({
            message: err.error.message ? err.error.message : 'Error',
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          toast.present();
        }
      );
  }

  isIOSDevice:any

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private store: Store,
    private http: HttpClient,
    private router: Router,
    private platform: Platform
  ) {
    // Load the list of services from a JSON file or database
    this.services = [
      'Web Design',
      'Graphic Design',
      'Photography',
      'Videography',
      'Writing and Editing',
      'Accounting',
      'Advertising',
      'Business Consulting',
    ];

    this.isIOSDevice = this.platform.is('ios')
  }

  getSuggestions(input: string): string[] {
    // Use a fuzzy search algorithm to match the user's input to the list of possible services
    const suggestions = [];
    for (const service of this.services) {
      if (service.toLowerCase().includes(input.toLowerCase())) {
        suggestions.push(service);
      }
    }
    return suggestions;
  }

  ngOnInit() {}
}
