from naki.model.meta_key import MetaKey
from colanderalchemy import SQLAlchemySchemaNode
#from colander import  SequenceSchema, String, SchemaNode
#MetaKeySchema = SQLAlchemySchemaNode(MetaKey)
import colander
class MetaKeySchema(colander.MappingSchema):
    key = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(colander.String(), missing='string')
    description = colander.SchemaNode(colander.String(), missing='')
    mandatory = colander.SchemaNode(colander.String(), missing='')
