 import {Directive, Input, HostBinding} from '@angular/core'
@Directive({
    selector: '[criaturoImgDefault]',
    host: {
      '(error)':'updateUrl()',
      '(load)': 'load()',
      '[src]':'src'
     }
  })
  
 export class CriaturoImgDefaultDirective {
    @Input() src:string;
    @Input() criaturoImgDefault:string;
    @HostBinding('class') className:any;
  
    constructor() { 
   }
    updateUrl() { 
      this.src = this.criaturoImgDefault;
    }
    load(){
      this.className = 'image-loaded';
    }
  }