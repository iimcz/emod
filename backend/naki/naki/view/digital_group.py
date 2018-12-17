from cornice.resource import resource, view
from cornice import Service
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from pyramid.request import Request
import sqlalchemy
from uuid import uuid4
import datetime

from naki.model import DigitalItem, DIGroup, DBSession, MetaKey, Metadata, Link, GroupItem, ContainerItem, Container
from naki.lib.auth import RIGHTS
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.digital_item import DigitalItemSchema
from naki.schemas.digital_group import DigitalGroupSchema
from naki.lib.rest import APIResponse
from naki.lib.utils import update_metadata, check_missing_metakeys, add_metadata_record, meta_record


@resource(path='/api/v1/dig/{id:[a-zA-Z0-9-]*}', collection_path='/api/v1/digs', cors_policy=NAKI_CORS_POLICY)
class DGRes(object):
    def __init__(self, request, context=None):
        self._context = context
        self._request = request

    @view(permission=Everyone)
    def get(self):
        dg_id = self._request.matchdict['id']
        dgs = [x for x in DBSession.query(DIGroup, DigitalItem) \
            .outerjoin(GroupItem, GroupItem.id_group == DIGroup.id_group) \
            .outerjoin(DigitalItem, DigitalItem.id_item == GroupItem.id_item) \
            .filter(DIGroup.id_group == dg_id) \
            .all()]
        if len(dgs) == 0:
            raise HTTPNotFound()

        dg = add_metadata_record(dgs[0][0].get_dict(), dgs[0][0].id_group, 'group')
        meta = DBSession.query(Metadata, MetaKey) \
            .join(MetaKey, MetaKey.key == Metadata.key) \
            .filter(Metadata.target == 'item') \
            .filter(Metadata.id.in_([x[1].id_item for x in dgs if x[1]])) \
            .all()
        dg['items'] = []
        for bundle in dgs:
            if not bundle[1]:
                continue
            item = bundle[1].get_dict()
            item['metadata'] = [meta_record(x[1], x[0]) for x in meta if x[0].id == bundle[1].id_item]
            dg['items'].append(item)
        # dg['items'] = [x[1].get_dict() for x in dgs if x[1]]
        return APIResponse(dg)

    @view(permission=Everyone)
    def collection_get(self):
        limit = self._request.GET.get('limit', 10)
        offset = self._request.GET.get('offset', 0)
        q = self._request.GET.get('q', '')
        dry = self._request.GET.get('dry', '0') == '1'
        query_keys = [x for x in q.split(' ') if len(x) > 0]
        subq = DBSession.query(DIGroup.id_group) \
            .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == DIGroup.id_group, Metadata.target == 'group'))
        if len(query_keys) > 0:
            subq = subq.filter(sqlalchemy.and_(
                *[Metadata.value.contains(key) for key in query_keys]))
        subq = subq.group_by(DIGroup.id_group)

        if dry:
            return APIResponse(subq.count())

        subq = subq.offset(offset).limit(limit).subquery('subq')

        groups_raw = DBSession.query(DIGroup, Metadata) \
            .outerjoin(Metadata, Metadata.id == DIGroup.id_group) \
            .join(subq, subq.c.sID_Group == DIGroup.id_group) \
            .all()

        groups = {}
        for bundle in groups_raw:
            gid = bundle[0].id_group
            if not gid in groups:
                groups[gid] = bundle[0].get_dict()
                groups[gid]['metadata'] = []
            group = groups[gid]
            if bundle[1]:
                if not next((x for x in group['metadata'] if x['key'] == bundle[1].key), None):
                    group['metadata'].append(bundle[1].get_dict())

        return APIResponse([groups[x] for x in groups])

    @view(permission=RIGHTS.Editor, schema=DigitalGroupSchema, validators=(colander_body_validator,))
    def put(self):
        dg_id = self._request.matchdict['id']
        try:
            group = DBSession.query(DIGroup).filter(DIGroup.id_group == dg_id).one()
            update_metadata(self._request.validated['metadata'], group.id_group, 'group')
            DBSession.flush()
            # return APIResponse(self._add_metadata(group))
            return APIResponse(add_metadata_record(group.get_dict(), group.id_group, 'group'))
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    @view(permission=RIGHTS.Editor, schema=DigitalGroupSchema, validators=(colander_body_validator,))
    def collection_post(self):
        self._request.validated['id_group'] = str(uuid4())
        self._request.validated['created'] = datetime.datetime.now()

        v = self._request.validated
        print(v)
        metakeys = [m['key'] for m in v['metadata']]
        print(metakeys)

        missing_metakeys = check_missing_metakeys(metakeys, 'g')
        if len(missing_metakeys) > 0:
            raise HTTPBadRequest('missing metadata keys: %s' % ', '.join(missing_metakeys))

        dg = DIGroup(v['id_group'], v['created'], '', v['id_user'], v['type'])
        update_metadata(v['metadata'], dg.id_group, 'group')
        DBSession.add(dg)
        DBSession.flush()

        print(dg)
        return APIResponse(add_metadata_record(dg.get_dict(), dg.id_group, 'group'))


group_item_service = Service(name='group_item_manip',
                             path='/api/v1/dig/{group_id:[a-zA-Z0-9-]+}/item/{item_id:[a-zA-Z0-9-]+}',
                             description='Test service', cors_policy=NAKI_CORS_POLICY)


@group_item_service.put(permission=RIGHTS.Editor)
def group_item_service_func(request):
    group_id = request.matchdict['group_id']
    item_id = request.matchdict['item_id']
    gi = GroupItem(group_id, item_id, 0, 0)
    DBSession.add(gi)
    req = Request.blank('/api/v1/di/' + item_id)
    return request.invoke_subrequest(req)


@group_item_service.delete(permission=RIGHTS.Editor)
def group_item_service_func_del(request):
    group_id = request.matchdict['group_id']
    item_id = request.matchdict['item_id']
    gi = DBSession.query(GroupItem).filter(
        sqlalchemy.and_(GroupItem.id_group == group_id, GroupItem.id_item == item_id)).one()
    DBSession.delete(gi)
    DBSession.flush()
    req = Request.blank('/api/v1/dig/' + group_id)
    return request.invoke_subrequest(req)
