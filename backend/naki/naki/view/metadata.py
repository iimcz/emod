
from cornice.resource import resource, view
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from naki.model import DBSession, MetaKey, Metadata
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.metadata import MetadataSchema


@resource(path='/api/v1/metadata/{id}/{key}', collection_path='/api/v1/metadata/{id}', cors_policy=NAKI_CORS_POLICY)
class MetaDataRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request
        # print ('Req :%s' % request)
        # print('ctx: %s' % context)


    @view(permission=Everyone)
    def get(self):
        item_id = self._request.matchdict['id']
        key = self._request.matchdict['key']
        try:
            res = DBSession.query(Metadata).filter(Metadata.key == key).filter(Metadata.id == item_id).one()
            return res.get_dict()
        except:
            raise HTTPNotFound()


    @view(permission=Everyone, schema=MetadataSchema, validators=(colander_body_validator,))
    def put(self):
        item_id = self._request.matchdict['id']
        key = self._request.matchdict['key']
        try:
            res = DBSession.query(Metadata).filter(Metadata.key == key).filter(Metadata.id == item_id).one()
            res.value = self._request.validated['value']
            DBSession.flush()
            return res.get_dict()
        except Exception as e:
            print(str(e))
            raise HTTPBadRequest()

    @view(permission=Everyone)
    def collection_get(self):
        item_id = self._request.matchdict['id']
        try:
            res = DBSession.query(Metadata).filter(Metadata.id == item_id).all()
            return [r.get_dict() for r in res]
        except Exception as e:
            print(str(e))
            raise HTTPNotFound()

    @view(permission=Everyone, schema=MetadataSchema, validators=(colander_body_validator,))
    def collection_post(self):
        key = self._request.validated['key']
        item_id = self._request.matchdict['id']
        try:
            # Let's check if the id/key pair is already present. If it is, then bail out
            res = DBSession.query(Metadata).filter(Metadata.id == item_id).filter(Metadata.key == key).count()
            if res:
                print('key already present...')
                raise HTTPBadRequest()
            # We're adding new metadata, so let's check whether the key is already present in metaKey table
            meta_key = [x for x in DBSession.query(MetaKey).filter(MetaKey.key == key).all()]
            if len(meta_key) < 1:
                # nope, so let's create it
                meta_key = MetaKey(key, 'string', '', '')
                DBSession.add(meta_key)

            metadata = Metadata(item_id, 'item', key, self._request.validated['value'])
            DBSession.add(metadata)
            DBSession.flush()
            return metadata.get_dict()
        except Exception as e:
            print(str(e))
            raise HTTPBadRequest()



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