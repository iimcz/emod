"""SQLAlchemy Metadata and Session object"""
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension

__all__ = ['Base', 'Session']

# SQLAlchemy session manager. Updated by model.init_model()
DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))

# The declarative Base
Base = declarative_base()
