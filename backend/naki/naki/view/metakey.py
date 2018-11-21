from cornice.resource import resource, view
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound
from pyramid.security import Everyone
from naki.model import DBSession, MetaKey
from naki.lib.cors import NAKI_CORS_POLICY
from naki.lib.rest import APIResponse
from naki.schemas.metakey import MetaKeySchema


@resource(path='/api/v1/metakey/{key}', collection_path='/api/v1/metakeys', cors_policy=NAKI_CORS_POLICY)
class MetaKeyRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request
        # print ('Req :%s' % request)
        # print('ctx: %s' % context)


    @view(permission=Everyone)
    def get(self):
        key = self._request.matchdict['key']
        try:
            metakey = DBSession.query(MetaKey).filter(MetaKey.key == key).one()
            return APIResponse(metakey.get_dict())
        except:
            raise HTTPNotFound()

    @view(permission=Everyone, schema=MetaKeySchema, validators=(colander_body_validator,))
    def put(self):
        key = self._request.matchdict['key']
        metakey = DBSession.query(MetaKey).filter(MetaKey.key == key).one()
        metakey.set_from_dict(self._request.validated)
        DBSession.flush()
        return APIResponse(metakey.get_dict())

    @view(permission=Everyone)
    def collection_get(self):
        return APIResponse([x.get_dict() for x in DBSession.query(MetaKey).all()])



    # @view(permission=Everyone)
    # def collection_get(self):
    #     return [x.get_dict() for x in DBSession.query(DigitalItem).all()]
    #
    # @view(permission=Everyone, schema = DigitalItemSchema, validators=(colander_body_validator,))
    # def collection_post(self):
    #     self._request.validated['id_item'] = str(uuid4())
    #     self._request.validated['created'] = datetime.datetime.now()
    #     #di = DigitalItem(**self._request.validated)
    #     v = self._request.validated
    #     di = DigitalItem(v['id_item'], v['mime'], v['created'], '', v['author'], v['rights'])
    #     print(di)
    #
    #     required_keys = DBSession.query(MetaKey).filter(MetaKey.mandatory.contains('i'))
    #     print('Required keys: %s' % (','.join((x.key for x in required_keys))))
    #
    #     DBSession.add(di)
    #     DBSession.flush()
    #     print(di)
    #     return di.get_dict()