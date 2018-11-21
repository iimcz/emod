from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import DateTime, Unicode, UnicodeText
from naki.model.meta import Base

class DIGroup(Base):
    __tablename__ = "tDIGroup"
    
    id_group = Column('sID_Group', Unicode(64), primary_key = True)
    created = Column('dCreated', DateTime)
    description = Column('sDescription', UnicodeText)
    id_user = Column('sAuthor', UnicodeText)
    type = Column('sType', Unicode(64))
        
    def __init__(self, id_group, created, description, id_user, type):
        self.id_group = id_group
        self.created = created
        self.description = description
        self.id_user = id_user
        self.type = type

    def get_dict(self):
        return ({
            'id_group': self.id_group,
            'created': str(self.created) if self.created else None,
            'description': self.description,
            'id_user': self.id_user,
            'type': self.type,
        })
        
    def set_from_dict(self, d):        
        self.id_group = d['id_group']
        self.created = d['created']
        self.description = d['description']
        self.id_user = d['id_user']
        self.type = d['type']
        

