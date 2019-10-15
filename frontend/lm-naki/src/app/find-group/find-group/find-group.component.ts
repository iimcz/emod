import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {NakiService} from '../../naki.service';
import {APIResponse} from '../../apiresponse.interface';
import {DigitalGroup} from '../../interface/digital-group';
import {EditGroupDialogComponent} from '../edit-group-dialog/edit-group-dialog.component';
import {GenericFindComponent, GenericListReply} from '../../generic-find.component';

@Component({
  selector: 'app-find-group',
  templateUrl: './find-group.component.html',
  styleUrls: ['./find-group.component.css']
})
export class FindGroupComponent extends GenericFindComponent<DigitalGroup> implements OnInit, OnDestroy {
  @Input() show_edit = true;
  @Input() show_add = false;
  @Output() add_clicked: EventEmitter<DigitalGroup> = new EventEmitter<DigitalGroup>();

  constructor(private sanitizer: DomSanitizer,
              private dialog: MatDialog,
              public  nakiService: NakiService) {
    super(nakiService);
  }

  ngOnInit() {
    if (this.show_add) {
      this.displayedColumns.push('add');
    }
    if (this.show_edit) {
      this.displayedColumns.push('edit');
    }
    this.displayedColumns.push('type');
    this.displayedColumns.push('description');
    this.init();
  }

  ngOnDestroy(): void {
    this.deinit();
  }

  public editGroup(group: DigitalGroup | undefined): void {
    this.editGroupImpl(group ? group.id_group : undefined);
    // if (group) {
    //   this.nakiService.get_group(group.id_group).then((res: APIResponse<DigitalGroup>) => {
    //     this.editGroupImpl(res.data);
    //   });
    // } else {
    //   this.editGroupImpl(null);
    // }
  }

  protected reload_list(keys: string, offset: number, limit: number): Promise<GenericListReply<DigitalGroup>> {
    return Promise.all([
      this.nakiService.get_group_list(keys, limit, offset),
      this.nakiService.get_group_list_count(keys)]).then((res: [APIResponse<DigitalGroup[]>, APIResponse<number>]) => {
      return {count: res[1].data || 0, data: res[0].data || []};
    });
  }

  private editGroupImpl(group_id: string | undefined): void {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {data: {group_id: group_id}});
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.reloadData();
      }
    });
  }

}
