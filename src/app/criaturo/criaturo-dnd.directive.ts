import {Directive, HostListener, HostBinding, EventEmitter, Output, Input} from '@angular/core';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from  'ng2-image-compress';

 

@Directive({
  selector: '[criaturoDnd]'
})
export class CriaturoDndDirective {
  selectedImage: any;
  processedImages: any = [];

 @Input() private allowed_extensions : Array<string> = [];
 @Input() private enable_drag : boolean = true;
 @Input() private id : any = "";
  @Output() private filesChangeEmiter : EventEmitter<any> = new EventEmitter();
  @Output() private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();
  @Output() private msgEventoEmiter : EventEmitter<any> = new EventEmitter();
  @HostBinding('style.background') private background = '#fff';

  constructor(
    private imgCompressService: ImageCompressService) { 
   }
 
  @HostListener('dragover', ['$event']) public onDragOver(evt:any){
    if(this.enable_drag){
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#eee';
    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt:any){
    if(this.enable_drag){
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#fff'
    }
  }

  @HostListener('drop', ['$event']) public onDrop(evt:any){ 
    if(this.enable_drag){
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#fff';
      let files = evt.dataTransfer.files;
      let valid_files : Array<File> = [];
      let invalid_files : Array<File> = [];
      let msg:any = [];


        let fileList: FileList;
     
        let images: Array<IImage> = []; 
        ImageCompressService.filesToCompressedImageSource(files).then(observableImages => {
          observableImages.subscribe((image) => { 
            images.push(image);
          }, (error) => {
            console.log("Error while converting");
          }, () => {
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
                  this.filesChangeEmiter.emit(aux);
            }
                            
          });
        }); 
      }
  } 
  getBase64Size(base:any) {
    let head:string = 'data:image/png;base64,';
    return Math.round((base.length - head.length) * 3 / 4) ;
  }
}
