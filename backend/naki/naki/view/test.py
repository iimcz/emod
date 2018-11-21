
from cornice import Service
from naki.model.digital_item import DigitalItem
from naki.model.meta import DBSession
from pyramid.request import Request
from pyramid.security import Everyone
from naki.lib.auth import RIGHTS
test_service = Service(
    name='login', path='/api/v1/test', description='Test service')


@test_service.get(permission=Everyone)
def test_impl1(request):
    di = DigitalItem(0, 'aaa', '2018-02-03', u'asdasdasdasdasd', u'asdadasdasd', 5)
    r = DBSession.execute("SHOW SESSION STATUS")
    print(request.user)
    return {'result':'ok', 'data': di.get_dict(), 'status': str([str(x) for x in r if 'ssl' in (x[0].lower())])}


test_service2 = Service(
    name='logisdn', path='/api/v1/test/{id1}/item/{id2}', description='Test service')


@test_service2.get(permission=RIGHTS.Guest)
def test_impl(request):
    id1 = request.matchdict['id1']
    id2 = request.matchdict['id2']
    return {'id1': id1, 'id2': id2}


test_service3 = Service(
    name='logisd3n', path='/api/v1/test/{id1}/boo', description='Test service')


@test_service3.get()
def test_impl3(request):
    id1 = request.matchdict['id1']
    rb = Request.blank('/api/v1/di/' + id1)
    print('Caling test')
    res = request.invoke_subrequest(rb)
    return res