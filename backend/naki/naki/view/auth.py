from cornice.resource import resource, view
from cornice.validators import colander_body_validator
from pyramid.security import Everyone, Authenticated
from pyramid.httpexceptions import HTTPUnauthorized
import uuid

from naki.lib.auth import hash_pw
from naki.lib.cors import NAKI_CORS_POLICY
from naki.schemas.login import LoginSchema
from naki.lib.rest import APIResponse
from naki.model import DBSession, User, Token


@resource(path='/api/v1/auth', cors_policy=NAKI_CORS_POLICY)
class AUTHRes(object):
    def __init__(self, request, context=None):
        self._request = request
        self._context = context




    @view(permission=Everyone, schema=LoginSchema, validators=(colander_body_validator,))
    def post(self):
        data = self._request.validated
        user = DBSession.query(User).filter(User.username == data['username']).filter(
            User.passwd == hash_pw(data['password'])).one_or_none()
        if not user:
            raise HTTPUnauthorized()
        token = Token(str(uuid.uuid4()), user.id_user)
        DBSession.add(token)
        d = user.get_dict()
        d['token'] = token.id_token
        return APIResponse(d)

    @view(permission=Authenticated)
    def delete(self):
        if not self._request.token:
            # this should never happen
            raise HTTPUnauthorized
        tok = DBSession.query(Token).filter(Token.id_token == self._request.token).one()
        DBSession.delete(tok)
        return APIResponse(None)

    @view(permission=Authenticated)
    def get(self):
        d = self._request.user.get_dict()
        d['token'] = self._request.token
        return APIResponse(d)