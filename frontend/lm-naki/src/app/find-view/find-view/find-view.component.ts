import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';
import {ViewInterface} from '../../interface/view.interface';
import {MatDialog} from '@angular/material';
import {NakiService} from '../../naki.service';
import {DigitalItem} from '../../interface/digital-item';
import {APIResponse} from '../../apiresponse.interface';
import {EditItemDialogComponent} from '../../find-item/edit-item-dialog/edit-item-dialog.component';

@Component({
  selector: 'app-find-view',
  templateUrl: './find-view.component.html',
  styleUrls: ['./find-view.component.css'],
  exportAs: 'FindViewComponent'
})
export class FindViewComponent extends GenericFindComponent<ViewInterface> implements OnInit, OnDestroy {
  @Input() show_add = false;
  @Input() show_edit = true;
  @Output() add_clicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialog: MatDialog,
              public  nakiService: NakiService) {
    super(nakiService);
  }

  public ngOnInit() {
    if (this.show_add) {
      this.displayedColumns.push('add');
    }
    if (this.show_edit) {
      this.displayedColumns.push('edit');
    }
    this.displayedColumns.push('description');
    this.init();
  }

  public ngOnDestroy(): void {
    this.deinit();
  }

  public edit_item(item: DigitalItem): void {
    // Make a deep copy (Object.assing is not sufficient, so the dialog cannot modify our data directly
    //   const item_copy = JSON.parse(JSON.stringify(item));
    // const dialogRef = this.dialog.open(EditItemDialogComponent, {data: {item: item_copy, metakeys: this.metakeys}});
    // dialogRef.afterClosed().subscribe(res => {
    //   console.log(res);
    //   if (res) {
    //     this.reloadData();
    //   }
    // });
  }

  protected reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<ViewInterface>> {
    return Promise.all([
      this.nakiService.get_view_list(keys, limit, offset),
      this.nakiService.get_view_list_count(keys)]).then((res: [APIResponse<ViewInterface[]>, APIResponse<number>]) => {
      // res[0].forEach(e => {
      //   e.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.find_url(e));
      // });
      return {count: res[1].data || 0, data: res[0].data || []};
    });
  }
}

