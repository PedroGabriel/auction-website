import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from 'ng2-image-compress';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styles: [`
    .box-upload-image {
      clear:both;
      position:relative;
      display:block;
      margin:25px auto;
    }
    .uploadimage {
      overflow:visible !important;
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
    .thumb-actions {
      display:none;
    }
    .thumb-box:hover:after {
      position:absolute;
      background:rgba(255,255,255,.5);
      top:0px;
      left:0px;
      width:100%;
      height:100%;
      display:block;
      content: '';
      z-index:1;
    }
    .thumb-box:hover  .thumb-actions {
      display:block;
      z-index:5;
    }
    .thumb-box {
      width: 194px;
      height: 194px;
      display: flex;
      margin: 5px;
      position: relative;
      vertical-align: middle;
      justify-content: center;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius:4px;
      cursor:drag;
    }
    .thumb-box-add {
    width: 194px;
    height: 194px;
    display: flex;
    margin: 5px;
    position: relative;
    vertical-align: middle;
    justify-content: center;
    overflow: hidden;
    background-color: #e6e6e9;
    border-radius: 4px;
    align-items: center;
    color: #f05b7a;
    cursor:pointer;
    font-weight: bold;

    flex-direction: column;
    }
    .thumb-box-add i {
      font-size:26px;
    }
    .thumb-group {
          display: flex;
          justify-content: left;
          align-items: center;
          flex-flow: wrap;
    }
    .btn-erase {
      position: absolute;
      right: 10px;
      top: 10px;
      background-color: #fff;
    padding: 0px;
    width: 30px;
    height: 30px;
    border-radius: 0px;
    border:0px;
    }
    .btn-erase span {
      font-size:13px;
    }
    .btn-erase-confirm i {
      margin-left:-5px;
    }
    .btn-erase-confirm {
      background:#f1453e !important;
      width:100px;
      color:white;
    }
    .btn-erase img {
      height:25px;
    }
    .btn-setCover {
    border:0px;
    position: absolute;
    right: 10px;
    top: 50px;
    background-color: #fff !important;
    padding: 0px;
    width: 30px;
    height: 30px;
    border-radius: 0px;
    overflow:hidden;
    }
    .btn-cover{

    float: right;
    height: 30px;
    font-size: 11px;
    border-radius: 4px;
    position: absolute;
    right: 15px;
    top: 15px;
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
  .gallery-cover {

    width: 100%;
    height: 250px;
    display: flex;
    margin: 5px;
    position: relative;
    vertical-align: middle;
    justify-content: center;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
    flex-direction: row;
  }

    .thumb-actions .dropdown {
      position:absolute;
      right:0px;
    }
    .thumb-actions .dropdown-toggle::after {
      display:none !important;
    }
    .thumb-actions .dropdown-menu.show {
    display: block;
    top: 75px !important;
}
    .gallery-cover:hover  .thumb-actions {
      display:block;
      z-index:5;
    }
  a {
    color: white;
    text-decoration: none;
  }
  .catTitle {
    text-transform:capitalize;
  }

  .pics_list {
    background: #ccc;
    border: 1px solid #000;
    width: 200px;
    height: 200px;
    float: left;
    margin: 10px;
  }

  .remove_photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 33px;
    line-height: 33px;
    background-color: #cccc;
    text-align: center;
  }
     .dnd-drag-start {
    -moz-transform:scale(0.8);
    -webkit-transform:scale(0.8);
    transform:scale(0.8);
    opacity:0.7;
    border: 2px dashed #000;
    }

    .dnd-drag-enter {
        opacity:0.7;
        border: 2px dashed #000;
    }

    .dnd-drag-over {
        border: 2px dashed #000;
    }

    .dnd-sortable-drag {
      -moz-transform:scale(0.9);
      -webkit-transform:scale(0.9);
      transform:scale(0.9);
      opacity:0.7;
      border: 1px dashed #000;
    }
  `]
})
export class NewCarGalleryComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;

  currentTab: string;
  isLoading: boolean;
  photos_required: number;

  fileList: any;
  cover: any;
  invalidFiles: any = [];
  msgEvento: any = [];
  removeConfirm: any;
  enableDrag = true;

  showError = false;
  selectedImage: any;
  processedImages: any = [];
  filesQty: number;
  filesUploaded: number;
  categories: any = ['exterior', 'interior', 'underside', 'engine', 'imperfections'];

  @ViewChild('modalLoading') private modalLoading: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private http: HttpClient,
    private imgCompressService: ImageCompressService
  ) {
  }

  ngOnInit() {
    this.changeTab('exterior');
    this.isLoading = false;
    this.activatedRoute.params.subscribe(params => {
      this.listing = params['listing'];
    });
    this.photos_required = 100;
    this.fileList = {
      interior: [],
      exterior: [],
      underside: [],
      engine: [],
      imperfections: []
    };

    this.cover = {
      interior: null,
      exterior: null,
      underside: null,
      engine: null,
      imperfections: null
    };

    this.removeConfirm = {
      interior: null,
      exterior: null,
      underside: null,
      engine: null,
      imperfections: null
    };

    this.getExteriorFiles();
  }
  getExteriorFiles() {
    this.listingsService.get(this.listing)
      .subscribe((listing: any) => {
        if (listing.approval !== undefined) {
          for (const image of listing.approval) {
            this.loadExteriorImages(image, this.fileList.exterior, 'exterior');
          }
        }
        if (listing.exterior) {
          for (const image of listing.exterior) {
            this.loadExteriorImages(image, this.fileList.exterior, 'exterior');
          }
        }

        if (listing.interior) {
          for (const image of listing.interior) {
            this.loadExteriorImages(image, this.fileList.interior, 'interior');
          }
        }

        if (listing.underside) {
          for (const image of listing.underside) {
            this.loadExteriorImages(image, this.fileList.underside, 'underside');
          }
        }

        if (listing.engine) {
          for (const image of listing.engine) {
            this.loadExteriorImages(image, this.fileList.engine, 'engine');
          }
        }

        if (listing.imperfections) {
          for (const image of listing.imperfections) {
            this.loadExteriorImages(image, this.fileList.imperfections, 'imperfections');
          }
        }

        if (listing.cover) {
          this.setCover(listing.cover, 'exterior', 0);
        }
      });
  }

  loadExteriorImages(image: string, array: Array<any>, type: any) {
    this.http.get(image,
      { responseType: 'blob' }).subscribe((res: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onloadend = () => {

          const imgBlob = reader.result;
          const aux: any = {
            filename: imgBlob['fileName'],
            size: this.getBase64Size(imgBlob),
            encoding: 'base64',
            contentType: imgBlob['type'],
            content: (imgBlob).toString().split(',')[1]
          };
          array.push(aux);
          if (array.length === 1) {
            this.setCover(aux, type, 0);
          }
        };
      });
  }

  removeImage(index: number, type: string): boolean {
    if (this.fileList[type] && this.fileList[type][index]) {
      this.fileList[type].splice(index, 1);
      this.removeConfirm[type] = null;
    }
    return false;
  }

  submit(content: any, config?: object) {
    if (
      !this.fileList['interior'].length ||
      !this.fileList['exterior'].length ||
      !this.fileList['underside'].length ||
      !this.fileList['engine'].length ||
      !this.fileList['imperfections'].length
    ) {
      this.showError = true;
      return false;
    }
    this.isLoading = true;
    this.modalService.open(content, config);
    this.filesQty = 0;
    this.filesUploaded = 0;

    const types: any = ['interior', 'exterior', 'underside', 'engine', 'imperfections'];
    const success = 0;

    for (let j = 0; j < types.length; j++) {
      const type = types[j];
      this.filesQty += this.fileList[type].length;
    }
    types.forEach((type: string) => {
      const files: any = [];

      this.fileList[type].forEach((pic: any) => {
        files.push(pic);
      });

      for (let i = 0; i < files.length; i++) {
        const file: any = [files[i]];
        let index = 0;
        this.listingsService.uploadPhotos(this.listing, type, file)
          .subscribe((response: object) => {
            this.filesUploaded++;
            index++;
            if (this.filesUploaded === (this.filesQty)) {
              this.listingsService.uploadCover(this.listing, this.cover['exterior'])
                .subscribe(() => {
                  this.isLoading = false;
                  this.modalService.dismissAll();
                  this.listingsService.edit(this.listing, {
                    registerStep: 'records',
                  }).subscribe();
                });

              this.router.navigate(['/new-car/records/' + this.listing], { replaceUrl: true });
            }
          });
      }

    });
  }

  changeTab(tab: string): boolean {
    this.currentTab = tab;
    return false;
  }

  safe_pic(pic: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(pic.content_prefix + ',' + pic.content);
  }
  /*
  * Drag n drop
  *
  * @author gustavoaguiar
  */

  onFilesChange(file: any, type: any) {
    this.addPhoto(file, type);
  }
  onFileInvalids(fileList: Array<File>) {
    console.log('Alteração de arquivos inválidos', fileList);
    this.invalidFiles = fileList;
  }
  onMsgEvento(msgList: any[]) {
    this.msgEvento = msgList;
  }
  uploadFiles(files: any, type: any) {
    const images: Array<IImage> = [];
    ImageCompressService.filesToCompressedImageSource(files).then((observableImages: any) => {
      observableImages.subscribe((image: any) => {
        images.push(image);
      }, (error: any) => {
        console.log('Error while converting');
      }, () => {
        console.log('Images', images);
        for (let i = 0; i < images.length; i++) {
          let image: any;

          if (images[i].compressedImage != null) {
            image = images[i].compressedImage;
          } else {
            image = images[i];
          }

          const aux: any = {
            filename: image['fileName'],
            size: this.getBase64Size(image['imageDataUrl']),
            encoding: 'base64',
            contentType: image['type'],
            content: (image['imageDataUrl']).toString()
          };
          if (this.cover[type] == null) {
            aux.index = 0;
            this.cover[type] = aux;
          }


          this.fileList[type].push(aux);
        }

      });
    });
  }
  uploadCover(file: any, type: any) {
    const images: Array<IImage> = [];
    ImageCompressService.filesToCompressedImageSource(file).then((observableImages: any) => {
      observableImages.subscribe((image: any) => {
        images.push(image);
      }, (error: any) => {
        console.log('Error while converting');
      }, () => {
        console.log('Images', images);
        let image: any;

        if (images[0].compressedImage != null) {
          image = images[0].compressedImage;
        } else {
          image = images[0];
        }

        const aux: any = {
          filename: image['fileName'],
          size: this.getBase64Size(image['imageDataUrl']),
          encoding: 'base64',
          contentType: image['type'],
          content: (image['imageDataUrl']).toString()
        };

        aux.index = 0;
        this.cover[type] = aux;
      });
    });
  }

  getBase64Size(base: any) {
    const head = 'data:image/png;base64,';
    return Math.round((base.length - head.length) * 3 / 4);
  }
  addPhoto(file: any, type: any) {
    if (file.size <= 5242880) {
      if (this.cover[type] == null) {
        file.index = 0;
        this.cover[type] = file;
      }

      this.fileList[type].push(file);
    } else {
      this.msgEvento.push('The photo exceeds 5 MB maximum file size.');
    }
  }
  makeTrustedImage(item: any) {
    if (item) {
      const imageString = JSON.stringify(item).replace(/\\n/g, '');
      const style = 'url(' + imageString + ')';
      return this.domSanitizer.bypassSecurityTrustStyle(style);
    } else if (this.listingObject.cover) {
      if (typeof this.listingObject.cover === 'string') {
        return `url(${this.listingObject.cover})`;
      } else {
        const imageString = JSON.stringify(this.listingObject.cover.content).replace(/\\n/g, '');
        const style = 'url(' + imageString + ')';
        return this.domSanitizer.bypassSecurityTrustStyle(style);
      }
    }

    return undefined;
  }
  setCover(file: any, type: string, index: number) {
    file.index = index;
    this.cover[type] = file;
  }
  removeCover(type: string) {
    if (this.fileList[type].length === 1) {
      this.cover[type] = null;
      this.fileList[type] = [];
    }
  }
  goBack() {
    this.listingsService.edit(this.listing, {
      registerStep: 'additional-information'
    }).subscribe((response: object) => {
      this.modalService.dismissAll();
      this.router.navigate(['/new-car/additional-information/' + this.listing], { replaceUrl: true });
    });
  }
  changeCategory(oriCat: string, newCat: string, index: number) {
    this.fileList[newCat].push(this.fileList[oriCat][index]);
    this.fileList[oriCat].splice(index, 1);
  }
}
