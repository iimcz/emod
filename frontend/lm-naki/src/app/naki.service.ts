import {Injectable} from '@angular/core';
import {DigitalGroup} from './interface/digital-group';
import {DigitalItem} from './interface/digital-item';
import {ContainerInterface} from './interface/container.interface';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {FileTreeInterface} from './interface/filetree.interface';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {base_url, vrmod_url, cookie_name} from './app.site-config';
import {APIResponse} from './apiresponse.interface';
import {MetakeyInterface} from './interface/metakey.interface';
import {ViewInterface} from './interface/view.interface';
import {FileTreeElementInterface} from './interface/filetree-element.interface';
import {UserInterface} from './interface/user.interface';
import {Rights} from './rights.enum';
import {TreeElementInterface} from './interface/tree-element.interface';
import {DigitalSetInterface} from './interface/digital-set.interface';
import {AnnotationInterface} from './interface/annotation.interface';
import {LinkInterface} from './interface/link.interface';

@Injectable()
export class NakiService {

  private containers: Map<string, ContainerInterface> = new Map();

  private user_info: UserInterface | undefined;

  constructor(private httpClient: HttpClient) {
    const token = Cookie.get(cookie_name);
    if (token) {
      this.ping(token).then((res: APIResponse<UserInterface>) => {
        console.log('User authenticated');
      });
    }
  }

  public get_token(): string | null {
    return (this.user_info && this.user_info.token) ? this.user_info.token : null;
  }

  public login(username: string, pw_hash: string): Promise<APIResponse<UserInterface>> {
    return new Promise<APIResponse<UserInterface>>((resolve, reject) => {
      this.httpClient.post<APIResponse<UserInterface>>(base_url + 'auth', {username: username, password: pw_hash})
        .subscribe(res => {
          console.log(res);
          this.user_info = res.data;
          if (this.user_info && this.user_info.token) {
            Cookie.set(cookie_name, this.user_info.token);
          }
          resolve(res);
        });
    });
  }

  public logout(): Promise<APIResponse<undefined>> {
    return this.generic_request_delete('auth', {}).then((res: APIResponse<undefined>) => {
      this.user_info = undefined;
      Cookie.delete(cookie_name);
      return res;
    });
  }

  public is_authenticated(): boolean {
    return this.user_info !== undefined && this.user_info.token !== undefined;
  }

  public get_user_info(): UserInterface | undefined {
    return this.user_info;
  }

  public has_right(level: Rights): boolean {
    if (this.user_info === undefined) {
      return false;
    }
    return level <= this.user_info.auth_level;
  }

  public ping(token?: string): Promise<APIResponse<UserInterface>> {
    const params: {[key: string]: string} = {};
    if (token !== undefined) {
      params['token'] = <string>token;
    }
    return this.generic_request_get<UserInterface>('auth', params).then((res: APIResponse<UserInterface>) => {
      if (res.data) {
        this.user_info = res.data;
        console.log(this.user_info);
      }
      return res;
    });
  }

  private generic_request_get<T>(url_fragment: string, params: { [key: string]: string }): Promise<APIResponse<T>> {
    const url = this._prepare_url(url_fragment, params);
    return new Promise<APIResponse<T>>((resolve, reject) => {
      this.httpClient.get<APIResponse<T>>(url)
        .subscribe(res => {
          console.log(res);
          resolve(res);
        });
    });
  }

  private generic_request_post<Body, Return = Body>(url_fragment: string, data: Body, params: { [key: string]: string } = {}): Promise<APIResponse<Return>> {
    const url = this._prepare_url(url_fragment, params);
    return new Promise<APIResponse<Return>>((resolve, reject) => {
      this.httpClient.post<APIResponse<Return>>(url, data)
        .subscribe(res => {
          console.log(res);
          resolve(res);
        });
    });
  }

  private generic_request_put<Body, Return = Body>(url_fragment: string, data: Body, params: { [key: string]: string } = {}): Promise<APIResponse<Return>> {
    const url = this._prepare_url(url_fragment, params);
    return new Promise<APIResponse<Return>>((resolve, reject) => {
      this.httpClient.put<APIResponse<Return>>(url, data)
        .subscribe(res => {
          console.log(res);
          resolve(res);
        });
    });
  }

