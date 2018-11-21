from cornice.resource import resource, view
from cornice import Service
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.security import Everyone
from pyramid.request import Request
import sqlalchemy
import datetime
from naki.model import DBSession, View
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.container import ContainerSchema
from naki.lib.rest import APIResponse
from naki.model import View, Metadata, MetaKey, ViewItem, DigitalItem, Container, ContainerItem

#from naki.schemas.link import LinkSchema
from uuid import uuid4

@resource(path='/api/v1/view/{view_id}/container/{container_id}', collection_path='/api/v1/view/{view_id}/containers', cors_policy=NAKI_CORS_POLICY)
class ContainerRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request
        self._view_id = self._request.matchdict['view_id']

    @view(permission=Everyone)
    def get(self):
        container_id = self._request.matchdict['container_id']
        items = DBSession.query(Container, ContainerItem)\
            .join(ContainerItem, ContainerItem.id_container == Container.id_container)\
            .filter(Container.id_view == self._view_id)\
            .filter(ContainerItem.id_container == container_id)\
            .all()
        if len(items) == 0:
            raise HTTPNotFound()

        ret = items[0][0].get_dict();
        ret['item_ids'] = [x[1].id_item for x in items]
        return APIResponse(ret)

    @view(permission=Everyone)
    def delete(self):
        container_id = self._request.matchdict['container_id']
        cnt = DBSession.query(Container).filter(Container.id_view == self._view_id).filter(Container.id_container == container_id).one()
        cntitems = DBSession.query(ContainerItem).filter(ContainerItem.id_container == container_id).all()
        for itm in cntitems:
            DBSession.delete(cnt)
        DBSession.delete(cnt)
        DBSession.flush()
        return APIResponse(True)


    @view(permission=Everyone, schema=ContainerSchema, validators=(colander_body_validator,))
    def put(self):
        v = self._request.validated
        container_id = self._request.matchdict['container_id']
        cnt = DBSession.query(Container).filter(sqlalchemy.and_(Container.id_container == container_id, Container.id_view == self._view_id)).one()
        cnt.set_from_dict(v)
        sr = Request.blank('/api/v1/view/' + self._view_id + '/container/' + cnt.id_container)
        return self._request.invoke_subrequest(sr)


    @view(permission=Everyone)
    def collection_get(self):
        cnts = DBSession.query(Container).filter(Container.id_view == self._view_id).all()
        return APIResponse([x.get_dict() for x in cnts])




    @view(permission=Everyone, schema=ContainerSchema, validators=(colander_body_validator,))
    def collection_post(self):
        v = self._request.validated
        v['id_container']=str(uuid4())
        v['id_view'] = self._view_id
        cnt = Container(v['id_container'], v['id_view'], v['type'], '', v['x'], v['y'], v['width'], v['height'], v['z'], v['data'])
        DBSession.add(cnt)
        for item in v['item_ids']:
            ci = ContainerItem(v['id_container'], item, '{}')
            DBSession.add(ci)
        sr = Request.blank('/api/v1/view/' + self._view_id + '/container/' + cnt.id_container)
        return self._request.invoke_subrequest(sr)
        # return APIResponse([x.get_dict() for x in cnts])



container_item_service = Service(name='container_item_manip', path='/api/v1/view/{view_id:[a-zA-Z0-9-]+}/container/{container_id}/item/{item_id:[a-zA-Z0-9-]+}', description='Test servicex', cors_policy=NAKI_CORS_POLICY)

@container_item_service.put()
def view_item_service_func(request):
    view_id = request.matchdict['view_id']
    container_id = request.matchdict['container_id']
    item_id = request.matchdict['item_id']
    ci = ContainerItem(container_id, item_id, '')
    DBSession.add(ci)
    req = Request.blank('/api/v1/view/' + view_id + '/container/' + container_id)
    return request.invoke_subrequest(req)

@container_item_service.delete()
def view_item_service_func2(request):
    view_id = request.matchdict['view_id']
    container_id = request.matchdict['container_id']
    item_id = request.matchdict['item_id']
    ci = DBSession.query(ContainerItem, Container)\
        .join(Container, Container.id_container == ContainerItem.id_container)\
        .filter(Container.id_view == view_id)\
        .filter(sqlalchemy.and_(ContainerItem.id_container == container_id, ContainerItem.id_item == item_id))\
        .one()

    DBSession.delete(ci[0])
    req = Request.blank('/api/v1/view/' + view_id + '/container/' + container_id)
    return request.invoke_subrequest(req)

