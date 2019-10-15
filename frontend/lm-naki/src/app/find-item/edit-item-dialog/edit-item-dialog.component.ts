import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DigitalItem} from '../../interface/digital-item';
import {MetakeyInterface} from '../../interface/metakey.interface';

@Component({
  selector: 'app-edit-item-dialog',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {item: DigitalItem, metakeys: MetakeyInterface[]}) { }

  ngOnInit() {
  }

}
