from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText
from naki.model.meta import Base

class Metadata(Base):
    __tablename__ = "tMetadata"
    
    id = Column('sID', Unicode(64))
    target = Column('sTarget', Unicode(32))
    key = Column('sKey', Unicode(64))
    value = Column('sValue', UnicodeText)

    __mapper_args__ = {
        'primary_key': [id, key]
    }
    def __init__(self, id, target, key, value):
        self.id = id
        self.target = target
        self.key = key
        self.value = value

    def get_dict(self):
        return ({
            'id': self.id,
            'target': self.target,
            'key': self.key,
            'value': self.value,
        })
        
    def set_from_dict(self, d):        
        self.id = d['id']
        self.target = d['target']
        self.key = d['key']
        self.value = d['value']
        

