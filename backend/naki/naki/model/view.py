from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import DateTime, Integer, Unicode, UnicodeText
from naki.model.meta import Base
import datetime

class View(Base):
    __tablename__ = "tView"
    
    id_view = Column('sID_View', Unicode(64), primary_key = True, info={'colanderalchemy': {'missing': ''}})
    created = Column('dCreated', DateTime, info={'colanderalchemy': {'missing': datetime.datetime.now()}})
    description = Column('sDescription', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    id_user = Column('sAuthor', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    public = Column('bPublic', Integer, info={'colanderalchemy': {'missing': 0}})
        
    def __init__(self, id_view, created, description, author, public):
        self.id_view = id_view
        self.created = created
        self.description = description
        self.author = author
        self.public = public

    def get_dict(self):
        return ({
            'id_view': self.id_view,
            'created': str(self.created) if self.created else None,
            'description': self.description,
            'id_user': self.id_user,
            'public': self.public,
        })
        
    def set_from_dict(self, d):        
        self.id_view = d['id_view']
        self.created = d['created']
        self.description = d['description']
        self.id_user = d['id_user']
        self.public = d['public']
        

