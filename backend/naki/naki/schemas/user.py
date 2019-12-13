from naki.model.user import User
from colanderalchemy import SQLAlchemySchemaNode
import colander


# UserSchema = SQLAlchemySchemaNode(User)


class UserSchema(colander.MappingSchema):
    id_user = colander.SchemaNode(colander.String(), missing='')
    username = colander.SchemaNode(colander.String(), missing='')
    fullname = colander.SchemaNode(colander.String(), missing='')
    passwd = colander.SchemaNode(colander.String(), missing='')
    auth_level = colander.SchemaNode(colander.Integer(), missing=0)
