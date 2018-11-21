import {ElementRef, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material';
import {APIResponse} from './apiresponse.interface';
import {GenericDataSource} from './generic-datasource';
import {Observable, Subscription} from 'rxjs';
import {MetakeyInterface} from './interface/metakey.interface';
import {NakiService} from './naki.service';
import {Utils} from './naki.utils';
import 'rxjs-compat/add/observable/fromEvent';
import 'rxjs-compat/add/operator/distinctUntilChanged';
import 'rxjs-compat/add/operator/debounceTime';

export interface GenericListReply<T> {
  count: number;
  data: T[];
}

export abstract class GenericFindComponent<T> {


  @ViewChild('filterText') filterText: ElementRef | undefined;
  @ViewChild('paginator') paginator: MatPaginator | undefined;
  public total_length = 0;
  public dataSource: GenericDataSource<T> = new GenericDataSource<T>();
  public metakeys: MetakeyInterface[] = [];
  public displayedColumns: string[] = [];
  public get_metadata = Utils.get_metadata;
  protected req_idx = 0;
  private filter_sub: Subscription | undefined;

  constructor(public nakiService: NakiService) {

  }

  public update_filter(): void {
    const req = ++this.req_idx;
    // this.update_filter(filter, paginator);
    const query_keys: string = this.filterText ? this.filterText.nativeElement.value : '';
    const offset: number = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    const limit: number = this.paginator ? this.paginator.pageSize : 10;
    this.reload_list(query_keys, offset, limit).then((res: GenericListReply<T>) => {
      if (req !== this.req_idx) {
        console.log('Old response, ignoring');
      } else {
        this.total_length = res.count;
        this.dataSource.update(res.data);
      }
    });
  }

  public reloadData(): void {
    // Promise.all([
    this.nakiService.get_metakey_list()
    // ])
      .then((res: APIResponse<MetakeyInterface[]>) => {
        if (res.data) {
          this.metakeys = res.data;
        }
        this.update_filter();
      }, (err) => {
        console.log('Error while fetching data');
        console.log(err);
      });
  }

  protected init(): void {
    if (this.filterText) {
      this.filter_sub = Observable.fromEvent(this.filterText.nativeElement, 'keyup')
        .debounceTime(250)
        .distinctUntilChanged()
        .subscribe(() => {
          this.update_filter();
        });
      this.filterText.nativeElement.focus();
    }
    this.reloadData();
  }

  protected deinit(): void {
    if (this.filter_sub) {
      this.filter_sub.unsubscribe();
      this.filter_sub = undefined;
    }
  }

  protected abstract reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<T>>;
}


