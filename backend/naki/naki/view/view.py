from cornice.resource import resource, view
from cornice import Service
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from pyramid.request import Request
import sqlalchemy
import datetime
from naki.lib.auth import RIGHTS
from naki.model import DBSession, View
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.view import ViewSchema
from naki.lib.rest import APIResponse
from naki.lib.utils import get_list_params
from naki.model import View, Metadata, MetaKey, ViewItem, DigitalItem, Container, ContainerItem, User

#from naki.schemas.link import LinkSchema
from uuid import uuid4

@resource(path='/api/v1/view/{view_id}', collection_path='/api/v1/views', cors_policy=NAKI_CORS_POLICY)
class ViewRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request
    def _meta_record(self, key, data):
        return {'key': key.key, 'type': key.type, 'value': data.value}

    def _get_items(self, view):
        bundles = [x for x in
                        DBSession.query(DigitalItem, ViewItem) \
                            .join(ViewItem, ViewItem.id_item == DigitalItem.id_item) \
                            .filter(ViewItem.id_view == view.id_view) \
                            .all()]
        items = []
        for bundle in bundles:
            item = bundle[0].get_dict()
            item['metadata'] = [self._meta_record(x[1], x[0]) for x in
                               DBSession.query(Metadata, MetaKey) \
                                   .join(MetaKey, Metadata.key == MetaKey.key) \
                                   .filter(sqlalchemy.and_(Metadata.id == item['id_item'], Metadata.target == 'item')) \
                                   .all()]
            item['path'] = bundle[1].path
            items.append(item)
        return items
    def _add_metadata(self, view):
        ret = view.get_dict()
        ret['metadata'] = [self._meta_record(x[1], x[0]) for x in
                           DBSession.query(Metadata, MetaKey)\
                               .join(MetaKey, Metadata.key == MetaKey.key)\
                               .filter(sqlalchemy.and_(Metadata.id == view.id_view, Metadata.target == 'view'))\
                               .all()]
        return ret

    @view(permission=Everyone)
    def get(self):
        # item_id = self._request.matchdict['item_id']
        view_id = self._request.matchdict['view_id']
        try:
            view_info = DBSession.query(View).filter(View.id_view == view_id).one()
            res = self._add_metadata(view_info)
            res['items'] = self._get_items(view_info)
            res['containers'] = [x.get_dict() for x in DBSession.query(Container).filter(Container.id_view == view_id).all()]
            return APIResponse(res)
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    def _get_subq_base(self):
        return DBSession.query(View.id_view) \
            .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == View.id_view, Metadata.target == 'view'))

    def _add_user_checking(self, subq):
        if self._request.user is None:
            return subq.filter(View.public == True)
        if self._request.user.auth_level < 2:
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
        # limit = self._request.GET.get('limit', 10)
        # offset = self._request.GET.get('offset', 0)
        # q = self._request.GET.get('q', '')
        # dry = self._request.GET.get('dry', '0') == '1'
        # query_keys = [x for x in q.split(' ') if len(x) > 0]

        # subq = DBSession.query(View.id_view) \
        #     .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == View.id_view, Metadata.target == 'view'))
        # if len(params.query_keys) > 0:
        #     subq = subq.filter(sqlalchemy.and_(
        #         *[Metadata.value.contains(key) for key in params.query_keys]))
        # subq = subq.group_by(View.id_view)

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

        v = self._request.validated
        print(v)
        metakeys = [m['key'] for m in v['metadata']]
        print(metakeys)

        required_keys = DBSession.query(MetaKey).filter(MetaKey.mandatory.contains('v'))
        print('Required keys: %s' % (','.join((x.key for x in required_keys))))
        for key in required_keys:
            if not key.key in metakeys:
                print('Missing key %s' % key.key)
                raise HTTPBadRequest('missing metadata key %s' % key.key)

        present_keys = [x for x in DBSession.query(MetaKey).filter(MetaKey.key.in_(metakeys)).all()]
        new_keys = [m for m in metakeys if not m in (x.key for x in present_keys)]
        print('All keys: %s' % str(metakeys))
        print('New keys: %s' % str(new_keys))
        print('Present keys: %s' % (', '.join(str(x.get_dict()) for x in present_keys)))

        for key in new_keys:
            k = MetaKey(key, 'string', '', '')
            DBSession.add(k)
            print('Created key %s' % key)


        view = View(v['id_view'], v['created'], v['description'], v['id_user'], v['public'])
        DBSession.add(view)
        DBSession.flush()

        for meta in v['metadata']:
            m = Metadata(view.id_view, 'view', meta['key'], meta['value'])
            DBSession.add(m)
        DBSession.flush()

        print(view)
        return APIResponse(self._add_metadata(view))


        #
        #
        #
        # data = self._request.validated
        #
        # DBSession.add(view)
        # DBSession.flush()
        # return APIResponse(view.get_dict())


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



