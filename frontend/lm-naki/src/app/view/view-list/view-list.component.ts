import {Component, OnInit, ViewChild} from '@angular/core';
import {NakiService} from '../../naki.service';
import {MatDialog} from '@angular/material';
import {EditViewDialogComponent} from '../../find-view/edit-view-dialog/edit-view-dialog.component';
import {FindViewComponent} from '../../find-view/find-view/find-view.component';
import {APIResponse} from '../../apiresponse.interface';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {Router} from '@angular/router';
import {Rights} from '../../rights.enum';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {
  public rights = Rights;
  @ViewChild('viewList') viewList: FindViewComponent | undefined;
  constructor(private dialog: MatDialog,
              private router: Router,
              public nakiService: NakiService) { }

  ngOnInit() {
  }

  public add_view(): void {
    this.nakiService.get_metakey_list().then((mk: APIResponse<MetakeyInterface[]>) => {
      const dialogRef = this.dialog.open(EditViewDialogComponent, {data: {view: null, metakeys: mk.data}});
      dialogRef.afterClosed().subscribe(() => {
        if (this.viewList) {
          this.viewList.reloadData();
        }
      });
    });
  }

  public view_selected(id: string): void {
    console.log('Redirecting to ' + id);
    if (this.nakiService.has_right(Rights.Researcher)) {
      this.router.navigate(['/views/edit', id]);
    } else {
      this.router.navigate(['/views/show', id]);
    }
  }
}
