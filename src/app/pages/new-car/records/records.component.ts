import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '@app/core';
import { ListingsService, UsersService } from '@app/shared/api';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styles: [`
    a {
      color: white;
      text-decoration: none;
    }
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
    .btn-text-upload-photo {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 1px;
      color: #f05b7a !important;
      background: none;
      border: none;
      display: flex;
      align-items: center;
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
  .fileList {
    padding-left: 0px;
  }
  .fileList li {
    border-radius: 10px;
    background-color: #ffffff;
    border: 0.5px solid #abb4bd;
    padding: 20px;
    margin: 5px 0;
  }
  .fileList li p {
  	margin:0px;
  }
  .fileList li  button {
  	margin-top:-12px;
  }
  .add-file-container {
    object-fit: contain;
    opacity: 0.19;
    border-radius: 8px;
    background-color: #ceced2;
    width: 150px;
    height: 80px;
  }
  .add-file-container img {
    width: 80px;
    height: 60px;
    margin: 10px;
  }
  `]
})
export class NewCarRecordsComponent implements OnInit {
  listing: string; // param
  listingObject: any;
  user: any;
  fileList: any = [];
  records: any = [];
  invalidFiles: any = [];
  msgEvento: any = [];
  isLoading: boolean;
  needInspection = false;
  inspFile: any;

  @ViewChild('modalLoading') modalLoading: any;
  allowed_extensions: any[] = ['png', 'jpg', 'bmp', 'png', 'gif', 'jpeg', 'pdf', 'doc', 'xls', 'xlsx', 'docx'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private listingsService: ListingsService,
    private usersService: UsersService,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.isLoading = false;
    this.activatedRoute.params.subscribe(params => {
      this.listing = params['listing'];
    });
    this.user = this.authenticationService.user;
    if (this.listing) {
      this.isLoading = true;
      this.listingsService.get(this.listing, true).subscribe(listing => {
        this.isLoading = false;
        this.listingObject = listing;
        console.log(this.listingObject);

        if (listing['user']['id'] !== this['user']['id']) {
          this.router.navigate(['/new-car/your-listing/'], { replaceUrl: true });
        }
      });
    }
  }
  success() {
    if (this.listingObject.reservePrice && Number(this.listingObject.reservePrice) >= 25000) {
      this.needInspection = true;
    } else {
      this.stepToReview();
    }
  }

  stepToReview() {
    this.listingsService.edit(this.listing, {
      registerStep: 'review-submit',
      records: this.records
    }).subscribe((response: object) => {
      this.modalService.dismissAll();
      this.router.navigate(['/new-car/review-submit/' + this.listing], { replaceUrl: true });
    });
  }

  goBack() {
    this.router.navigate(['/new-car/basic-photo/' + this.listing], { replaceUrl: true });
  }

  sendInspection() {
    this.stepToReview();
  }

  submit(content: any, config?: object) {
    if (this.fileList.length < 1) {
      this.success();
    }
    console.log(this.fileList);
    this.modalService.open(content, config);
    this.listingsService
      .uploadFiles(this.listing, this.fileList)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        if (response != null) {
          for (let i = 0; i < this.fileList.length; i++) {
            const contentType = this.fileList[i].contentType.split('/');
            const aux: any = {
              filename: this.fileList[i]['filename'],
              size: this.fileList[i]['size'],
              contentType: this.fileList[i]['type'],
              url: response[i],
              fileType: contentType[1]
            };
            this.records.push(aux);
          }
          this.success();
          console.log(response);
        } else {
          this.msgEvento.push(response);
          this.modalService.dismissAll();
        }
      });
  }

  /*
  * Drag n drop
  * @author gustavoaguiar
  */

  onFilesChange(file: Array<File>) {
    this.addFile(file);
  }
  onInspectionFilesChange(file: File) {
    this.addInspectionFile(file);
  }
  onFileInvalids(fileList: Array<File>) {
    console.log('Alteração de arquivos inválidos', fileList);
    this.invalidFiles = fileList;
  }
  onMsgEvento(msgList: any[]) {
    this.msgEvento = msgList;
  }
  uploadFiles(files: any) {
    for (let i = 0; i < files.length; i++) {
      const file: any = files[i];
      const fr: FileReader = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = (e) => {
        const auxBase: any = (fr.result);

        const aux: any = {
          filename: file['name'],
          size: file['size'],
          encoding: 'base64',
          contentType: file['type'],
          content: (auxBase).toString().split(',')[1]
        };
        if (this.needInspection) {
          this.addInspectionFile(aux);
        } else {
          this.addFile(aux);
        }
      };
    }
  }
  addInspectionFile(file: any) {
    if (file.size <= 5242880) {
      this.inspFile = file;
    } else {
      this.msgEvento.push('The file exceeds 5 MB maximum file size.');
    }
  }
  addFile(file: any) {
    if (file.size <= 5242880) {
      this.fileList.push(file);
    } else {
      this.msgEvento.push('The file exceeds 5 MB maximum file size.');
    }
  }
  makeTrustedImage(item: any) {
    const imageString = JSON.stringify(item).replace(/\\n/g, '');
    const style = 'url(' + imageString + ')';
    return this.domSanitizer.bypassSecurityTrustStyle(style);
  }
  removeImage(index: number) {
    this.fileList.splice(index, 1);
  }
}
