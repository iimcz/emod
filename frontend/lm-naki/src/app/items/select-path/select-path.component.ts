import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TreeElementInterface} from '../../interface/tree-element.interface';

@Component({
  selector: 'app-select-path',
  templateUrl: './select-path.component.html',
  styleUrls: ['./select-path.component.css']
})
export class SelectPathComponent implements OnInit {
  @Input() tree: TreeElementInterface = {dirs: {}, file_count: 0, new_files: 0};
  @Output() path_selected: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public get_keys(x: Object): string[] {
    return Object.keys(x).sort((a: string, b: string) =>  a.localeCompare(b));
  }
}
