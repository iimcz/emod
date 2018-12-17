import {EventEmitter, Input, Output} from '@angular/core';
import {DigitalItem} from './interface/digital-item';
import {ContainerEventInterface} from './interface/container-event.interface';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {LinkInterface} from './interface/link.interface';
import {NakiService} from './naki.service';
import {AnnotationInterface} from './interface/annotation.interface';
import {MatDialog} from '@angular/material';
import {EditAnnotationDialogComponent} from './annotation/edit-annotation-dialog/edit-annotation-dialog.component';
// export interface AnnotationInterface
export abstract class ContentViewer {
  @Input() play_mode = false;
  @Input() dis: DigitalItem[] = [];
  @Input() view_id: string | undefined;
  @Output() stateUpdate: EventEmitter<ContainerEventInterface> = new EventEmitter<ContainerEventInterface>();

  constructor(protected sanitizer: DomSanitizer,
              protected dialog: MatDialog,
              public nakiService: NakiService) {
  }

  protected abstract prepare_state(): ContainerEventInterface | undefined;

  public emitState(updated: boolean = false): void {
    const state = this.prepare_state();
    if (state !== undefined) {
      state.updated = updated;
      this.stateUpdate.emit(state);
    }
  }

  public get_url(index: number): SafeResourceUrl | undefined {
    if (this.dis && this.dis.length > index && this.dis[index].links) {
      const links: LinkInterface[] = <LinkInterface[]>this.dis[index].links;
      for (const link of links) {
        if (link.type === 'data') {
          return this.sanitizer.bypassSecurityTrustResourceUrl(this.nakiService.get_resource_url(link.uri));
        }
      }
    }
    return undefined;
  }

  public annotate(): void {
    const info: AnnotationInterface | undefined = this.annotation_info();
    if (!info) {
      return;
    }
    console.log(info);
    const dialogRef = this.dialog.open(EditAnnotationDialogComponent, {data: info});
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.emitState(true);
      }
    });
  }

  protected abstract annotation_info(): AnnotationInterface | undefined;
}
