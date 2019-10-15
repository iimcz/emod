import {Component, Input, OnInit} from '@angular/core';
import {LinkInterface} from '../../interface/link.interface';
import {DigitalItem} from '../../interface/digital-item';
import {NakiService} from '../../naki.service';

@Component({
  selector: 'app-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.css']
})
export class LinksListComponent implements OnInit {
  @Input() item: DigitalItem | null = null;
  private links_: LinkInterface[] = [];

  constructor(public nakiService: NakiService) {
  }

  get links() {
    console.log(this.links_);
    return this.links_;
  }

  @Input() set links(l: LinkInterface[]) {
    this.links_ = LinksListComponent.sortLinks(l);
    console.log('Sorted array', this.links);
  }

  /*!
  Sorts an array of links.
  The links are sorted by segments separated by semicolons
  If any part is numeric, numeric sort is used for that part.
   */
  public static sortLinks(links: LinkInterface[]): LinkInterface[] {
    links.sort((a: LinkInterface, b: LinkInterface) => {
      const ax: string[] = a.type ? a.type.split(';') : [];
      const bx: string[] = b.type ? b.type.split(';') : [];

      while (true) {
        const a0 = ax.length > 0 ? ax[0] : null;
        const b0 = bx.length > 0 ? bx[0] : null;
        if (!a0 && !b0) {
          return 0;
        } else if (!a0) {
          return -1;
        } else if (!b0) {
          return 1;
        }
        // Hack to detect numberic values
        const an: number = +a0;
        const bn: number = +b0;
        if (!isNaN(an) && !isNaN(bn)) {
          if (an < bn) {
            return -1;
          } else if (an > bn) {
            return 1;
          }
        } else {
          const x = a0.localeCompare(b0);
          if (x !== 0) {
            return x;
          }
        }
        ax.splice(0, 1);
        bx.splice(0, 1);
      }
    });
    return links;
  }

  public link_type_part(link: LinkInterface, index: number): string | null {
    // console.log('Processing link ', link);
    const x = link.type.split(';');
    if (x.length <= index) {
      return null;
    }
    return x[index];
  }

  public set_link_type_part(link: LinkInterface, index: number, value: string | null) {
    const x = link.type.split(';');
    while (x.length <= index) {
      x.push('');
    }
    x[index] = value || '';
    link.type = x.join(';');
    console.log('New link ', link);
  }

  public link_type_base(link: LinkInterface): string {
    return this.link_type_part(link, 0) || '';
  }

  public set_link_type_base(link: LinkInterface, base_type: string) {
    this.set_link_type_part(link, 0, base_type);
  }

  public delete_link(index: number): void {
    const x = this.links.splice(index, 1);
    console.log('Deleted link:', x);
  }

  public add_empty_link(): void {
    const user = this.nakiService.get_user_info();
    this.links.push({
      id_link: '',
      id_item: this.item ? this.item.id_item : '',
      id_user: user ? user.id_user : '',
      type: '',
      uri: '',
      description: ''
    });
  }


  ngOnInit() {
  }

}
