from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Unicode, UnicodeText
from naki.model.meta import Base

class Link(Base):
    __tablename__ = "tLink"

    id_link = Column('sID_Link', Unicode(64), primary_key=True)
    id_item = Column('sID_Item', Unicode(64))
    id_user = Column('sAuthor', Unicode(64))
    type = Column('sType', Unicode(32))
    description = Column('sDescription', UnicodeText)
    uri = Column('sURI', UnicodeText)

    # Fake primary key - sqlalchemy needs one...
    # __mapper_args__ = {
    #     'primary_key': [id_item, uri]
    # }
    def __init__(self, id_link, id_item, id_user, type, description, uri):
        self.id_link = id_link
        self.id_item = id_item
        self.id_user = id_user
        self.type = type
        self.description = description
        self.uri = uri

    def get_dict(self):
        return ({
            'id_link': self.id_link,
            'id_item': self.id_item,
            'id_user': self.id_user,
            'type': self.type,
            'description': self.description,
            'uri': self.uri,
        })
        
    def set_from_dict(self, d):        
        self.id_item = d['id_item']
        self.id_user = d['id_user']
        self.type = d['type']
        self.description = d['description']
        self.uri = d['uri']
        

