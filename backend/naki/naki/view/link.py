from cornice.resource import resource, view
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from naki.model import DBSession, Link
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.link import LinkSchema
from uuid import uuid4

@resource(path='/api/v1/link/{link_id}', collection_path='/api/v1/links/{item_id}', cors_policy=NAKI_CORS_POLICY)
class LinkRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request


    @view(permission=Everyone)
    def get(self):
        # item_id = self._request.matchdict['item_id']
        link_id = self._request.matchdict['link_id']
        try:
            res = DBSession.query(Link).filter(Link.id_link == link_id).one()
            return res.get_dict()
        except:
            raise HTTPNotFound()

    #
    # @view(permission=Everyone, schema=MetadataSchema, validators=(colander_body_validator,))
    # def put(self):
    #     item_id = self._request.matchdict['id']
    #     key = self._request.matchdict['key']
    #     try:
    #         res = DBSession.query(Metadata).filter(Metadata.key == key).filter(Metadata.id == item_id).one()
    #         res.value = self._request.validated['value']
    #         DBSession.flush()
    #         return res.get_dict()
    #     except Exception as e:
    #         print(str(e))
    #         raise HTTPBadRequest()
    #
    # @view(permission=Everyone)
    # def collection_get(self):
    #     item_id = self._request.matchdict['id']
    #     try:
    #         res = DBSession.query(Metadata).filter(Metadata.id == item_id).all()
    #         return [r.get_dict() for r in res]
    #     except Exception as e:
    #         print(str(e))
    #         raise HTTPNotFound()
    #
    @view(permission=Everyone, schema=LinkSchema, validators=(colander_body_validator,))
    def collection_post(self):
        item_id = self._request.matchdict['item_id']
        try:
            v = self._request.validated
            link = Link(str(uuid4()), item_id, v['id_user'], v['type'], v['description'], v['uri'])
            link = Link(str(uuid4()), item_id, v['id_user'], v['type'], v['description'], v['uri'])
            DBSession.add(link)
            DBSession.flush()
            return link.get_dict()
        except Exception as e:
            print(str(e))
            return HTTPBadRequest

    #
    #                 # @view(permission=Everyone)
    def collection_get(self):
        item_id = self._request.matchdict['item_id']
        return [x.get_dict() for x in DBSession.query(Link).filter(Link.id_item == item_id).all()]


    # #
    # # @view(permission=Everyone, schema = DigitalItemSchema, validators=(colander_body_validator,))
    # # def collection_post(self):
    # #     self._request.validated['id_item'] = str(uuid4())
    # #     self._request.validated['created'] = datetime.datetime.now()
    # #     #di = DigitalItem(**self._request.validated)
    # #     v = self._request.validated
    # #     di = DigitalItem(v['id_item'], v['mime'], v['created'], '', v['author'], v['rights'])
    # #     print(di)
    #
    #     required_keys = DBSession.query(MetaKey).filter(MetaKey.mandatory.contains('i'))
    #     print('Required keys: %s' % (','.join((x.key for x in required_keys))))
    #
    #     DBSession.add(di)
    #     DBSession.flush()
    #     print(di)
    #     return di.get_dict()