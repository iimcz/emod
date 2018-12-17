import {Component, Injectable} from '@angular/core';
import {ImageViewerComponent} from './image-viewer/image-viewer/image-viewer.component';
import {GenericViewerComponent} from './generic-viewer/generic-viewer/generic-viewer.component';
import {IframeViewerComponent} from './iframe-viewer/iframe-view/iframe-viewer.component';
import {VideoViewerComponent} from './video-viewer/video-viewer/video-viewer.component';
import {MotionViewerComponent} from './motion-viewer/motion-viewer/motion-viewer.component';


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
    ['generic', GenericViewerComponent],
    ['www', IframeViewerComponent],
    ['video', VideoViewerComponent],
    ['motion', MotionViewerComponent],
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

