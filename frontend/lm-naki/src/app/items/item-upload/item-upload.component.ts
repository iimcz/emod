import {Component, OnInit} from '@angular/core';
import {DigitalItem} from '../../interface/digital-item';
import {NakiService} from '../../naki.service';
import {MetadataInterface} from '../../interface/metadata.interface';
import {MetakeyInterface} from '../../interface/metakey.interface';
import {APIResponse} from '../../apiresponse.interface';
import {FileTreeElementInterface} from '../../interface/filetree-element.interface';
import {Router} from '@angular/router';
import {DigitalGroup} from '../../interface/digital-group';
import {FindGroupDialogComponent} from '../../find-group/find-group-dialog/find-group-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {Utils} from '../../naki.utils';
import {TreeElementInterface} from '../../interface/tree-element.interface';

@Component({
  selector: 'app-item-upload',
  templateUrl: './item-upload.component.html',
  styleUrls: ['./item-upload.component.css']
})
export class ItemUploadComponent implements OnInit {

  public file: File | undefined;
  public item: DigitalItem | undefined;
  public metadata: MetadataInterface[] = [];
  public metakeys: MetakeyInterface[] = [];
  public use_group = false;
  public selected_group: DigitalGroup | undefined;
  public uploadProgress = 0;
  public tree: TreeElementInterface | undefined;
  public path: string | undefined;
  constructor(private router: Router,
              private dialog: MatDialog,
              public nakiService: NakiService) {
  }

  public get_metadata = Utils.get_metadata;

  ngOnInit() {
    Promise.all([
      this.nakiService.get_metakey_list(),
      this.nakiService.get_dir_tree()])
      .then((res: [APIResponse<MetakeyInterface[]>, APIResponse<TreeElementInterface>]) => {
      if (res[0].data !== undefined) {
        this.metakeys = <MetakeyInterface[]>res[0].data;
      }
      if (res[1].data) {
        this.tree = res[1].data;
        console.log(this.tree);
      }
    });
  }


  public file_selected(event: any, element: HTMLInputElement): void {
    console.log(event);
    console.log(element.files);
    if (element.files && element.files.length > 0) {
      this.file = element.files[0];
      const idx = this.metadata.findIndex(e => e.key === 'description');
      if (idx < 0) {
        this.metadata.push({id: '', target: 'item', key: 'description', value: this.file.name});
      }
    }
  }

  public show_preview(): void {
    if (!this.file || this.file.size > 10485760) {
      return;
    }
    const fr = new FileReader();
    fr.onload = (event: ProgressEvent) => {
      const dataUrl: string = (event.target as FileReader).result as string;
      this.item = this.generate_item(dataUrl.slice(5, dataUrl.indexOf(';')), dataUrl);
    };
    fr.readAsDataURL(this.file);

  }

  public upload(uploadButton: MatButton): void {
    uploadButton.disabled = true;
    const fr = new FileReader();
    fr.onload = (event: ProgressEvent) => {
      const buffer: ArrayBuffer = (event.target as FileReader).result as ArrayBuffer;
      if (!this.file) {
        return;
      }
      if (this.path === undefined) {
        this.path = '';
      }
      this.nakiService.upload_file(this.file.name, buffer, this.path, (l: number, t: number) => {this.uploadProgress = 100 * l / t; }).then((res: APIResponse<FileTreeElementInterface>) => {
        this.item = undefined;
        this.file = undefined;
        if (res.data) {
          const fe: FileTreeElementInterface = res.data;
          this.nakiService.create_item(this.generate_item(fe.mime, 'storage:' + fe.path, fe.metadata)).then((dires: APIResponse<DigitalItem>) => {
            console.log(dires);
            // this.router.navigate(['/items/show', dires.data.id_item]);
            uploadButton.disabled = false;
          });
        } else {
          console.error('Failed to upload file!');
          // TODO: Handle this
        }
      });
    };
    if (this.file) {
      fr.readAsArrayBuffer(this.file);
    }
  }

  public select_group(): void {
    const dialogRef = this.dialog.open(FindGroupDialogComponent);
    dialogRef.afterClosed().subscribe((res: DigitalGroup) => {
      console.log(res);
      if (res) {
        this.nakiService.get_group(res.id_group).then((grp: APIResponse<DigitalGroup>) => {
          if (grp.data) {
            this.selected_group = grp.data;
          }
        });
      }
    });
  }

  private generate_item(mime: string, uri: string, metadata?: {[key: string]: string}): DigitalItem {
    const new_metadata: MetadataInterface[] = this.metadata.map(e => e);
    if (metadata !== undefined) {
      for (const key of Object.keys(metadata)) {
        new_metadata.push({
          id: '',
          target: 'item',
          key: key,
          value: metadata[key]
        });
      }
    }
    const uinfo = this.nakiService.get_user_info();
    const user = uinfo ? uinfo.id_user : '';
    return {
      id_item: '',
      group_ids: this.selected_group ? [this.selected_group.id_group] : [],
      id_user: user,
      description: '',
      mime: mime,
      links: [
        {
          id_link: '',
          id_item: '',
          id_user: user,
          description: 'imported path',
          type: 'data',
          uri: uri
        },
      ],
      metadata: new_metadata
    };
  }
}
