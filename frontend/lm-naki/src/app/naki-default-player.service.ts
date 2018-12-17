import {Component, Injectable} from '@angular/core';
import {ImageViewerComponent} from './image-container/image-viewer/image-viewer.component';
import {GenericViewComponent} from './generic-view/generic-view/generic-view.component';
import {IframeViewerComponent} from './iframe-viewer/iframe-view/iframe-viewer.component';
import {VideoViewComponent} from './video-view/video-view/video-view.component';
import {MotionViewComponent} from './motion-container/motion-view/motion-view.component';


@Injectable({
  providedIn: 'root'
})
export class NakiDefaultPlayerService {
  private prefix_match: Map<string, string> = new Map<string, string>([
    ['image/', 'image'],
    ['video/', 'video'],
  ]);
  private exact_match: Map<string, string> = new Map<string, string>([
    ['text/url', 'www'],
    ['motion/bvh', 'motion']
  ]);
  private default_player = 'generic';

  private playerComponentMap: Map<string, any> = new Map<string, any>([
    ['image', ImageViewerComponent],
    ['generic', GenericViewComponent],
    ['www', IframeViewerComponent],
    ['video', VideoViewComponent],
    ['motion', MotionViewComponent]
  ]);

  constructor() {
  }

  public getPlayerType(mime: string): string {
    // console.log('Guessing ' + mime);
    const exact = this.exact_match.get(mime);
    if (exact) {
      // console.log('exact: ' + exact);
      return exact;
    }
    for (const prefix of Array.from(this.prefix_match.keys())) {
      // console.log(prefix);
      if (mime.startsWith(prefix)) {
        // console.log('prefix: ' + prefix);
        return this.prefix_match.get(prefix) || this.default_player;
      }
    }
    // console.log('def: ' + this.default_player);
    return this.default_player;
  }

  public getPlayerComponent(type: string): any {
    return this.playerComponentMap.get(type);
  }

  public getPlayerTypes(): string[] {
    return Array.from(this.playerComponentMap.keys());
  }
}

