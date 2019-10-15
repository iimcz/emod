import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinkInterface} from '../../interface/link.interface';
import {FindItemDialogComponent} from '../../find-item/find-item-dialog/find-item-dialog.component';
import {MatDialog} from '@angular/material';
import {FindGroupDialogComponent} from '../../find-group/find-group-dialog/find-group-dialog.component';
import {DigitalGroup} from '../../interface/digital-group';

@Component({
  selector: 'app-link-edit-input',
  templateUrl: './link-edit-input.component.html',
  styleUrls: ['./link-edit-input.component.css']
})
export class LinkEditInputComponent implements OnInit {
  @Input() link: LinkInterface | undefined;
  @Output() linkChange: EventEmitter<LinkInterface> = new EventEmitter<LinkInterface>();

  constructor(public dialog: MatDialog) {
  }

  public link_type_part(link: LinkInterface, index: number): string | null {
    // console.log('Processing link ', link);
    const x = link.type.split(';');
    if (x.length <= index) {
      return null;
    }
    return x[index];
  }

  public set_link_type_part(link: LinkInterface, index: number, value: string | null) {
    const x = link.type.split(';');
    while (x.length <= index) {
      x.push('');
    }
    x[index] = value || '';
    link.type = x.join(';');
    console.log('New link ', link);
  }

  public link_type_base(link: LinkInterface): string {
    return this.link_type_part(link, 0) || '';
  }

  public set_link_type_base(link: LinkInterface, base_type: string) {
    this.set_link_type_part(link, 0, base_type);
  }

  public get_link_data_part(link: LinkInterface, index: number): string | null {
    const x = link.uri.split(':', 2);
    if (index >= x.length) {
      return null;
    }
    return x[index];
  }

  public set_link_data_part(link: LinkInterface, index: number, value: string): void {
    const x = link.uri.split(':', 2);
    while (x.length < 2) {
      x.push('');
    }
    if (index >= x.length) {
      return;
    }
    x[index] = value;
    link.uri = x.join(':');
  }

  public is_target_link(link: LinkInterface) {
    const type = this.get_link_data_part(link, 0);
    const link_types = ['di', 'dg'];
    return link_types.findIndex(e => e === type) !== -1;
  }

  public select_target() {
    const dialogRef = this.dialog.open(FindItemDialogComponent, {width: '100%', panelClass: 'centered-dialog', data: {multiple: false}});

    dialogRef.afterClosed().subscribe((ret: string) => {
      if (ret && this.link) {
        this.set_link_data_part(this.link, 1, ret);
        this.emit();
      }
    });
  }

  public select_target_group() {
    const dialogRef = this.dialog.open(FindGroupDialogComponent, {width: '100%', panelClass: 'centered-dialog', data: {multiple: false}});

    dialogRef.afterClosed().subscribe((ret: DigitalGroup) => {
      if (ret && this.link) {
        this.set_link_data_part(this.link, 1, ret.id_group);
        this.emit();
      }
    });
  }

  ngOnInit() {
  }

  public emit(): void {
    this.linkChange.emit(this.link);
  }

}
