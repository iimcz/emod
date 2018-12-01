import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';
import {Subscription} from 'rxjs';
import {DigitalItem} from '../../interface/digital-item';
import {Utils} from '../../naki.utils';
import {Rights} from '../../rights.enum';
import {MatDialog} from '@angular/material';
import {EditItemDialogComponent} from '../../find-item/edit-item-dialog/edit-item-dialog.component';
import {MetakeyInterface} from '../../interface/metakey.interface';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.css']
})
export class ItemInfoComponent implements OnInit, OnDestroy {
  public param_sub: Subscription | undefined;
  public item_id: string | undefined;
  public item: DigitalItem | undefined;
  public get_metadata = Utils.get_metadata;
  public rights = Rights;
  private metakeys: MetakeyInterface[] | undefined;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              public nakiService: NakiService) {
  }

  ngOnInit() {
    this.param_sub = this.route.params.subscribe((params) => {
      console.log(params);
      this.item_id = params['id'];
      this.reloadData();
    });
  }

  public reloadData(): void {
    if (this.item_id === undefined) {
      return;
    }
    this.nakiService.get_item(this.item_id).then((res: APIResponse<DigitalItem>) => {
      this.item = res.data;
    });
  }

  private open_edit_dialog(): void {
    const item = JSON.parse(JSON.stringify(this.item));
    const dialogRef = this.dialog.open(EditItemDialogComponent, {data: {item: item, metakeys: this.metakeys}});
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.reloadData();
      }
    });
  }
  public edit_item(): void {
    if (!this.item) {
      return;
    }
    if (this.metakeys !== undefined) {
      this.open_edit_dialog();
    } else {
      this.nakiService.get_metakey_list().then((res: APIResponse<MetakeyInterface[]>) => {
        if (res.data !== undefined) {
          this.metakeys = res.data;
          this.open_edit_dialog();
        }
      });
    }

  }

  ngOnDestroy(): void {
    if (this.param_sub) {
      this.param_sub.unsubscribe();
    }
  }
}
