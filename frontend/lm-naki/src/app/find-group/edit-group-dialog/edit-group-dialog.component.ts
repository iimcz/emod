import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DigitalGroup} from '../../interface/digital-group';
import {Utils} from '../../naki.utils';
import {DigitalItem} from '../../interface/digital-item';
import {EditItemDialogComponent} from '../../find-item/edit-item-dialog/edit-item-dialog.component';
import {APIResponse} from '../../apiresponse.interface';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {NakiService} from '../../naki.service';
import {FindItemDialogComponent} from '../../find-item/find-item-dialog/find-item-dialog.component';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.css']
})
export class EditGroupDialogComponent implements OnInit {
  public get_metadata = Utils.get_metadata;
  public group: DigitalGroup | undefined;

  constructor(public dialogRef: MatDialogRef<EditGroupDialogComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: { group_id: string },
              public nakiService: NakiService) {
  }

  ngOnInit() {
    this.reloadData();
  }

  public reloadData(): void {
    if (this.data.group_id) {
      this.nakiService.get_group(this.data.group_id).then((res: APIResponse<DigitalGroup>) => {
        this.group = res.data;
      });
    }
  }

  public edit_item(item: DigitalItem): void {
    this.nakiService.get_metakey_list().then((res: APIResponse<MetakeyInterface[]>) => {
      const dialogRef = this.dialog.open(EditItemDialogComponent, {data: {item: item, metakeys: res.data}});
      dialogRef.afterClosed().subscribe((res2) => {
        if (res2) {
          this.reloadData();
        }
      });
    });
  }

  public add_item(): void {
    if (this.group === undefined || this.group.items === undefined) {
      return;
    }

    const dialogRef = this.dialog.open(FindItemDialogComponent, {
      width: '100%',
      panelClass: 'centered-dialog',
      data: {disabled: this.group.items.map(e => e.id_item), multiple: true}
    });
    dialogRef.afterClosed().subscribe((res: string[]) => {
      console.log(res);
      if (res && res.length > 0 && this.group !== undefined) {
        Promise.all(res.map((item_id: string) => {
          return this.nakiService.add_item_to_group((<DigitalGroup>this.group).id_group, item_id).then(() => true, () => false);
        })).then(() => {
          // console.log(item);
          this.reloadData();
        }, (err) => {
          console.log(err);
        });
      }
    });
  }


  public delete_item(item: DigitalItem): void {
    if (this.group !== undefined) {
      this.nakiService.remove_item_from_group(this.group.id_group, item.id_item).then((group: APIResponse<DigitalGroup>) => {
        console.log(group);
        this.reloadData();
      });
    }
  }
}
