import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NakiService} from '../../naki.service';
import {DigitalItem} from '../../interface/digital-item';
import {DomSanitizer} from '@angular/platform-browser';
import {LinkInterface} from '../../interface/link.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {EditItemDialogComponent} from '../edit-item-dialog/edit-item-dialog.component';
import {APIResponse} from '../../apiresponse.interface';
import 'rxjs-compat/add/observable/fromEvent';
import 'rxjs-compat/add/operator/distinctUntilChanged';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';

@Component({
  selector: 'app-find-item',
  templateUrl: './find-item.component.html',
  styleUrls: ['./find-item.component.css'],
  exportAs: 'FindItemComponent'
})
export class FindItemComponent extends GenericFindComponent<DigitalItem> implements OnInit, OnDestroy {
  @Input() show_add = false;
  @Input() show_edit = true;
  @Input() disabled_ids: string[] = [];
  // Allow multiple selected items
  @Input() multiple = false;
  @Input() click_to_show = false;
  @Output() add_clicked: EventEmitter<string> = new EventEmitter<string>();

  selected_items: DigitalItem[] = [];

  constructor(private sanitizer: DomSanitizer,
              private dialog: MatDialog,
              public  nakiService: NakiService) {
    super(nakiService);

  }

  ngOnInit() {
    const cols: string[] = [];
    if (this.show_add) {
      cols.push('add');
    }
    if (this.show_edit) {
      cols.push('edit');
    }
    cols.push('description');
    cols.push('mime');
    cols.push('preview');
    this.displayedColumns = cols;
    if (!this.disabled_ids) {
      this.disabled_ids = [];
    }
    this.init();
  }

  ngOnDestroy(): void {
    this.deinit();
  }

  protected reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<DigitalItem>> {
    return Promise.all([
      this.nakiService.get_item_list(keys, limit, offset),
      this.nakiService.get_item_list_count(keys)]).then((res: [APIResponse<DigitalItem[]>, APIResponse<number>]) => {
        if (res[0].data === undefined) {
          res[0].data = [];
        }
      (<DigitalItem[]>res[0].data).forEach(e => {
          e.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.find_url(e));
        });
        return {count: res[1].data || 0 , data: res[0].data || []};
    });
  }

  private find_link_url_for_preview(links: LinkInterface[]): string {
    const preview = links.find(e => e.type === 'preview');
    if (preview) {
      return preview.uri;
    }
    const data = links.find(e => e.type === 'data');
    if (data) {
      return data.uri;
    }
    return '';
  }

  private find_url(item: DigitalItem): string {
    if (!item.links || item.links.length < 1) {
      return '';
    }
    const link = this.find_link_url_for_preview(item.links);
    return link ? this.nakiService.get_resource_url(link) : '';
  }

  public edit_item(item: DigitalItem): void {
    // Make a deep copy (Object.assing is not sufficient, so the dialog cannot modify our data directly
    const item_copy = JSON.parse(JSON.stringify(item));
    const dialogRef = this.dialog.open(EditItemDialogComponent, {data: {item: item_copy, metakeys: this.metakeys}});
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.reloadData();
      }
    });
  }

  public is_disabled(item: DigitalItem): boolean {
    return this.disabled_ids && this.disabled_ids.indexOf(item.id_item) !== -1;
  }
  public update_multi(item: DigitalItem, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selected_items.push(item);
    } else {
      const idx = this.selected_items.findIndex(e => e.id_item === item.id_item);
      if (idx >= 0) {
        this.selected_items.splice(idx, 1);
      }
    }
    console.log(event);
  }

  public multi_add<T>(dialogRef: MatDialogRef<T>): void {
    dialogRef.close(this.selected_items.map(e => e.id_item));
  }
}


