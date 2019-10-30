import { Component, OnInit } from '@angular/core';
import { InspectionService } from '@app/shared/api/inspection/inspection.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {
  listing: string; // param
  invalidFiles: any[] = [];
  msgEvento: any[] = [];
  inspFile: any;
  isLoading = false;

  allowed_extensions: any[] = ['png', 'jpg', 'bmp', 'png', 'gif', 'jpeg', 'pdf', 'doc', 'xls', 'xlsx', 'docx'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private inspectionService: InspectionService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.listing = params['listing'];
    });
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

  addInspectionFile(file: any) {
    if (file.size <= 5242880) {
      this.inspFile = file;
    } else {
      this.msgEvento.push('The file exceeds 5 MB maximum file size.');
    }
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
        this.addInspectionFile(aux);
      };
    }
  }

  sendInspection() {
    console.log(this.inspFile);
    this.inspectionService.sendInspection(this.listing, { inspection: this.inspFile })
      .subscribe(res => {
        console.log(res);
        this.msgEvento.push(
          'Your file was sent successfully, you will be notified when the administrator review your inspection.'
        );
        setTimeout(() => {
          this.router.navigate(['/new-car/your-listing']);
        }, 5000);
      }, error => {
        console.log(error);
        this.msgEvento.push('Could not send your inspection, please try again in a few minutes.');
      });
    console.log('send inspection');
  }

}
