import colander
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import DateTime, Integer, Unicode, UnicodeText
from naki.model.meta import Base

class DigitalItem(Base):
    __tablename__ = "tDigitalItem"
    
    id_item = Column('sID_Item', Unicode(64), primary_key = True, info={'colanderalchemy': {'missing': None}})
    mime = Column('sMime', Unicode(64))
    created = Column('dCreated', DateTime)
    description = Column('sDescription', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    id_user = Column('sAuthor', Unicode(64))
    rights = Column('sRights', Integer)
        
    def __init__(self, id_item, mime, created, description, id_user, rights):
        self.id_item = id_item
        self.mime = mime
        self.created = created
        self.description = description
        self.id_user = id_user
        self.rights = rights

    def get_dict(self):
        return ({
            'id_item': self.id_item,
            'mime': self.mime,
            'created': str(self.created),
            'description': self.description,
            'id_user': self.id_user,
            'rights': self.rights,
        })
        
    def set_from_dict(self, d):        
        #self.id_item = d['id_item']
        self.mime = d['mime']
        #self.created = d['created']
        self.description = d['description']
        self.id_user = d['id_user']
        self.rights = d['rights']
        

