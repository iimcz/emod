from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import LargeBinary, Unicode
from naki.model.meta import Base

class Data(Base):
    __tablename__ = "tData"
    
    id_data = Column('sID_Data', Unicode(64), primary_key = True)
    blob = Column('bBlob', LargeBinary)
        
    def __init__(self, id_data, blob):
        self.id_data = id_data
        self.blob = blob

    def get_dict(self):
        return ({
            'id_data': self.id_data,
            'blob': self.blob,
        })
        
    def set_from_dict(self, d):        
        self.id_data = d['id_data']
        self.blob = d['blob']
        

