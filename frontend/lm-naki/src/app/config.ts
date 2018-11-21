export class NakiConfig {
  // Width and height should be the same, ngDraggable supports only single grid size...
  static cellWidth = 16;
  static cellHeight = 16;
  static minWidth = 4;
  static minHeight = 4;

  static widthToPx(width: number) {
    return width * NakiConfig.cellWidth;
  }

  static heightToPx(height: number) {
    return height * NakiConfig.cellHeight;
  }

  static widthToPxStr(width: number) {
    return NakiConfig.widthToPx(width).toString(10) + 'px';
  }

  static heightToPxStr(height: number) {
    return NakiConfig.heightToPx(height).toString(10) + 'px';
  }
};
