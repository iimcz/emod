from cornice.resource import resource, view
from cornice import Service
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from pyramid.request import Request
import sqlalchemy
import datetime
from naki.lib.auth import RIGHTS, RIGHTLevels
from naki.model import DBSession, View
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.view import ViewSchema
from naki.lib.rest import APIResponse
from naki.lib.utils import get_list_params, check_missing_metakeys, update_metadata, add_metadata_record, meta_record
from naki.model import View, Metadata, MetaKey, ViewItem, DigitalItem, Container, ContainerItem, User

#from naki.schemas.link import LinkSchema
from uuid import uuid4

@resource(path='/api/v1/view/{view_id}', collection_path='/api/v1/views', cors_policy=NAKI_CORS_POLICY)
class ViewRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request
    
    def _get_items(self, view):
        bundles = [x for x in
                        DBSession.query(DigitalItem, ViewItem) \
                            .join(ViewItem, ViewItem.id_item == DigitalItem.id_item) \
                            .filter(ViewItem.id_view == view.id_view) \
                            .all()]
        items = []
        for bundle in bundles:
            item = bundle[0].get_dict()
            item['metadata'] = [meta_record(x[1], x[0]) for x in
                               DBSession.query(Metadata, MetaKey) \
                                   .join(MetaKey, Metadata.key == MetaKey.key) \
                                   .filter(sqlalchemy.and_(Metadata.id == item['id_item'], Metadata.target == 'item')) \
                                   .all()]
            item['path'] = bundle[1].path
            items.append(item)
        return items

    @view(permission=Everyone)
    def get(self):
        # item_id = self._request.matchdict['item_id']
        view_id = self._request.matchdict['view_id']
        try:
            view_info = DBSession.query(View).filter(View.id_view == view_id).one()
            res = add_metadata_record(view_info.get_dict(), view_info.id_view, 'view')
            res['items'] = self._get_items(view_info)
            res['containers'] = [x.get_dict() for x in DBSession.query(Container).filter(Container.id_view == view_id).all()]
            return APIResponse(res)
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    @view(permission=RIGHTS.Researcher, schema=ViewSchema, validators=(colander_body_validator,))
    def put(self):
        view_id = self._request.matchdict['view_id']
        try:
            q = DBSession.query(View).filter(View.id_view == view_id)
            if self._request.user.auth_level < RIGHTLevels.Editor:
                q = q.filter(View.id_user == self._request.user.id_user)
            view = q.one()
            view.set_from_dict(self._request.validated)
            update_metadata(self._request.validated['metadata'], view.id_view, 'view')
            DBSession.flush()
            return APIResponse(view.get_dict())
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    def _get_subq_base(self):
        return DBSession.query(View.id_view) \
            .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == View.id_view, Metadata.target == 'view'))

    def _add_user_checking(self, subq):
        if self._request.user is None:
            return subq.filter(View.public == True)
        if self._request.user.auth_level < RIGHTLevels.Editor:
            subq = subq.filter(sqlalchemy.or_(View.public == True, View.id_user == self._request.user.id_user))
        return subq

    def _get_subq_with_key(self, key, parent):
        subq = self._get_subq_base()
        if parent is not None:
            subq = subq.join(parent, parent.c.sID_View == View.id_view)
        subq = self._add_user_checking(subq.filter(Metadata.value.contains(key)))

        return subq.group_by(View.id_view)


    def collection_get(self):
        params = get_list_params(self._request)
        
        if len(params.query_keys) == 0:
            subq = self._add_user_checking(self._get_subq_base().group_by(View.id_view))
        else:
            subq = self._get_subq_with_key(params.query_keys[0], None)
            for idx, key in enumerate(params.query_keys[1:]):
                subq = self._get_subq_with_key(key, subq.subquery('subq%d'%idx))

        if params.dry:
            return APIResponse(subq.count())

        subq = subq.offset(params.offset).limit(params.limit).subquery('subq')

        views_raw = DBSession.query(View, Metadata, User) \
            .outerjoin(Metadata, Metadata.id == View.id_view) \
            .join(User, User.id_user == View.id_user)\
            .join(subq, subq.c.sID_View == View.id_view) \
            .all()

        views = {}
        for bundle in views_raw:
            gid = bundle[0].id_view
            if not gid in views:
                views[gid] = bundle[0].get_dict()
                views[gid]['metadata'] = []
                views[gid]['author'] = bundle[2].get_dict()
            view = views[gid]
            if bundle[1]:
                if not next((x for x in view['metadata'] if x['key'] == bundle[1].key), None):
                    view['metadata'].append(bundle[1].get_dict())

        return APIResponse([views[x] for x in views])


    @view(permission=RIGHTS.Researcher, schema=ViewSchema, validators=(colander_body_validator,))
    def collection_post(self):
        self._request.validated['id_view'] = str(uuid4())
        self._request.validated['created'] = datetime.datetime.now()
        copy_view_id = self._request.GET.get('view_id', '')
        v = self._request.validated
        print(v)
        metakeys = [m['key'] for m in v['metadata']]
        print(metakeys)

        missing_metakeys = check_missing_metakeys(metakeys, 'i')
        if len(missing_metakeys) > 0:
            raise HTTPBadRequest('missing metadata keys: %s' % ', '.join(missing_metakeys))

        view = View(v['id_view'], v['created'], v['description'], v['id_user'], v['public'])
        update_metadata(v['metadata'], view.id_view, 'view')

        DBSession.add(view)
        DBSession.flush()
        #
        # for meta in v['metadata']:
        #     m = Metadata(view.id_view, 'view', meta['key'], meta['value'])
        #     DBSession.add(m)
        # DBSession.flush()

        # If user specified a view_id parameter, let's make a copy
        if copy_view_id:
            old_view = DBSession.query(View).filter(View.id_view == copy_view_id).one()
            old_items = DBSession.query(ViewItem).filter(ViewItem.id_view == copy_view_id).all()
            for item in old_items:
                print('Adding item' + item.id_item)
                vi = ViewItem(view.id_view,item.id_item, item.path)
                DBSession.add(vi)
            old_containers = DBSession\
                .query(Container, ContainerItem)\
                .join(ContainerItem, ContainerItem.id_container == Container.id_container)\
                .filter(Container.id_view == copy_view_id)\
                .all()
            process_conts = {}
            for ci in old_containers:
                cid = ci[0].id_container
                if not cid in process_conts:
                    c = ci[0]
                    new_cid = str(uuid4())
                    print('Adding container %s as %s' %(cid, new_cid))
                    process_conts[cid] = new_cid
                    cont = Container(new_cid, view.id_view, c.type, c.description, c.x, c.y, c.width, c.height, c.z, c.data)
                    DBSession.add(cont)
                else:
                    new_cid = process_conts[cid]

                print('Adding item %s to container %s'%(ci[1].id_item, new_cid))
                citem = ContainerItem(new_cid, ci[1].id_item, ci[1].data)
                DBSession.add(citem)

        print(view)
        return APIResponse(add_metadata_record(view.get_dict(), view.id_view, 'view'))

