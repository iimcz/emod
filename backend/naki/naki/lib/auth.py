from pyramid.security import Everyone, Authenticated, authenticated_userid, unauthenticated_userid
import hashlib

from naki.model import DBSession, User, Token

class RIGHTS:
    Guest = 'guest'
    Researcher = 'researcher'
    Editor = 'editor'
    Admin = 'admin'

class RIGHTLevels:
    Guest = 0
    Researcher = 1
    Editor = 2
    Admin = 3

class TokenAuthenticationPolicy(object):

    def __init__(self):
        print('IIM NAKI Authentication policy created')

    def remember(self, request, principal, **kw):
        print('TokenAuthenticationPolicy r')
        return None

    def forget(self, request):
        print('TokenAuthenticationPolicy f')
        return None

    def unauthenticated_userid(self, request):
        # print('')
        return request.token

    def authenticated_userid(self, request):
        # print('')
        return request.user.username if request.user else None

    def effective_principals(self, request):
        #print('>>>>>>>>>> TokenAuthenticationPolicy ep')
        # print(request.user)
        principals = [Everyone]
        if request.user:
            principals += [Authenticated]
            auth_level = min(max(request.user.auth_level, 0), 3)
            principals += [RIGHTS.Guest, RIGHTS.Researcher, RIGHTS.Editor, RIGHTS.Admin][0:auth_level+1]
        print('>>>>>> Principals associated with this request: %s' % ', '.join(principals))
        return principals


class IIMNAKIAuthorizationPolicy(object):

    """ An object representing a Pyramid authorization policy. """

    def __init__(self):
        print('IIM NAKI Authorization Policy created')

    def permits(self, context, principals, permission):
        """ Return ``True`` if any of the ``principals`` is allowed the
        ``permission`` in the current ``context``, else return ``False``
        If ``permission`` is a tuple, then return True if any value from permission is in pricipals
        And ADMIN has right to access everything
        """
        if RIGHTS.Admin in principals:
            return True
        if permission.__class__ == tuple:
            return any((p in principals for p in permission))
        return permission in principals

    def principals_allowed_by_permission(self, context, permission):
        """ Return a set of principal identifiers allowed by the
        ``permission`` in ``context``.  This behavior is optional; if you
        choose to not implement it you should define this method as
        something which raises a ``NotImplementedError``.  This method
        will only be called when the
        ``pyramid.security.principals_allowed_by_permission`` API is
        used."""
        raise NotImplementedError()

def IIMNAKI_Auth_get_token(request):
    try:
        token = request.GET.getone('token')
        print('Request has a token: ' + token)
        return token
    except:
        return None

def IIMNAKI_Auth_get_user_info(request):
    # print('IIMAuth_get_user_info')
    token = request.unauthenticated_userid
    # print('Token: %s' % token)
    if not token:
        return None
    try:
        tkn = DBSession\
            .query(Token, User)\
            .join(User, Token.id_user == User.id_user)\
            .filter(Token.id_token == token)\
            .one_or_none()
        if tkn:
            request.validated['token'] = tkn[0].id_token
            print('>>>>>>>> Requests credited to user %s' % tkn[1].username)
            return tkn[1]
        else:
            print('>>>>>>>> Invalid token, no user verified')
            return None
    except Exception as e:
        print(str(e))
        return None

def hash_pw(pw):
    '''
    Receives PW (md5 of actual password), adds salt and hashes it using SHA1
    :param pw:
    :return:
    '''
    return hashlib.sha1((u'NAKI999' + pw).encode('utf8')).hexdigest()
