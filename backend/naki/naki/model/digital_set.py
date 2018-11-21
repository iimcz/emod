from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText
from naki.model.meta import Base

class DigitalSet(Base):
    __tablename__ = "tDigitalSet"
    
    id_set = Column('sID_Set', Unicode(64), primary_key = True)
    description = Column('sDescription', UnicodeText)
        
    def __init__(self, id_set, description):
        self.id_set = id_set
        self.description = description

    def get_dict(self):
        return ({
            'id_set': self.id_set,
            'description': self.description,
        })
        
    def set_from_dict(self, d):        
        self.id_set = d['id_set']
        self.description = d['description']
        

