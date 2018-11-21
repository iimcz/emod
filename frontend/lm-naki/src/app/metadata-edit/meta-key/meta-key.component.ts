import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MetakeyInterface} from '../../interface/metakey.interface';

@Component({
  selector: 'app-meta-key',
  templateUrl: './meta-key.component.html',
  styleUrls: ['./meta-key.component.css']
})
export class MetaKeyComponent implements OnInit {
  @Input() metakeys: MetakeyInterface[] | undefined;

  @Input() get value() {
    return this.value_;
  }
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  set value(val: string) {
    this.value_ = val;
    this.valueChange.emit(val);
  }


  public value_ = '';
  constructor() { }

  ngOnInit() {
  }
}
