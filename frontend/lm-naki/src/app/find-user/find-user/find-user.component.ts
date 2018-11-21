import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';
import {UserInterface} from '../../interface/user.interface';
import {NakiService} from '../../naki.service';
import {MatDialog} from '@angular/material';
import {APIResponse} from '../../apiresponse.interface';
import {EditUserDialogComponent} from '../edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent extends GenericFindComponent<UserInterface> implements OnInit, OnDestroy {
  @Input() show_add = false;
  @Input() show_edit = true;
  @Output() add_clicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dialog: MatDialog,
              public nakiService: NakiService) {
    super(nakiService);
  }

  ngOnInit() {
    if (this.show_add) {
      this.displayedColumns.push('add');
    }
    if (this.show_edit) {
      this.displayedColumns.push('edit');
    }
    this.displayedColumns.push('description');
    this.displayedColumns.push('username');
    this.displayedColumns.push('uuid');
    this.init();
  }

  ngOnDestroy() {
    this.deinit();
  }

  protected reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<UserInterface>> {
    return Promise.all([
      this.nakiService.get_user_list(keys, limit, offset),
      this.nakiService.get_user_list_count(keys)]).then((res: [APIResponse<UserInterface[]>, APIResponse<number>]) => {
      return {count: res[1].data || 0, data: res[0].data || []};
    });
  }
  public edit_user(user?: UserInterface): void {
    const data = user !== undefined ? {user_id: user.id_user} : {};
    const dialogRef = this.dialog.open(EditUserDialogComponent, {data: data});
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.reloadData();
      }
    });
  }
}

