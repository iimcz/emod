from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText
from naki.model.meta import Base

class ViewItem(Base):
    __tablename__ = "tViewItem"
    
    id_view = Column('sID_View', Unicode(64))
    id_item = Column('sID_Item', UnicodeText)
    path = Column('sPath', Unicode())

    __mapper_args__ = {
        'primary_key': [id_view, id_item]
    }

    def __init__(self, id_view, id_item, path):
        self.id_view = id_view
        self.id_item = id_item
        self.path = path

    def get_dict(self):
        return ({
            'id_view': self.id_view,
            'id_item': self.item,
            'path': self.path
        })
        
    def set_from_dict(self, d):        
        self.id_view = d['id_view']
        self.id_item = d['id_item']
        self.path = d['path']
        

