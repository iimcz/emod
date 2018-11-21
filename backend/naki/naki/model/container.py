from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText, Integer
from naki.model.meta import Base

class Container(Base):
    __tablename__ = "tContainer"

    id_container = Column('sID_Container', Unicode(64), primary_key=True, info={'colanderalchemy': {'missing': ''}})
    id_view = Column('sID_View', Unicode(64))
    type = Column('sType', Unicode(64), info={'colanderalchemy': {'missing': 'generic'}})
    description = Column('sDescription', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    x = Column('nX', Integer(), info={'colanderalchemy': {'missing': 0}})
    y = Column('nY', Integer(), info={'colanderalchemy': {'missing': 0}})
    width = Column('nWidth', Integer(), info={'colanderalchemy': {'missing': 2}})
    height = Column('nHeight', Integer(), info={'colanderalchemy': {'missing': 2}})
    z = Column('nZ', Integer(), info={'colanderalchemy': {'missing': 0}})
    data = Column('sData', UnicodeText, info={'colanderalchemy': {'missing': None}})

    def __init__(self, id_container, id_view, type, description, x=0, y=0, width=2, height=2, z = 0, data = None):
        self.id_container = id_container
        self.id_view = id_view
        self.type = type
        self.description = description
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.z = z
        self.data = data

    def get_dict(self):
        return ({
            'id_container': self.id_container,
            'id_view': self.id_view,
            'type': self.type,
            'description': self.description,
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
            'z': self.z,
            'data': self.data
        })

    def set_from_dict(self, d):
        # self.id_container = d['id_container']
        # self.id_view = d['id_view']
        self.type = d['type']
        self.description = d['description']
        self.x = d['x']
        self.y = d['y']
        self.width = d['width']
        self.height = d['height']
        if 'z' in d:
            self.z = d['z']
        if 'data' in d:
            self.data = d['data']
