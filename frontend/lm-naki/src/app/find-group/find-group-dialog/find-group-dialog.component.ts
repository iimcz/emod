import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-find-group-dialog',
  templateUrl: './find-group-dialog.component.html',
  styleUrls: ['./find-group-dialog.component.css']
})
export class FindGroupDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FindGroupDialogComponent>) {
  }

  ngOnInit() {
  }

}