  private generic_request_delete<Return = undefined>(url_fragment: string, params: { [key: string]: string } = {}): Promise<APIResponse<Return>> {
    const url = this._prepare_url(url_fragment, params);
    return new Promise<APIResponse<Return>>((resolve, reject) => {
      this.httpClient.delete<APIResponse<Return>>(url)
        .subscribe(res => {
          console.log(res);
          resolve(res);
        });
    });
  }

  private generic_list<T>(url_fragment: string, query: string, params?: { [key: string]: string }): Promise<APIResponse<T[]>> {
    if (!params) {
      params = {};
    }
    params.q = query;
    return this.generic_request_get<T[]>(url_fragment, params);
  }

  private generic_list_count(url_fragment: string, query: string, params?: { [key: string]: string }): Promise<APIResponse<number>> {
    if (!params) {
      params = {};
    }
    params.q = query;
    params.dry = '1';
    return this.generic_request_get<number>(url_fragment, params);
  }

  /* *************************************************************************************************************

      Generic call wrappers

   ************************************************************************************************************* */

  private generic_create<T, Return = T>(url_fragment: string, value: T): Promise<APIResponse<Return>> {
    return this.generic_request_post<T, Return>(url_fragment, value);
  }

  public generic_update<T, Return = T>(url_fragment: string, id: string, item: T): Promise<APIResponse<Return>> {
    return this.generic_request_put(this._join_path(url_fragment, id), item);
  }

  private generic_get<T>(url_fragment: string, id: string): Promise<APIResponse<T>> {
    return this.generic_request_get<T>(this._join_path(url_fragment, id), {});
  }

  private _join_path(...segments: string[]): string {
    return segments.map(e => e.startsWith('/') ? e.slice(1) : e).map(e => e.endsWith('/') ? e.slice(0, -1) : e).join('/');
  }
  public get_item_list(query: string = '', limit: number = 10, offset: number = 0): Promise<APIResponse<DigitalItem[]>> {
    return this.generic_list<DigitalItem>('dis', query, {limit: limit.toString(10), offset: offset.toString(10)});
  }

  public get_item_list_count(query: string = ''): Promise<APIResponse<number>> {
    return this.generic_list_count('dis', query);
  }

  /* *************************************************************************************************************

      CRUD operations

   ************************************************************************************************************* */

  public create_item(item: DigitalItem): Promise<APIResponse<DigitalItem>> {
    return this.generic_create('dis', item);
    // return new Promise<APIResponse<DigitalItem>>((resolve, reject) => {
    //   this.httpClient.post<APIResponse<DigitalItem>>(base_url + 'dis', item).subscribe(res => {
    //     console.log(res);
    //     resolve(res);
    //   });
    // });
  }

  public update_item(item: DigitalItem): Promise<APIResponse<DigitalItem>> {
    return this.generic_update('di', item.id_item.toString(), item);
    // return new Promise<APIResponse<DigitalItem>>((resolve, reject) => {
    //   this.httpClient.put<APIResponse<DigitalItem>>(base_url + 'di/' + item.id_item, item).subscribe(res => {
    //     console.log(res);
    //     resolve(res);
    //   });
    // });
  }

  public get_group_list(query: string = '', limit: number = 10, offset: number = 0): Promise<APIResponse<DigitalGroup[]>> {
    return this.generic_list<DigitalGroup>('digs', query, {limit: limit.toString(10), offset: offset.toString(10)});
  }

  public get_group_list_count(keys: string): Promise<APIResponse<number>> {
    return this.generic_list_count('digs', keys);
  }

  public create_group(item: DigitalGroup): Promise<APIResponse<DigitalGroup>> {
    return this.generic_create('digs', item);
    // return new Promise<APIResponse<DigitalGroup>>((resolve, reject) => {
    //   this.httpClient.post<APIResponse<DigitalGroup>>(base_url + 'digs', item).subscribe(res => {
    //     console.log(res);
    //     resolve(res);
    //   });
    // });
  }

