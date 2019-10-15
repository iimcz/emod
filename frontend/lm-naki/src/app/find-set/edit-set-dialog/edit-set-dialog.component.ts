import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {DigitalSetInterface} from '../../interface/digital-set.interface';

@Component({
  selector: 'app-edit-set-dialog',
  templateUrl: './edit-set-dialog.component.html',
  styleUrls: ['./edit-set-dialog.component.css']
})
export class EditSetDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditSetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {set: DigitalSetInterface, metakeys: MetakeyInterface[]}) { }

  ngOnInit() {
  }

}
