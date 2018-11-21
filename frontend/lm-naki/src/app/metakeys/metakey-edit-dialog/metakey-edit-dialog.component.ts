import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MetakeyInterface} from '../../interface/metakey.interface';

@Component({
  selector: 'app-metakey-edit-dialog',
  templateUrl: './metakey-edit-dialog.component.html',
  styleUrls: ['./metakey-edit-dialog.component.css']
})
export class MetakeyEditDialogComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<MetakeyEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { metakey: MetakeyInterface }) {
  }

  ngOnInit() {

  }

}
