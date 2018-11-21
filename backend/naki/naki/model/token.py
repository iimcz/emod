from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import DateTime, Integer, Unicode, UnicodeText
from naki.model.meta import Base
import datetime


class Token(Base):
    __tablename__ = "tTokens"

    id_token = Column('sID_Token', Unicode(64), primary_key=True, info={'colanderalchemy': {'missing': ''}})
    id_user = Column('sID_User', Unicode(64), primary_key=True, info={'colanderalchemy': {'missing': ''}})
    date = Column('dDate', DateTime, info={'colanderalchemy': {'missing': datetime.datetime.now()}})

    def __init__(self, id_token, id_user):
        self.id_token = id_token
        self.id_user = id_user
        self.date = datetime.datetime.now()


    def get_dict(self):
        return ({
            'id_token': self.id_token,
            'id_user': self.id_user,
            'date': self.data
        })

    def set_from_dict(self, d):
        pass



