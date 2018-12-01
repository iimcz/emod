from cornice.resource import resource, view
from cornice import Service
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from pyramid.request import Request
import sqlalchemy
from uuid import uuid4
import datetime

from naki.model import DigitalItem, DIGroup, DigitalSet, DBSession, MetaKey, Metadata, Link, GroupItem, ContainerItem, Container, User
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.digital_item import DigitalItemSchema
from naki.schemas.digital_group import DigitalGroupSchema
from naki.schemas.digital_set import DigitalSetSchema
from naki.lib.auth import RIGHTS
from naki.lib.rest import APIResponse
from naki.lib.utils import get_list_params, check_missing_metakeys, update_metadata, add_metadata_record


@resource(path='/api/v1/dis/{id:[a-zA-Z0-9-]*}', collection_path='/api/v1/diss', cors_policy=NAKI_CORS_POLICY)
class DSRes(object):
    def __init__(self, request, context=None):
        self._context = context
        self._request = request


    @view(permission=Everyone)
    def get(self):
        set_id = self._request.matchdict['id']
        try:
            dset = DBSession.query(DigitalSet).filter(DigitalSet.id_set== set_id).one()
            return APIResponse(add_metadata_record(dset.get_dict(), dset.id_set, 'set'))
        except Exception as e:
            print(e)
            raise HTTPNotFound()

    @view(permission=Everyone, schema=DigitalSetSchema, validators=(colander_body_validator,))
    def put(self):
        set_id = self._request.matchdict['id']
        try:
            dset = DBSession.query(DigitalSet).filter(DigitalSet.id_set == set_id).one()
            dset.set_from_dict(self._request.validated)
            # metadata = [x for x in DBSession.query(Metadata).filter(Metadata.id == dset.id_set).all()]
            update_metadata(self._request.validated['metadata'], dset.id_set, 'set')
            DBSession.flush()
            return APIResponse(add_metadata_record(dset.get_dict(), dset.id_set, 'set'))

        except Exception as e:
            print(e)
            raise HTTPNotFound()


    def _get_subq_base(self):
        return DBSession.query(DigitalSet.id_set) \
            .outerjoin(Metadata, sqlalchemy.and_(Metadata.id == DigitalSet.id_set, Metadata.target == 'set'))

    def _get_subq_with_key(self, key, parent):
        subq = self._get_subq_base()
        if parent is not None:
            subq = subq.join(parent, parent.c.sID_Set == DigitalSet.id_set)
        return subq.filter(Metadata.value.contains(key)).group_by(DigitalSet.id_set)


    @view(permission=Everyone)
    def collection_get(self):
        params = get_list_params(self._request)
        if len(params.query_keys) == 0:
            subq = self._get_subq_base().group_by(DigitalSet.id_set)
        else:
            subq = self._get_subq_with_key(params.query_keys[0], None)
            for idx, key in enumerate(params.query_keys[1:]):
                subq = self._get_subq_with_key(key, subq.subquery('subq%d'%idx))

        if params.dry:
            return APIResponse(subq.count())

        subq = subq.offset(params.offset).limit(params.limit).subquery('subq')

        sets_raw = DBSession.query(DigitalSet, Metadata, User)\
            .outerjoin(Metadata, Metadata.id == DigitalSet.id_set) \
            .outerjoin(User, User.id_user == DigitalSet.id_user) \
            .join(subq, subq.c.sID_Set == DigitalSet.id_set)\
            .all()

        sets = {}
        for bundle in sets_raw:
            set_id = bundle[0].id_set
            if not set_id in sets:
                sets[set_id] = bundle[0].get_dict()
                sets[set_id]['author'] = bundle[2].get_dict()
                sets[set_id]['metadata'] = []
            setx = sets[set_id]
            if bundle[1]:
                if not next((x for x in setx['metadata'] if x['key'] == bundle[1].key), None):
                    setx['metadata'].append(bundle[1].get_dict())


        return APIResponse([sets[x] for x in sets])

    @view(permission=RIGHTS.Editor, schema=DigitalSetSchema, validators=(colander_body_validator,))
    def collection_post(self):
        self._request.validated['id_set'] = str(uuid4())
        self._request.validated['created'] = datetime.datetime.now()
        # di = DigitalItem(**self._request.validated)
        v = self._request.validated
        print(v)
        metakeys = [m['key'] for m in v['metadata']]
        print(metakeys)

        missing_metakeys = check_missing_metakeys(metakeys, 's')
        if len(missing_metakeys) > 0:
            raise HTTPBadRequest('missing metadata keys: %s' % ', '.join(missing_metakeys))

        dset = DigitalSet(v['id_set'], v['created'], '', v['id_user'])

        update_metadata(v['metadata'], dset.id_set, 'set')

        DBSession.add(dset)
        DBSession.flush()

        return APIResponse(add_metadata_record(dset.get_dict(), dset.id_set, 'set'))

