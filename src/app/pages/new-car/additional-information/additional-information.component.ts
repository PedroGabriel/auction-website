import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';
@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styles: [`
    form {
      width:100%;
      position:relative;
    }
    .ng-touched.ng-invalid {
      border-color:red;
    }
    button[disabled] {
      opacity:.6
    }
    .validation-errors {
      width: 100%;
      padding: 10px;
    }
    .error-message {
          color: red;
    font-size: 12px;
    text-align:right;
    }
    .errorBox {
    margin: 10px;
    padding: 10px;
    border: 1px solid #f05b7a;
    border-radius: 4px;
    color: #f05b7a;
    background: #ffe6eb;
    }
    blockquote.comments {
      padding: 10px 15px;
    border: 2px solid #eee;
    border-radius: 5px;
    color: #616161;
    font-size: 13px;
    line-height: 24px;
    }
    h5 {
    font-size: 14px;
    font-weight: bold;
    color: #666666;
    }
    `]
})
export class NewCarAdditionalInformationComponent implements OnInit, AfterViewInit {
  listing: string; // param
  listingObject: any;
  user: any;
  description: any;
  submitted = false;
  showForm = false;
  showFormError = false;
  detail: any;


  editListingsForm: FormGroup;
  isLoading: boolean;
  validationMsg: any;
  tinyMceSettings: any = {
    skin_url: '/assets/tinymce/skins/ui/oxide',
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    height: 250,
    menubar: false,
    plugins: 'fullscreen',
    toolbar: 'undo redo | bold italic'
  };


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService
  ) {
    this.editListingsForm = this.formBuilder.group({
      description: ['', Validators.required],
      fuelType: ['', Validators.required],
      gearbox: ['', Validators.required],
      transmission: ['', Validators.required],
      engineSize: ['', Validators.required],
      cylinders: ['', Validators.required],
      engineTopSpeed: ['', Validators.required],
      engineTopSpeedUnits: ['', Validators.required],
      // engineHorsepower: ['', Validators.required],
      // engineTorque: ['', Validators.required],
      // mphAcceleration: ['', Validators.required],
      // kmhAcceleration: ['', Validators.required],
      seatsMaterial: ['', Validators.required],
      exteriorColorCode: ['', Validators.required],
      trimColorCode: ['', Validators.required],
      // country: ['', Validators.required],
      factoryOptions: ['', Validators.required],
      modifications: ['', Validators.required],
      watchout: ['', Validators.required],
      majorIssues: [],
      knownIssues: []

      // "trimColorCode": "93C52D",
      // "mileageUnit": "km",
      // "engineTopSpeed": 200,
      // "engineTopSpeedUnits": "km/h",
      // "engineTorque": 400,
      // "mphAcceleration": 2,
      // "kmhAcceleration": 3,
      // "interior": "interior",
      // "country": "USA",
      // "modifications": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      // "watchout": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    });
    this.validationMsg = {
      'description': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'fuelType': [
        {
          type: 'required',
          message: 'This field is required'
        }], 
      'gearbox': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'transmission': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'engineSize': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'cylinders': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'engineTopSpeed': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'engineTopSpeedUnits': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      // 'engineHorsepower': [
      //   {
      //     type: 'required',
      //     message: 'This field is required'
      //   }],
      // 'engineTorque': [
      //   {
      //     type: 'required',
      //     message: 'This field is required'
      //   }],
      // 'mphAcceleration': [
      //   {
      //     type: 'required',
      //     message: 'This field is required'
      //   }],
      // 'kmhAcceleration': [
      //   {
      //     type: 'required',
      //     message: 'This field is required'
      //   }],
      'seatsMaterial': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'exteriorColorCode': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'trimColorCode': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      // 'country': [
      //   {
      //     type: 'required',
      //     message: 'This field is required'
      //   }],
      'factoryOptions': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'modifications': [
        {
          type: 'required',
          message: 'This field is required'
        }],
      'watchout': [
        {
          type: 'required',
          message: 'This field is required'
        }]
    };
  }

  ngOnInit() {
    this.isLoading = false;
    this.activatedRoute.params.subscribe(params => {
      this.listing = params['listing'];
      this.getListing();
    });
  }
  ngAfterViewInit() {
    if (this.listing) {
      this.getListing();
    }
  }
  getListing() {
    this.listingsService
      .get(this.listing, true)
      .subscribe((listing: any) => {
        this.detail = listing;

        this.editListingsForm.patchValue({
          description: listing.description,
          fuelType: listing.fuelType,
          gearbox: listing.gearbox,
          transmission: listing.transmission,
          engineSize: listing.engineSize,
          cylinders: listing.cylinders,
          engineTopSpeed: listing.engineTopSpeed,
          engineTopSpeedUnits: listing.engineTopSpeedUnits,
          seatsMaterial: listing.seatsMaterial,
          exteriorColorCode: listing.exteriorColorCode,
          trimColorCode: listing.trimColorCode,
          factoryOptions: listing.factoryOptions,
          knownIssues: listing.knownIssues,
          majorIssues: listing.majorIssues,
          modifications: listing.modifications,
          watchout: listing.watchout
        });

      });
  }
  onChange(evt?: Event) {

  }
  range = (start: number, stop: number, step: number = 1) =>
    Array(Math.ceil((stop + 1 - start) / step))
      .fill(start)
      .map((x, y) => x + y * step)
      .reverse()

  editListing() {
    const data = this.editListingsForm.value;
    data['registerStep'] = 'gallery';

    this.isLoading = true;
    this.listingsService
      .edit(this.listing, data)
      .subscribe((response: object) => {
        this.isLoading = false;
        if (response && response['_writeTime']) {
          this.router.navigate(['/new-car/gallery/' + this.listing], { replaceUrl: true });
        }
      });
  }

  finalizeForm(clear?: boolean) {

    const requiredSteps: any = [
      'description',
      'fuelType',
      'gearbox',
      'transmission',
      'engineSize',
      'cylinders',
      'engineTopSpeed',
      'engineTopSpeedUnits',
      // 'engineHorsepower',
      // 'engineTorque',
      // 'mphAcceleration',
      // 'kmhAcceleration',
      'seatsMaterial',
      'exteriorColorCode',
      'trimColorCode',
      // 'country',
      'factoryOptions',
      'modifications',
      'watchout'
    ];
    let count = 0;

    if (this.editListingsForm.invalid) {
      Object.keys(this.editListingsForm.controls).forEach(key => {

        const controlErrors: ValidationErrors = this.editListingsForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            this.editListingsForm.controls[key].markAsTouched();
            for (const item of requiredSteps) {
              if (item === key) {
                count++;
              }
            }
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      if (this.editListingsForm.valid) {
        this.submitted = true;
        this.editListing();
      } else {
        this.showFormError = true;
      }
    } else {
      this.submitted = true;
      this.editListing();
    }

    // this.isLoading = false;
    // this.editListingsForm.markAsPristine();
    // if (clear) {
    //   this.editListingsForm.reset();
    // }
  }
}
