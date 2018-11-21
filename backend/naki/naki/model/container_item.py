from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText
from naki.model.meta import Base

class ContainerItem(Base):
    __tablename__ = "tContainerItem"
    
    id_container = Column('sID_Container', Unicode(64))
    id_item = Column('sID_Item', Unicode(64))
    data = Column('sData', UnicodeText)

    __mapper_args__ = {
        'primary_key': [id_container, id_item]
    }

    def __init__(self, id_container, id_item, data):
        self.id_container = id_container
        self.id_item = id_item
        self.data = data

    def get_dict(self):
        return ({
            'id_container': self.id_container,
            'id_item': self.id_item,
            'data': self.data,
        })
        
    def set_from_dict(self, d):        
        self.id_container = d['id_container']
        self.id_item = d['id_item']
        self.data = d['data']
        

