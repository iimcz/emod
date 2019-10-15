import {Component, Input, OnInit} from '@angular/core';
import {ContentViewer} from '../../content-viewer';
import {ContainerEventInterface} from '../../interface/container-event.interface';
import {DomSanitizer} from '@angular/platform-browser';
import {NakiService} from '../../naki.service';
import {ContainerInterface} from '../../interface/container.interface';
import {APIResponse} from '../../apiresponse.interface';
import {DigitalItem} from '../../interface/digital-item';
import {AnnotationInterface} from '../../interface/annotation.interface';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-annotation-viewer',
  templateUrl: './annotation-viewer.component.html',
  styleUrls: ['./annotation-viewer.component.css']
})
export class AnnotationViewerComponent extends ContentViewer implements OnInit {
  public remote_container: ContainerInterface | undefined;
  public annotation_text = '';
  private data_: string | undefined;
  private remote_container_id: string | undefined;
  private annotationMap: Map<string, AnnotationInterface[]> = new Map<string, AnnotationInterface[]>();

  constructor(protected sanitizer: DomSanitizer,
              protected dialog: MatDialog,
              public nakiService: NakiService) {
    super(sanitizer, dialog, nakiService);
  }

  get data(): string | undefined {
    return this.data_;
  }

  @Input() set data(val: string | undefined) {
    console.log('Setting value', val);
    this.data_ = val;
    if (this.data && this.view_id) {
      const parsed = JSON.parse(this.data);
      console.log(parsed);
      if (parsed.id_container) {
        this.remote_container_id = parsed.id_container;
        this.reloadContainer();
      }
    } else {
      console.log('Missing data', this.data, this.view_id);
    }
  }

  ngOnInit() {
    // if (this.data && this.view_id) {
    //   const parsed = JSON.parse(this.data);
    //   console.log(parsed);
    //   if (parsed.id_container) {
    //     this.remote_container_id = parsed.id_container;
    //     this.reloadContainer();
    //   }
    // }
    if (this.data && this.view_id) {
      const parsed = JSON.parse(this.data);
      console.log(parsed);
      if (parsed.id_container) {
        this.remote_container_id = parsed.id_container;
        this.reloadContainer();
      }
    } else {
      console.log('Missing data', this.data, this.view_id);
    }
  }

  public reloadContainer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.view_id || !this.remote_container_id) {
        resolve(false);
        return;
      }
      this.nakiService.get_container(this.view_id, this.remote_container_id).then((res: APIResponse<ContainerInterface>) => {
        this.remote_container = res.data;
        console.log(this.remote_container);
        if (this.remote_container && this.remote_container.item_ids) {
          Promise.all(this.remote_container.item_ids.map((item_id: string) => this.nakiService.get_item(item_id)))
            .then((result: APIResponse<DigitalItem>[]) => {
              console.log(result);
              result.forEach((e: APIResponse<DigitalItem>) => {
                const annots: AnnotationInterface[] = [];
                if (e.data && e.data.links) {
                  for (const link of e.data.links) {
                    if (link.type.startsWith('annotation')) {
                      const parts = link.type.split(';');
                      const length = parts.length > 1 ? parseFloat(parts[1]) : 0;
                      annots.push({
                        id_item: e.data.id_item,
                        uri: link.uri,
                        time: length
                      });
                    }
                  }
                  annots.sort((a: AnnotationInterface, b: AnnotationInterface) => a.time < b.time ? 1 : a.time > b.time ? -1 : 0);
                  this.annotationMap.set(e.data.id_item, annots);
                }
              });
              console.log(this.annotationMap);
              if (!this.annotation_text && this.remote_container && this.remote_container.item_ids.length === 1) {
                const item_annot = this.find_annot(this.remote_container.item_ids[0], 0);
                if (item_annot) {
                  console.log(item_annot);
                  if (item_annot.uri.startsWith('text:')) {
                    this.annotation_text = item_annot.uri.substr(5);
                  }
                }
              }
              resolve(true);
            });
        }
      });
    });
  }

  private find_annot(item_id: string, time: number): AnnotationInterface | undefined {
    const annots = this.annotationMap.get(item_id);
    if (!annots) {
      console.log('Unknown item');
      return undefined;
    }
    const item_annot = annots.find(e => e.time <= time);
    return item_annot || undefined;
  }

  public receiveEvent(event: ContainerEventInterface): void {
    if (!this.remote_container) {
      return;
    }
    if (event.id_container !== this.remote_container.id_container) {
      // console.log('Foreign event');
      return;
    }
    if (event.updated) {
      event.updated = false;
      this.reloadContainer().then((res: boolean) => {
        if (res) {
          this.receiveEvent(event);
        }
      });
    }
    // const annots = this.annotationMap.get(event.id_item);
    // if (!annots) {
    //   console.log('Unknown item');
    //   this.annotation_text = '';
    //   return;
    // }
    // const item_annot = annots.find(e => e.time <= event.item_time);
    const item_annot = this.find_annot(event.id_item, event.item_time);
    if (item_annot) {
      console.log(item_annot);
      if (item_annot.uri.startsWith('text:')) {
        this.annotation_text = item_annot.uri.substr(5);
      }
    } else {
      console.log('Annotation not found');
      this.annotation_text = '';
    }
  }

  protected prepare_state(): ContainerEventInterface | undefined {
    return undefined;
  }

  protected annotation_info(): AnnotationInterface | undefined {
    // Leaving undefined, this can't be annotated...
    return undefined;
  }


}
