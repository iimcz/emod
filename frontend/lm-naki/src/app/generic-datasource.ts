import {DataSource} from '@angular/cdk/table';
import {Observable, Subject} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

export class GenericDataSource<T> implements DataSource<T> {
  data: Subject<T[]> = new Subject<T[]>();
  public length = 0

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.data.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  update(newData: T[]) {
    this.length = newData.length;
    this.data.next(newData);
  }
}

