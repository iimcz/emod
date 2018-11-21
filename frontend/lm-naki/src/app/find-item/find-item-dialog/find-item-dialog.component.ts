import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-find-item-dialog',
  templateUrl: './find-item-dialog.component.html',
  styleUrls: ['./find-item-dialog.component.css']
})
export class FindItemDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FindItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {disabled?: string[], multiple?: boolean}) {
  }

  ngOnInit() {
  }

}
