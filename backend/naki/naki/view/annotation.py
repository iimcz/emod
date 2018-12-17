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
from naki.schemas.annotation import AnnotationSchema
from naki.lib.auth import RIGHTS, RIGHTLevels


@resource(path='/api/v1/di/{item_id:[a-zA-Z0-9-]*}/annotation/{annot_id:[a-zA-Z0-9-]*}', collection_path='/api/v1/di/{item_id:[a-zA-Z0-9-]*}/annotations', cors_policy=NAKI_CORS_POLICY)
class DIAnnotRes(object):
    def __init__(self, request, context = None):
        self._request = request
        self._context = context
        self.item_id = self._request.matchdict['item_id']

    @view(permission=RIGHTS.Researcher)
    def delete(self):
        annotation_id = self._request.matchdict['annot_id']
        q = DBSession.query(Link).filter(Link.id_link == annotation_id)
        if self._request.user.auth_level < RIGHTLevels.Editor:
            q = q.filter(Link.id_user == self._request.user.id_user)
        link = q.one()
        DBSession.delete(link)
        DBSession.flush()
        return APIResponse(True)

    @view(permission=RIGHTS.Researcher,  schema=AnnotationSchema, validators=(colander_body_validator,))
    def collection_post(self):
        v = self._request.validated
        v['id_user'] = self._request.user.id_user
        type = 'annotation'
        if v['time'] > 0 or v['duration'] > 0:
            if v['duration'] > 0:
                type = '%s;%d;%d' % (type, v['time'], v['duration'])
            else:
                type = '%s;%d' % (type, v['time'])
        link = Link(str(uuid4()), v['id_item'], v['id_user'], type, '', v['uri'])
        DBSession.add(link)
        DBSession.flush()
        return APIResponse(link.get_dict())
