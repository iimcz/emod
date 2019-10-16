import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {MetadataInterface} from '../../interface/metadata.interface';
import {Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-meta-list',
  templateUrl: './meta-list.component.html',
  styleUrls: ['./meta-list.component.css']
})
export class MetaListComponent implements OnInit, OnChanges {
  values_: MetadataInterface[] = [];
  @Output() valuesChange: EventEmitter<MetadataInterface[]> = new EventEmitter<MetadataInterface[]>();
  mandatory_keys: MetakeyInterface[] | undefined;
  optional_keys: MetakeyInterface[] | undefined;
  @Input() mandatory_type = 'i';
  @Input() meta_target = 'item';
  @Input() ignore_mandatory = false;
  private metakeys_: MetakeyInterface[] = [];

  constructor() {
  }

  get metakeys() {
    return this.metakeys_;
  }

  @Input() set metakeys(keys: MetakeyInterface[]) {
    this.metakeys_ = keys;
    this.update_metakeys();
  }

  @Input() get values() {
    return this.values_;
    // return [].concat(this.mandatory_values, this.optional_keys);
  }

  set values(val: MetadataInterface[]) {
    this.values_ = val;
    this.valuesChange.emit(val);
  }

  ngOnInit() {
    this.update_metakeys();
  }

  public ngOnChanges(changes: SimpleChanges): void {
  }

  public add_empty() {
    this.values.push({id: '', target: this.meta_target, key: '', value: ''});
    console.log(this.values);
  }

  public is_mandatory(key: string, index: number): boolean {
    const mk = this.metakeys.find(e => e.key === key);
    if (mk && mk.mandatory.includes(this.mandatory_type)) {
      // This key is mandatory. Let's check, if it hasn't been already specified before
      return (this.values.findIndex((e, i) => e.key === key && i < index) === -1);
    }
    return false;
  }

  public delete_meta(meta: MetadataInterface, index: number): void {
    if (this.is_mandatory(meta.key, index)) {
      return;
    }
    console.log(meta);
    const idx = this.values.findIndex(e => e === meta);
    console.log(idx);
    if (idx !== -1) {
      this.values.splice(idx, 1);
    }
  }

  public get_meta_type(key_name: string): string {
    const metakey = this.metakeys_.find(e => e.key === key_name);
    return metakey ? metakey.type : 'string';
  }

  public edit_multistring(meta: MetadataInterface, index: number, value: string) {
    const x = meta.value.split(';');
    while (x.length <= index) {
      x.push('');
    }
    x[index] = value;
    meta.value = x.join(';');
  }

  public delete_multistring(meta: MetadataInterface, index: number): void {
    const x = meta.value.split(';');
    if (x.length <= index) {
      return;
    }
    x.splice(index, 1);
    meta.value = x.join(';');
  }


  public edit_user(meta: MetadataInterface, index: number, value: string) {
    const x = meta.value.split(';');
    while (x.length <= index) {
      x.push(',');
    }
    const val_parts = x[index].split(',');
    val_parts[0] = value;
    x[index] = val_parts.join(',');
    meta.value = x.join(';');
  }

  public edit_role(meta: MetadataInterface, index: number, value: string) {
    const x = meta.value.split(';');
    while (x.length <= index) {
      x.push(',');
    }
    const val_parts = x[index].split(',');
    val_parts[1] = value;
    x[index] = val_parts.join(',');
    meta.value = x.join(';');
  }

  private update_metakeys(): void {
    this.mandatory_keys = this.metakeys.filter(e => e.mandatory.indexOf(this.mandatory_type) !== -1);
    this.optional_keys = this.metakeys.filter(e => e.mandatory.indexOf(this.mandatory_type) === -1);

    // console.log(this.mandatory_keys);
    // console.log(this.optional_keys);
    // console.log(this);

    // this.mandatory_values = this.mandatory_keys.map(e => ({id: '', target: 'item', key: e.key, value: ''}));
    if (!this.ignore_mandatory) {
      for (const meta of this.mandatory_keys) {
        if (this.values.findIndex(e => e.key === meta.key) === -1) {
          this.values.push({id: '', target: this.meta_target, key: meta.key, value: ''});
        }
      }
    }
  }
}
