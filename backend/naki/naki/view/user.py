from cornice.resource import resource, view
from cornice.validators import colander_body_validator
from pyramid.httpexceptions import HTTPNotFound, HTTPUnauthorized
from pyramid.security import Everyone
import sqlalchemy
import uuid

from naki.model import DBSession, User
from naki.lib.auth import RIGHTS, hash_pw
from naki.lib.cors import NAKI_CORS_POLICY
from naki.lib.rest import APIResponse
from naki.lib.utils import get_list_params
from naki.schemas.user import UserSchema


@resource(path='/api/v1/user/{id_user}', collection_path='/api/v1/users', cors_policy=NAKI_CORS_POLICY)
class UsersRes(object):
    def __init__(self, request, context = None):
        self._context = context
        self._request = request

    def _verify_access(self):
        '''
        Verifies that logged user has rights to edit/view specified user
        :return:
        '''
        id_user = self._request.matchdict['id_user']
        if self._request.user.id_user != id_user and self._request.user.auth_level < 3:
            # User is requesting data about different user and is not an admin. That is no-no
            raise HTTPUnauthorized()
        return DBSession.query(User).filter(User.id_user == id_user).one()

    @view(permission=RIGHTS.Guest)
    def get(self):
        user = self._verify_access()
        return APIResponse(user.get_dict())

    @view(permission=RIGHTS.Guest, schema=UserSchema, validators=(colander_body_validator,))
    def put(self):
        user = self._verify_access()
        v = self._request.validated
        if self._request.user.auth_level < 3:
            v['auth_level'] = user.auth_level
        print(v)
        user.set_from_dict(v)

        # set_dict() doesn't set password, so let's hash and update it manually
        new_pw =  v.get('passwd', '')
        if new_pw:
            user.passwd = hash_pw(new_pw)

        DBSession.flush()
        return APIResponse(user.get_dict())

    @view(permission=RIGHTS.Admin)
    def collection_get(self):
        params = get_list_params(self._request)
        users = DBSession.query(User)
        if len(params.query_keys) > 0:
            users = users.filter(sqlalchemy.and_(
                *[sqlalchemy.or_(User.id_user.value.contains(key), User.username.contains(key), User.fullname.contains(key)) for key in params.query_keys]))
        if params.dry:
            return APIResponse(users.count())
        users = users.offset(params.offset).limit(params.limit)
        return APIResponse([x.get_dict() for x in users.all()])


    @view(permission=RIGHTS.Admin, schema=UserSchema, validators=(colander_body_validator,))
    def collection_post(self):
        v = self._request.validated
        user = User(str(uuid.uuid4()), v['username'], v['fullname'], hash_pw(v['passwd']), v['auth_level'])
        DBSession.add(user)
        DBSession.flush()
        return APIResponse(user.get_dict())

