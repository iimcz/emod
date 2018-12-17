import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AnnotationInterface} from '../../interface/annotation.interface';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';
import {LinkInterface} from '../../interface/link.interface';

@Component({
  selector: 'app-edit-annotation-dialog',
  templateUrl: './edit-annotation-dialog.component.html',
  styleUrls: ['./edit-annotation-dialog.component.css']
})
export class EditAnnotationDialogComponent implements OnInit {
  public text = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: AnnotationInterface,
              private dialogRef: MatDialogRef<EditAnnotationDialogComponent>,
              public nakiService: NakiService) { }

  ngOnInit() {
  }

  public save(): void {
    this.data.uri = 'text:' + this.text;
    console.log(this.data);
    this.nakiService.create_annotation(this.data).then((res: APIResponse<LinkInterface>) => {
      this.dialogRef.close(res.data);
    });
  }

}