view_item_service = Service(name='view_item_manip', path='/api/v1/view/{view_id:[a-zA-Z0-9-]+}/item/{item_id:[a-zA-Z0-9-]+}', description='Test servicex', cors_policy=NAKI_CORS_POLICY)

@view_item_service.put(permission=RIGHTS.Researcher)
def view_item_service_func(request):
    view_id = request.matchdict['view_id']
    item_id = request.matchdict['item_id']
    path = request.GET.get('path', None)
    if path == 'null':
        path = None
    vi = DBSession.query(ViewItem).filter(sqlalchemy.and_(
        ViewItem.id_item == item_id,
        ViewItem.id_view == view_id
    )).one_or_none()
    if vi:
        vi.path = path
    else:
        vi = ViewItem(view_id, item_id, path)
        DBSession.add(vi)
    req = Request.blank('/api/v1/di/' + item_id)
    return request.invoke_subrequest(req)


@view_item_service.delete(permission=RIGHTS.Researcher)
def view_item_service_func2(request):
    view_id = request.matchdict['view_id']
    item_id = request.matchdict['item_id']
    vi = DBSession.query(ViewItem).filter(sqlalchemy.and_(ViewItem.id_view == view_id, ViewItem.id_item == item_id)).one()
    usages = DBSession.query(Container, ContainerItem)\
        .join(ContainerItem, ContainerItem.id_container == Container.id_container)\
        .filter(ContainerItem.id_item == item_id)\
        .filter(Container.id_view == view_id)\
        .count()
    if usages > 0:
        raise HTTPBadRequest()

    DBSession.delete(vi)
    req = Request.blank('/api/v1/view/' + view_id)
    return request.invoke_subrequest(req)



