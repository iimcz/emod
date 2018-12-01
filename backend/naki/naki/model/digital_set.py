from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText, DateTime
from naki.model.meta import Base
import datetime

class DigitalSet(Base):
    __tablename__ = "tDigitalSet"
    
    id_set = Column('sID_Set', Unicode(64), primary_key = True, info={'colanderalchemy': {'missing': ''}})
    created = Column('dCreated', DateTime, info={'colanderalchemy': {'missing': datetime.datetime.now()}})
    description = Column('sDescription', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    id_user = Column('sID_User', UnicodeText, info={'colanderalchemy': {'missing': ''}})

        
    def __init__(self, id_set, created, description, id_user):
        self.id_set = id_set
        self.created = created
        self.description = description
        self.id_user = id_user

    def get_dict(self):
        return ({
            'id_set': self.id_set,
            'created': str(self.created) if self.created else None,
            'description': self.description,
            'id_user': self.id_user,
        })
        
    def set_from_dict(self, d):
        # self.id_set = d['id_set']
        # self.created = d['created']
        self.description = d['description']
        self.id_user = d['id_user']

        

