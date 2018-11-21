import { Component, OnInit } from '@angular/core';
import {NakiService} from '../../naki.service';
import {Utils} from '../../naki.utils';
import {APIResponse} from '../../apiresponse.interface';
import {ViewInterface} from '../../interface/view.interface';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-view-show',
  templateUrl: './view-show.component.html',
  styleUrls: ['./view-show.component.css']
})
export class ViewShowComponent implements OnInit {
  public get_metadata = Utils.get_metadata;
  public view: ViewInterface | undefined;
  constructor(private route: ActivatedRoute,
              public nakiService: NakiService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.nakiService.get_view(params['id']).then((res: APIResponse<ViewInterface>) => {
        this.view = res.data;
      });
    });
  }

}
