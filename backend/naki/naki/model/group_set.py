from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode
from naki.model.meta import Base

class GroupSet(Base):
    __tablename__ = "tGroupSet"
    
    id_set = Column('sID_Set', Unicode(64))
    id_group = Column('sID_Group', Unicode(64))

    __mapper_args__ = {
        'primary_key': [id_set, id_group]
    }

    def __init__(self, id_set, id_group):
        self.id_set = id_set
        self.id_group = id_group

    def get_dict(self):
        return ({
            'id_set': self.id_set,
            'id_group': self.id_group,
        })
        
    def set_from_dict(self, d):        
        self.id_set = d['id_set']
        self.id_group = d['id_group']
        

