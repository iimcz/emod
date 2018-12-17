import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';
import {ViewInterface} from '../../interface/view.interface';
import {MatDialog} from '@angular/material';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';
import {EditViewDialogComponent} from '../edit-view-dialog/edit-view-dialog.component';
import {Rights} from '../../rights.enum';

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
    if (this.show_edit && this.nakiService.has_right(Rights.Researcher)) {
      this.displayedColumns.push('edit');
    }
    this.displayedColumns.push('description');
    if (this.show_edit && this.nakiService.has_right(Rights.Researcher)) {
      this.displayedColumns.push('copy');
    }
    this.init();
  }

  public ngOnDestroy(): void {
    this.deinit();
  }

  public edit_view(view: ViewInterface): void {
    const view_copy = JSON.parse(JSON.stringify(view));
    const dialogRef = this.dialog.open(EditViewDialogComponent, {data: {view: view_copy, metakeys: this.metakeys}});
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.reloadData();
      }
    });
  }

  public copy_view(view: ViewInterface): void {
    const view_copy: ViewInterface = JSON.parse(JSON.stringify(view));
    view_copy.id_view = '';
    const dialogRef = this.dialog.open(EditViewDialogComponent, {data: {view: view_copy, metakeys: this.metakeys, copy_view_id: view.id_view}});
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.reloadData();
      }
    });
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

