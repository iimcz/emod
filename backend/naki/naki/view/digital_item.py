# from colanderalchemy import SQLAlchemySchemaNode
from cornice import Service
from cornice.resource import resource, view
from cornice.validators import colander_body_validator
import datetime
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
import sqlalchemy

from uuid import uuid4

from naki.lib.cors import NAKI_CORS_POLICY
from naki.lib.rest import APIResponse
from naki.lib.utils import get_list_params, check_missing_metakeys, update_metakeys, update_metadata, add_metadata_record
from naki.model import DigitalItem, DBSession, MetaKey, Metadata, Link, GroupItem
from naki.schemas.digital_item import DigitalItemSchema
from naki.lib.auth import RIGHTS
# di_schema = SQLAlchemySchemaNode(DigitalItem)


@resource(path='/api/v1/di/{id:[a-zA-Z0-9-]*}', collection_path='/api/v1/dis', cors_policy=NAKI_CORS_POLICY)
class DIRes(object):
    def __init__(self, request, context=None):
        self._context = context
        self._request = request
        # print ('Req :%s' % request)
        # print('ctx: %s' % context)

    def _add_metadata(self, item):
        ret = add_metadata_record(item.get_dict(), item.id_item, 'item')
        ret['links'] = [x.get_dict() for x in DBSession.query(Link) \
                               .filter(Link.id_item == item.id_item) \
                               .all()]
        return ret

    @view(permission=Everyone)
    def get(self):
        print(DigitalItemSchema)
        di_id = self._request.matchdict['id']
        try:
            item = DBSession.query(DigitalItem).filter(DigitalItem.id_item == di_id).one()
            return APIResponse(self._add_metadata(item))
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    @view(permission=RIGHTS.Editor, schema=DigitalItemSchema, validators=(colander_body_validator,))
    def put(self):
        di_id = self._request.matchdict['id']
        try:
            item = DBSession.query(DigitalItem).filter(DigitalItem.id_item == di_id).one()
            item.set_from_dict(self._request.validated)
            update_metadata(self._request.validated['metadata'], item.id_item, 'item')
            DBSession.flush()
            return APIResponse(self._add_metadata(item))
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    def _get_subq_base(self):
        return DBSession.query(DigitalItem.id_item) \
            .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == DigitalItem.id_item, Metadata.target == 'item'))

    def _get_subq_with_key(self, key, parent):
        subq = self._get_subq_base()
        if parent is not None:
            subq = subq.join(parent, parent.c.sID_Item == DigitalItem.id_item)
        return subq.filter(sqlalchemy.or_(Metadata.value.contains(key), DigitalItem.mime.contains(key))).group_by(DigitalItem.id_item)

    @view(permission=Everyone)
    def collection_get(self):
        params = get_list_params(self._request)
        # subq = DBSession.query(DigitalItem.id_item)\
        #     .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == DigitalItem.id_item, Metadata.target == 'item'))
        # if len(params.query_keys) > 0:
        #     # TODO: Search with multiple search keys is BROKEN (all the keys have to be in the same metadata-value...)
        #     subq = subq.filter(sqlalchemy.and_(*[sqlalchemy.or_(Metadata.value.contains(key), DigitalItem.mime.contains(key)) for key in params.query_keys]))
        # subq = subq.group_by(DigitalItem.id_item)

        if len(params.query_keys) == 0:
            subq = self._get_subq_base().group_by(DigitalItem.id_item)
        else:
            subq = self._get_subq_with_key(params.query_keys[0], None)
            for idx, key in enumerate(params.query_keys[1:]):
                subq = self._get_subq_with_key(key, subq.subquery('subq%d'%idx))

        if params.dry:
            return APIResponse(subq.count())

        subq = subq.offset(params.offset).limit(params.limit).subquery('subq')

        items_raw = DBSession.query(DigitalItem, Link, Metadata)\
            .outerjoin(Link, Link.id_item == DigitalItem.id_item)\
        .outerjoin(Metadata, Metadata.id == DigitalItem.id_item)\
        .join(subq, subq.c.sID_Item == DigitalItem.id_item)\
        .all()

        items = {}
        for bundle in items_raw:
            item_id = bundle[0].id_item
            if not item_id in items:
                items[item_id] = bundle[0].get_dict()
                items[item_id]['links'] = []
                items[item_id]['metadata'] = []
            item = items[item_id]
            if bundle[1]:
                if not next((x for x in item['links'] if x['id_link'] == bundle[1].id_link), None):
                    item['links'].append(bundle[1].get_dict())
            if bundle[2]:
                if not next((x for x in item['metadata'] if x['key'] == bundle[2].key), None):
                    item['metadata'].append(bundle[2].get_dict())


        return APIResponse([items[x] for x in items])



    @view(permission=RIGHTS.Editor, schema=DigitalItemSchema, validators=(colander_body_validator,))
    def collection_post(self):
        self._request.validated['id_item'] = str(uuid4())
        self._request.validated['created'] = datetime.datetime.now()
        # di = DigitalItem(**self._request.validated)
        v = self._request.validated
        print(v)
        metakeys = [m['key'] for m in v['metadata']]
        print(metakeys)

        missing_metakeys = check_missing_metakeys(metakeys, 'i')
        if len(missing_metakeys) > 0:
            raise HTTPBadRequest('missing metadata keys: %s' % ', '.join(missing_metakeys))

        di = DigitalItem(v['id_item'], v['mime'], v['created'], '', v['id_user'], v['rights'])

        update_metadata(v['metadata'], di.id_item, 'item')
        DBSession.add(di)
        DBSession.flush()

        for link in v['links']:
            l = Link(str(uuid4()), di.id_item, link['id_user'], link['type'], link['description'], link['uri'])
            DBSession.add(l)

        for group_id in v['group_ids']:
            print('Adding to group %s' % group_id)
            group_item = GroupItem(group_id, di.id_item, 0, 0)
            DBSession.add(group_item)

        print(di)
        return APIResponse(self._add_metadata(di))


search_res = Service(name='search di', path='/api/v1/search/di')

@search_res.get()
def search_item(request):
    return None


