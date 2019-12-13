import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NakiService} from '../../naki.service';
import {Subscription} from 'rxjs';
import {APIResponse} from '../../apiresponse.interface';
import {DigitalItem} from '../../interface/digital-item';
import {LinksListComponent} from '../../links-edit/links-list/links-list.component';
import {DigitalSetInterface} from '../../interface/digital-set.interface';
import {Utils} from '../../naki.utils';
import {DigitalGroup} from '../../interface/digital-group';
import {FindGroupDialogComponent} from '../../find-group/find-group-dialog/find-group-dialog.component';

@Component({
  selector: 'app-set-info',
  templateUrl: './set-info.component.html',
  styleUrls: ['./set-info.component.css']
})
export class SetInfoComponent implements OnInit {
  public param_sub: Subscription | undefined;
  public set_id: string | undefined;
  public dset: DigitalSetInterface | undefined;
  public get_metadata = Utils.get_metadata;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              public nakiService: NakiService) {
  }

  ngOnInit() {
    this.param_sub = this.route.params.subscribe((params) => {
      console.log(params);
      this.set_id = params['id'];
      this.reloadData();
    });
  }

  public reloadData(): void {
    if (this.set_id === undefined) {
      return;
    }
    this.nakiService.get_set(this.set_id).then((res: APIResponse<DigitalSetInterface>) => {
      this.dset = res.data;
      console.log(this.dset);
      if (this.dset && this.dset.groups) {
        const old_id = this.dset.id_set;
        Promise.all(this.dset.groups
          .map((dg: DigitalGroup) => this.nakiService.get_group(dg.id_group))
        ).then((dgs: APIResponse<DigitalGroup>[]) => {
          if (this.dset && this.dset.id_set === old_id) {
            this.dset.groups = dgs.filter(e => e).map(e => e.data as DigitalGroup);
          }
        });
      }
      // if (this.dset !== undefined && this.item.links) {
      //   console.log('Sorting');
      //   this.item.links = LinksListComponent.sortLinks(this.item.links);
      // }
    });
  }

  public get_title(): string {
    if (this.dset !== undefined) {
      return [this.get_metadata(this.dset, 'description'), this.get_metadata(this.dset, 'part_name')]
        .filter(e => e).join(' - ') || this.dset.description as string;
    }
    return '';
  }

  public add_group(): void {
    const used_ids = this.dset && this.dset.groups ? this.dset.groups.map(e => e.id_group) : [];
    const dialogRef = this.dialog.open(FindGroupDialogComponent, {data: {disabled: used_ids}});
    dialogRef.afterClosed().subscribe((dg: DigitalGroup | undefined) => {
      console.log(dg);
      if (dg !== undefined && dg !== null && this.dset) {
        if (!this.dset.groups) {
          this.dset.groups = [];
        }
        this.dset.groups.push(dg);
        this.nakiService.update_set(this.dset).then(() => this.reloadData());
      }
    });
  }

  public delete_group(dg: DigitalGroup): void {
    console.log(this.dset, dg);
    if (this.dset && this.dset.groups) {
      const idx = this.dset.groups.findIndex((g: DigitalGroup) => g.id_group === dg.id_group);
      if (idx !== -1) {
        this.dset.groups.splice(idx, 1);
        this.nakiService.update_set(this.dset).then(() => this.reloadData());
      }
    }
  }

  public export_package(tpl: TemplateRef<any>): void {
    if (this.dset) {
      const dialogRef = this.dialog.open(tpl, {disableClose: true});
      this.nakiService.generate_spi(this.dset).then(e => {
        dialogRef.close();
      }, e => {
        dialogRef.close();
      });
    }

  }
}