  public update_group(item: DigitalGroup): Promise<APIResponse<DigitalGroup>> {
    return this.generic_update('dig', item.id_group.toString(), item);
    // return new Promise<APIResponse<DigitalGroup>>((resolve, reject) => {
    //   this.httpClient.put<APIResponse<DigitalGroup>>(base_url + 'dig/' + item.id_group, item).subscribe(res => {
    //     console.log(res);
    //     resolve(res);
    //   });
    // });
  }

  public get_group(id: string): Promise<APIResponse<DigitalGroup>> {
    return new Promise<APIResponse<DigitalGroup>>((resolve, reject) => {
      this.httpClient.get<APIResponse<DigitalGroup>>(base_url + 'dig/' + id).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public add_item_to_group(id_group: string, id_item: string): Promise<APIResponse<DigitalItem>> {
    return this.generic_request_put<Object, DigitalItem>(this._join_path('dig', id_group, 'item', id_item), {});
  }

  public remove_item_from_group(id_group: string, id_item: string): Promise<APIResponse<DigitalGroup>> {
    return this.generic_request_delete<DigitalGroup>(this._join_path('dig', id_group, 'item', id_item), {});
  }

  public get_item(id: string): Promise<APIResponse<DigitalItem>> {
    return new Promise<APIResponse<DigitalItem>>((resolve, reject) => {
      this.httpClient.get<APIResponse<DigitalItem>>(base_url + 'di/' + id).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public get_file_tree(): Promise<APIResponse<FileTreeInterface>> {
    return new Promise<APIResponse<FileTreeInterface>>((resolve, reject) => {
      this.httpClient.get<APIResponse<FileTreeInterface>>(base_url + 'storage/list').subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public get_dir_tree(): Promise<APIResponse<TreeElementInterface>> {
    return this.generic_request_get<TreeElementInterface>('storage/list/', {'dirs': '1'});
  }

  public get_dir_content(path: string): Promise<APIResponse<FileTreeInterface>> {
    return this.generic_get('storage/list', path);
  }

  public get_metakey_list(): Promise<APIResponse<MetakeyInterface[]>> {
    return new Promise<APIResponse<MetakeyInterface[]>>((resolve, reject) => {
      this.httpClient.get<APIResponse<MetakeyInterface[]>>(base_url + 'metakeys').subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public update_metakey(metakey: MetakeyInterface): Promise<APIResponse<MetakeyInterface>> {
    return new Promise<APIResponse<MetakeyInterface>>((resolve, reject) => {
      this.httpClient.put<APIResponse<MetakeyInterface>>(base_url + 'metakey/' + metakey.key, metakey).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public get_set_list(query: string = '', limit: number = 10, offset: number = 0): Promise<APIResponse<DigitalSetInterface[]>> {
    return this.generic_list<DigitalSetInterface>('diss', query, {limit: limit.toString(10), offset: offset.toString(10)});
  }

  public get_set_list_count(keys: string): Promise<APIResponse<number>> {
    return this.generic_list_count('diss', keys);
  }

  public create_set(dset: DigitalSetInterface): Promise<APIResponse<DigitalSetInterface>> {
    return this.generic_create('diss', dset);
  }

  public update_set(dset: DigitalSetInterface): Promise<APIResponse<DigitalSetInterface>> {
    return this.generic_update('dis', dset.id_set.toString(), dset);
  }

  public get_set(id: string): Promise<APIResponse<DigitalSetInterface>> {
    return new Promise<APIResponse<DigitalSetInterface>>((resolve, reject) => {
      this.httpClient.get<APIResponse<DigitalSetInterface>>(base_url + 'dis/' + id).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }


  public get_view_list(query: string = '', limit: number = 10, offset: number = 0): Promise<APIResponse<ViewInterface[]>> {
    return this.generic_list<ViewInterface>('views', query, {limit: limit.toString(10), offset: offset.toString(10)});
  }

  public get_view_list_count(keys: string): Promise<APIResponse<number>> {
    return this.generic_list_count('views', keys);
  }

  public create_view(item: ViewInterface): Promise<APIResponse<ViewInterface>> {
    return this.generic_create('views', item);
    // return new Promise<APIResponse<ViewInterface>>((resolve, reject) => {
    //   this.httpClient.post<APIResponse<ViewInterface>>(base_url + 'views', item).subscribe(res => {
    //     console.log(res);
    //     resolve(res);
    //   });
    // });
  }

  public copy_view(view_id: string, item: ViewInterface): Promise<APIResponse<ViewInterface>> {
    return this.generic_request_post('views', item, {'view_id': view_id});
  }

  public update_view(view: ViewInterface): Promise<APIResponse<ViewInterface>> {
    return this.generic_update<ViewInterface>('view', view.id_view, view);
  }

  public get_view(id: string): Promise<APIResponse<ViewInterface>> {
    return new Promise<APIResponse<ViewInterface>>((resolve, reject) => {
      this.httpClient.get<APIResponse<ViewInterface>>(base_url + 'view/' + id).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public add_item_to_view(id_view: string, id_item: string, path: string = ''): Promise<APIResponse<DigitalItem>> {
    return this.generic_request_put<any, DigitalItem>(this._join_path('view', id_view, 'item', id_item), {}, {'path': path});
  }

  public remove_item_from_view(id_view: string, id_item: string): Promise<APIResponse<ViewInterface>> {
    return this.generic_request_delete(this._join_path('view', id_view, 'item', id_item));
  }

  public create_container(id_view: string, container: ContainerInterface): Promise<APIResponse<ContainerInterface>> {
    return new Promise<APIResponse<ContainerInterface>>((resolve, reject) => {
      this.httpClient.post<APIResponse<ContainerInterface>>(base_url + 'view/' + id_view + '/containers', container).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public get_container(id_view: string, id_container: string): Promise<APIResponse<ContainerInterface>> {
    return this.generic_get<ContainerInterface>(this._join_path('view', id_view, 'container'), id_container);
    // return new Promise<APIResponse<ContainerInterface>>((resolve, reject) => {
    //   this.httpClient.get<APIResponse<ContainerInterface>>(base_url + 'view/' + id_view + '/container/' + id_container,).subscribe(res => {
    //     console.log(res);
    //     resolve(res);
    //   });
    // });
  }

  public delete_container(id_view: string, id_container: string): Promise<APIResponse<boolean>> {
    return new Promise<APIResponse<boolean>>((resolve, reject) => {
      this.httpClient.delete<APIResponse<boolean>>(base_url + 'view/' + id_view + '/container/' + id_container,).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public update_container(id_view: string, container: ContainerInterface): Promise<APIResponse<ContainerInterface>> {
    return new Promise<APIResponse<ContainerInterface>>((resolve, reject) => {
      this.httpClient.put<APIResponse<ContainerInterface>>(base_url + 'view/' + id_view + '/container/' + container.id_container, container).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public add_item_to_container(id_view: string, id_container: string, id_item: string): Promise<APIResponse<ContainerInterface>> {
    return new Promise<APIResponse<ContainerInterface>>((resolve, reject) => {
      this.httpClient.put<APIResponse<ContainerInterface>>(base_url + 'view/' + id_view + '/container/' + id_container + '/item/' + id_item, {}).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public remove_item_from_container(id_view: string, id_container: string, id_item: string): Promise<APIResponse<ContainerInterface>> {
    return new Promise<APIResponse<ContainerInterface>>((resolve, reject) => {
      this.httpClient.delete<APIResponse<ContainerInterface>>(base_url + 'view/' + id_view + '/container/' + id_container + '/item/' + id_item, {}).subscribe(res => {
        console.log(res);
        resolve(res);
      });
    });
  }

  public create_annotation(info: AnnotationInterface): Promise<APIResponse<LinkInterface>> {
    return this.generic_create<AnnotationInterface, LinkInterface>(this._join_path('di', info.id_item, 'annotations'), info);
  }


  public upload_file(name: string, data: ArrayBuffer, path: string, cb?: any): Promise<APIResponse<FileTreeElementInterface>> {
    return new Promise<APIResponse<FileTreeElementInterface>>((resolve, reject) => {
      const url = this._prepare_url('storage/upload/' + name, {'dir': path});
      const req = new HttpRequest('POST', url, data, {reportProgress: true});
      this.httpClient.request<APIResponse<FileTreeElementInterface>>(req).subscribe((event: HttpEvent<APIResponse<FileTreeElementInterface>>) => {
        console.log(event);
        switch (event.type) {
          case HttpEventType.Sent:
            return null;
          case HttpEventType.UploadProgress:
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            // console.log(`File is ${percentDone}% uploaded.`);
            if (cb) {
              cb(event.loaded, event.total || 0);
            }
            return null;
          case HttpEventType.Response:
            // console.log(`File "${file.name}" was completely uploaded!`);
            const res = event as HttpResponse<APIResponse<FileTreeElementInterface>>;
            if (res.body) {
              resolve(res.body);
            } else {
              console.error('Failed to upload file');
            }
        }
      });
    });
  }


  public get_user_list(query: string = '', limit: number = 10, offset: number = 0): Promise<APIResponse<UserInterface[]>> {
    return this.generic_list<UserInterface>('users', query, {limit: limit.toString(10), offset: offset.toString(10)});
  }

  public get_user_list_count(keys: string): Promise<APIResponse<number>> {
    return this.generic_list_count('users', keys);
  }

  public get_user(id: string): Promise<APIResponse<UserInterface>> {
    return this.generic_get<UserInterface>('user', id);
  }

  public update_user(user: UserInterface): Promise<APIResponse<UserInterface>> {
    return this.generic_update<UserInterface>('user', user.id_user, user);
  }
  public create_user(user: UserInterface): Promise<APIResponse<UserInterface>> {
    return this.generic_create<UserInterface>('users', user);
  }
  /*
  Returns an URL usable as a target for img or iframe

  Supported schemas:
  http://www.xxx.asb/dasd
  https://www.dasd.dfasd/dasdasda
  data:UUID
  data:mime
  storage:/path/to/file/on/storage

  internal:URL - only for testing
   */
  public get_resource_url(url: string): string {
    if (url) {
      // console.log(url);
      const url_parts = url.split(':');
      const protocol = url_parts[0];
      // console.log('Protocol ' + protocol);
      switch (protocol) {
        case 'http':
        case 'https':
          // Simply pass the url on
          return url;
        case 'data':
          const data_url_re = /^data:([\w-]+\/[\w-]+)?(;base64)?,(.*)$/;
  ﻿         // We need to distinguish internal data: schema and normal data url
          if (data_url_re.test(url)) {
            // we have data url, so let's simply pass it
            return url;
          }
          // TODO: link to data from db
          // Return url to retrieve item from DB
          return '';
        case 'internal':
          // Internal url on the web
          return url_parts[1];
        case 'storage':
          return base_url + 'storage/get' + url_parts[1];
      }
    }
    return '';
  }

  public get_resource_thumb_url(di: DigitalItem): string {
    return this._join_path(base_url, 'storage/resource', di.id_item, 'thumbnail');
  }

  public get_mods_url(di: DigitalItem): string {
    return base_url + 'mods/di/' + di.id_item;
  }

  public upload_mods(di: DigitalItem, mods: string): Promise<APIResponse<DigitalItem>> {
    return this.generic_request_put<string, DigitalItem>(this._join_path('mods/di', di.id_item), mods);
  }

  public get_vrmod_url(): string {
    return vrmod_url;
  }

  public generate_spi(ds: DigitalSetInterface): Promise<string> {
    const url = this._prepare_url(this._join_path('export/', ds.id_set), {});
    return new Promise<string>((resolve, reject) => {
      this.httpClient.get(url, {observe: 'body', responseType: 'text'})
        .subscribe(res => {
          console.log(res);
          resolve(res);
        });
    });
  }

  private _prepare_params(params: { [key: string]: string }): string {
    if (!params) {
      params = {};
    }
    const token = this.get_token();
    if (token) {
      params['token'] = token;
    }
    return Object.keys(params).map(e => e.toString() + '=' + (params[e] ? params[e].toString() : '')).join('&');
  }


  private _prepare_url(url_fragment: string, params: { [key: string]: string }): string {
    const param_string = this._prepare_params(params);
    return base_url + url_fragment + (param_string ? '?' + param_string : '');
  }

}

