import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-find-group-dialog',
  templateUrl: './find-group-dialog.component.html',
  styleUrls: ['./find-group-dialog.component.css']
})
export class FindGroupDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FindGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {disabled?: string[]}) {
  }

  ngOnInit() {
  }

}
