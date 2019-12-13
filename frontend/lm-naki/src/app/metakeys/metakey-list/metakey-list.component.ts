import {Component, OnDestroy, OnInit} from '@angular/core';
import {NakiService} from '../../naki.service';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {APIResponse} from '../../apiresponse.interface';
import { MatDialog } from '@angular/material/dialog';
import {MetakeyEditDialogComponent} from '../metakey-edit-dialog/metakey-edit-dialog.component';

@Component({
  selector: 'app-metakey-list',
  templateUrl: './metakey-list.component.html',
  styleUrls: ['./metakey-list.component.css']
})
export class MetakeyListComponent extends GenericFindComponent<MetakeyInterface> implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              public nakiService: NakiService) {
    super(nakiService);
  }

  ngOnInit() {
    const cols: string[] = [];

    cols.push('edit');
    cols.push('key');
    cols.push('description');
    cols.push('type');
    cols.push('mandatory');
    this.displayedColumns = cols;
    this.init();
  }

  ngOnDestroy() {
    this.deinit();
  }

  public edit_item(metakey: MetakeyInterface): void {
    const mk = Object.assign({}, metakey);
    const dialogRef = this.dialog.open(MetakeyEditDialogComponent, {data: {metakey: mk}});
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.reloadData();
      }
    });
  }

  protected reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<MetakeyInterface>> {
    return this.nakiService.get_metakey_list().then((res: APIResponse<MetakeyInterface[]>) => {
      return res.data ? {data: res.data, count: res.data.length} : {data: [], count: 0};
    });
  }
}
