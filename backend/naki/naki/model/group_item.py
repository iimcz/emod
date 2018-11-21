from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Float, Unicode
from naki.model.meta import Base

class GroupItem(Base):
    __tablename__ = "tGroupItem"
    
    id_group = Column('sID_Group', Unicode(64), primary_key = True)
    id_item = Column('sID_Item', Unicode(64))
    startoffset = Column('fStartOffset', Float)
    endoffset = Column('fEndOffset', Float)

    __mapper_args__ = {
        'primary_key': [id_group, id_item]
    }

    def __init__(self, id_group, id_item, startoffset, endoffset):
        self.id_group = id_group
        self.id_item = id_item
        self.startoffset = startoffset
        self.endoffset = endoffset

    def get_dict(self):
        return ({
            'id_group': self.id_group,
            'id_item': self.id_item,
            'startoffset': self.startoffset,
            'endoffset': self.endoffset,
        })
        
    def set_from_dict(self, d):        
        self.id_group = d['id_group']
        self.id_item = d['id_item']
        self.startoffset = d['startoffset']
        self.endoffset = d['endoffset']
        

