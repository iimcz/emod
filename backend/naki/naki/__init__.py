from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from naki.lib.auth import TokenAuthenticationPolicy, IIMNAKIAuthorizationPolicy, IIMNAKI_Auth_get_token, IIMNAKI_Auth_get_user_info

from naki.model.meta import (
    DBSession,
    Base,
)


def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine


    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)

    authn_policy = TokenAuthenticationPolicy()
    authz_policy = IIMNAKIAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.add_request_method(IIMNAKI_Auth_get_user_info, 'user', reify=True)
    config.add_request_method(IIMNAKI_Auth_get_token, 'token', reify=True)


    #config.include('pyramid_jinja2')
    # config.add_static_view('static', 'static', cache_max_age=3600)
    # config.add_route('home', '/')

    # config.include('pyramid_tm')
    config.include('cornice')

    config.scan('naki.view')

    #config.scan()
    return config.make_wsgi_app()
