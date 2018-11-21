from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText
from naki.model.meta import Base

class MetaKey(Base):
    __tablename__ = "tMetaKey"
    
    key = Column('sKey', Unicode(64), primary_key = True)
    type = Column('sType', Unicode(32), info={'colanderalchemy': {'missing': 'string'}})
    description = Column('sDescription', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    mandatory = Column('sMandatory', Unicode(16), info={'colanderalchemy': {'missing': ''}})
        
    def __init__(self, key, type, description, mandatory):
        self.key = key
        self.type = type
        self.description = description
        self.mandatory = mandatory

    def get_dict(self):
        return ({
            'key': self.key,
            'type': self.type,
            'description': self.description,
            'mandatory': self.mandatory,
        })
        
    def set_from_dict(self, d):        
        self.key = d['key']
        self.type = d['type']
        self.description = d['description']
        self.mandatory = d['mandatory']
        

