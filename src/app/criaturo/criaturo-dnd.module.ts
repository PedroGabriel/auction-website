import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CriaturoDndDirective } from './criaturo-dnd.directive';
import { CriaturoImgDefaultDirective } from './criaturo-img-default.directive';

@NgModule({
    imports: [
        CommonModule
     ],
    declarations: [
         CriaturoDndDirective,
         CriaturoImgDefaultDirective
    ],
    providers: [
         CriaturoDndDirective,
         CriaturoImgDefaultDirective
    ],
    exports: [
        CriaturoDndDirective,
        CriaturoImgDefaultDirective
    ]
})
  
export class CriaturoDndModule {}