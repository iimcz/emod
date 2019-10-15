import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';
import {DigitalSetInterface} from '../../interface/digital-set.interface';
import { MatDialog } from '@angular/material/dialog';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';
import {Rights} from '../../rights.enum';
import {EditSetDialogComponent} from '../edit-set-dialog/edit-set-dialog.component';

@Component({
  selector: 'app-find-set',
  templateUrl: './find-set.component.html',
  styleUrls: ['./find-set.component.css']
})
export class FindSetComponent extends GenericFindComponent<DigitalSetInterface> implements OnInit, OnDestroy {
  @Input() show_edit = true;
  @Input() show_add = false;
  @Input() click_to_show = false;

  @Output() add_clicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialog: MatDialog,
              public  nakiService: NakiService) {
    super(nakiService);
  }

  ngOnInit(): void {
    if (this.show_add) {
      this.displayedColumns.push('add');
    }
    if (this.show_edit && this.nakiService.has_right(Rights.Editor)) {
      this.displayedColumns.push('edit');
    }
    this.displayedColumns.push('description');
    this.displayedColumns.push('id');
    this.displayedColumns.push('author');
    this.init();
  }

  ngOnDestroy(): void {
    this.deinit();
  }

  protected reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<DigitalSetInterface>> {
    return Promise.all([
      this.nakiService.get_set_list(keys, limit, offset),
      this.nakiService.get_set_list_count(keys)]).then((res: [APIResponse<DigitalSetInterface[]>, APIResponse<number>]) => {
      return {count: res[1].data || 0, data: res[0].data || []};
    });
  }

  public editSet(dset: DigitalSetInterface | null): void {
    const set_copy = JSON.parse(JSON.stringify(dset));
    const dialogRef = this.dialog.open(EditSetDialogComponent, {data: {set: set_copy, metakeys: this.metakeys}});
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.reloadData();
      }
    });
  }
}
