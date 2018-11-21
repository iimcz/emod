from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import DateTime, Integer, Unicode, UnicodeText
from naki.model.meta import Base
import datetime


class User(Base):
    __tablename__ = "tUsers"

    id_user = Column('sID_User', Unicode(64), primary_key=True, info={'colanderalchemy': {'missing': ''}})
    username = Column('sUsername', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    fullname = Column('sFullname', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    passwd = Column('sPassword', UnicodeText, info={'colanderalchemy': {'missing': ''}})
    auth_level = Column('nAuth', Integer, info={'colanderalchemy': {'missing': 0}})

    def __init__(self, id_user, username, fullname, passwd, auth_level):
        self.id_user = id_user
        self.username = username
        self.fullname = fullname
        self.passwd = passwd
        self.auth_level = auth_level


    def get_dict(self):
        return ({
            'id_user': self.id_user,
            'username': self.username,
            'fullname': self.fullname,
            'auth_level': self.auth_level
        })

    def set_from_dict(self, d):
        self.username = d['username']
        self.fullname = d['fullname']
        self.auth_level = d['auth_level']



