"""SQLAlchemy Metadata and Session object"""
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

__all__ = ['Base', 'Session']

# SQLAlchemy session manager. Updated by model.init_model()
try:
    from zope.sqlalchemy import ZopeTransactionExtension
    DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
except:
    from zope.sqlalchemy import register
    DBSession = scoped_session(sessionmaker(autoflush=True))
    register(DBSession)

# The declarative Base
Base = declarative_base()
