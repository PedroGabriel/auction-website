import { Component, OnInit, ViewChild } from '@angular/core';
import { CommentsService } from '@app/shared/api/comments/comments.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @ViewChild('modalConfirm')
  modalConfirm: any;

  comments: any[] = [];
  confirmLabel = '';
  confirmIcon = '';

  iconComment = 'garbage-icon.png';
  iconReport = 'flag-icon.png';

  selectedReport: string = undefined;
  type: 'comment' | 'report' = undefined;

  constructor(
    private commentsService: CommentsService,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    this.commentsService.getReports()
      .subscribe((reports: any[]) => this.comments = reports);
  }

  getUserImage(img: any) {
    const auxBase = 'data:image/jpg;base64,';
    if (img && img.search('http') === -1) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(auxBase + img);
    } else if (img) {
      return img;
    } else {
      return 'assets/images/user-photo-50x50.jpg';
    }
  }

  openConfirm(type: 'comment' | 'report', reportId: string) {
    this.selectedReport = reportId;
    this.type = type;
    switch (type) {
      case 'report': {
        this.confirmIcon = this.iconReport;
        this.confirmLabel = 'Are you sure you want to remove repport?';
        break;
      } case 'comment': {
        this.confirmIcon = this.iconComment;
        this.confirmLabel = 'Are you sure you want to delete comment?';
        break;
      }
    }

    this.modalService.open(this.modalConfirm, { size: 'sm' });
  }

  reviewReport() {
    if (this.selectedReport) {
      this.commentsService.reviewReport(this.selectedReport, this.type === 'comment')
        .subscribe(response => {
          this.selectedReport = undefined;
          this.confirmIcon = undefined;
          this.confirmLabel = undefined;
          this.modalService.dismissAll();
          this.getComments();
        });
    }
  }

}
