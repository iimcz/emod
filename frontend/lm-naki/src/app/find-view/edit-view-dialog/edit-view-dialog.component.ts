import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {ViewInterface} from '../../interface/view.interface';

@Component({
  selector: 'app-edit-view-dialog',
  templateUrl: './edit-view-dialog.component.html',
  styleUrls: ['./edit-view-dialog.component.css']
})
export class EditViewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data:
                {view: ViewInterface, metakeys: MetakeyInterface[], copy_view_id: string | undefined}) {
  }

  ngOnInit() {
  }

}
