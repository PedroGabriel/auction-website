import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from  'ng2-image-compress';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-basic-photo',
  templateUrl: './basic-photo.component.html',
  styles: [`
    .box-upload-image {
      clear:both;
      position:relative;
      display:block;
      margin:25px auto;
    }
    .uploadimages h2 { 
        font-size:1.2rem;
    }
    .uploadimages small {
      margin:15px auto;
      display:block;
      position:relative;
    }
    .btn-upload-photo {
      width:250px;
      font-size:.9rem !important;
      font-weight:bold;
      background-color:#f05b7a;
      border:0px;
      color:white;
      padding:12px 20px;
      border-radius:4px;
      display: block;
      margin: 20px auto;
    }
    .box-upload-eventos {
      background-color: #fafafa;
      padding: 10px;
      font-size: .8rem;
      border: 1px solid #ddd;
    }
    .box-upload-eventos li {
      list-style:none;
    }
    .thumb-upload {
      max-width:90%;
      margin:auto;
    }
    .thumb-box {

    width: 230px;
    height: 230px;
    display: flex; 
    margin: 5px;
    position: relative;
    vertical-align: middle;
    justify-content: center;
    overflow:hidden; 
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius:4px;
    }
    .thumb-group {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: wrap;
    }
    .btn-erase {
      position: absolute;
      right: 10px;
      top: 10px;
      background-color: #fff !important;
      padding: 0px;
    }
    .btn-erase img {
      height:25px;
    }
  #modalLoading  {
        width: 100%;
    margin: 10px 0;
    opacity: 1;
    border-radius: 3px;
    border: none;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-align: center; 
    text-transform: uppercase;
    padding: 10px 0; 
  }
  #modalLoading .modal-body {
    padding-top:0px;
  } 
  `]
})
export class NewCarBasicPhotoComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;

  isLoading: boolean;
  photos: any;

  selectedImage: any;
  processedImages: any = [];

  fileList : any[] = [];
  invalidFiles : any = [];
  msgEvento:any = [];

  @ViewChild('modalLoading') private modalLoading: any;
  allowed_extensions:any = ['png', 'jpg', 'bmp', 'png', 'gif', 'jpeg'];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private domSanitizer: DomSanitizer,
    private http:HttpClient,
    private modalService: NgbModal,
    private imgCompressService: ImageCompressService
  ) {}

  ngOnInit() {
    this.isLoading = false;
    this.activatedRoute.params.subscribe(params => {
      this.listing = params['listing'];
    });
    this.photos = [];

    this.user = this.authenticationService.user;
    if (this.listing) {
      this.isLoading = true;
      this.listingsService.get(this.listing, true).subscribe((listing:any) => {
        this.isLoading = false;
        this.listingObject = listing;


        if (listing['user']['id'] !== this['user']['id'])
          this.router.navigate(['/new-car/your-listing/'], { replaceUrl: true });

        if(listing != null && listing.approval != undefined) {
        for (let image of listing.approval) {
           this.http.get(image, 
          {responseType: 'blob'}).subscribe((res:any) => {
            console.log(res);
             const reader = new FileReader();
                 reader.readAsDataURL(res); 
                 reader.onloadend = () => {

                    let imgBlob = reader.result;     
                        let    aux:any = {
                              filename: imgBlob['fileName'],
                              size: this.getBase64Size(imgBlob),
                              encoding: 'base64',
                              contentType: imgBlob['type'],
                              content:  (imgBlob).toString().split(',')[1]
                            }; 
                      this.fileList.push(aux);          
                 }

           });
        }
      }

        // if(!this.listingsService.checkState(listing['state'], ['pending']))
        //   this.router.navigate(['/new-car/your-listing/'], { replaceUrl: true });

        // if(this.listingsService.checkRegisterStep(this.listingObject['registerStep'], 'basic-photo'))
        //   this.router.navigate(['/new-car/your-listing/'], { replaceUrl: true });
      });
    }
  }

  changePhotoListener($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file_index: number = inputValue.getAttribute('data-index');
    let file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader['name'] = file.name;
    myReader['type'] = file.type;
    myReader['size'] = file.size;

    myReader.onloadend = e => {
      this.photos[file_index] = {
        filename: myReader['name'],
        encoding: 'base64',
        contentType: myReader['type'],
        content: myReader.result.toString().split(',')[1]
      };
    };
    myReader.readAsDataURL(file);
  }

  submit(content:any, config?:object) {
    if (this.fileList.length < 1) {
      return false;
    }

    this.modalService.open(content, config);
    this.listingsService
      .uploadPhotos(this.listing, 'approval', this.fileList)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: object) => {
        if (response) {
          this.success();
        }
      });
  }

  success() {
    this.listingsService.edit(this.listing, { registerStep: 'waiting-approval', 'state': 'pending' }).subscribe((response: object) => {
      this.modalService.dismissAll();
      this.router.navigate(['/new-car/waiting-approval/' + this.listing], { replaceUrl: true });
    });
  }

  goBack() { 
    this.listingsService.edit(this.listing, { registerStep: 'basic-information' }).subscribe((response: object) => {
      this.modalService.dismissAll();
      this.router.navigate(['/new-car/basic-information/' + this.listing], { replaceUrl: true });
    }); 
  }

  /*
  * Drag n drop
  * 
  * @author gustavoaguiar 
  */

  onFilesChange(file : any  ){ 
    this.addPhoto(file );    
  }
  onFileInvalids(fileList : Array<File>){
    console.log("Alteração de arquivos inválidos", fileList);
    this.invalidFiles = fileList;
  }
  onMsgEvento(msgList : []) {
    this.msgEvento = msgList;
  } 
  uploadFiles(files:any) {  
      let images: Array<IImage> = [];   
      ImageCompressService.filesToCompressedImageSource(files.target.files).then((observableImages:any) => { 
        observableImages.subscribe((image:any) => {  
          images.push(image);
        }, (error:any) => {
          console.log("Error while converting");
        }, () => {
          console.log("Images", images);
          for (var i = 0; i < images.length; i++) {
            let image:any;

            if(images[i].compressedImage != null)
              image = images[i].compressedImage;
            else
              image = images[i];

            let    aux:any = {
                  filename: image['fileName'],
                  size: this.getBase64Size(image['imageDataUrl']),
                  encoding: 'base64',
                  contentType: image['type'],
                  content:  (image['imageDataUrl']).toString().split(',')[1]
                }; 
                this.fileList.push(aux);
          }
                          
        });
      }); 

    // for (var i = 0; i < files.length; i++) {
    //   let file:any = files[i];
    //     let fr:FileReader = new FileReader(); 
    //         fr.readAsDataURL(file);
    //           fr.onloadend = (e) => {  
    //               let auxBase:any = (fr.result);

    //               let aux:any = {
    //                 filename: file['name'],
    //                 size: file['size'],
    //                 encoding: 'base64',
    //                 contentType: file['type'],
    //                 content:  (auxBase).toString().split(',')[1]
    //               };
    //             this.addPhoto(aux, file);
    //           }; 
    // }
  }
  getBase64Size(base:any) {
    let head:string = 'data:image/png;base64,';
    return Math.round((base.length - head.length) * 3 / 4) ;
  }
  addPhoto(file:any  ) { 
    console.log("Adding file", file);
    if(file.size <= 5242880){
       this.fileList.push(file);
    }
    else
      this.msgEvento.push("The photo exceeds 5 MB maximum file size.");
  }
  makeTrustedImage(item:any) {
      const imageString =  JSON.stringify(item).replace(/\\n/g, '');
      const style = 'url(' + imageString + ')';
      return this.domSanitizer.bypassSecurityTrustStyle(style);
    }
    removeImage(index:number) {
      this.fileList.splice(index, 1);
    }
}