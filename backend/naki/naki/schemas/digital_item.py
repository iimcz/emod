import colander
from naki.schemas.metadata import MetadataSequenceSchema
from naki.schemas.link import LinkSequenceSchema

class StringSequenceSchema(colander.SequenceSchema):
    value = colander.SchemaNode(colander.String())

class DigitalItemSchema(colander.MappingSchema):
    mime = colander.SchemaNode(colander.String())
    created = colander.SchemaNode(colander.String(), missing='')
    description = colander.SchemaNode(colander.String(), missing='')
    id_user = colander.SchemaNode(colander.String(), missing='Unknown')
    rights = colander.SchemaNode(colander.String(), missing=0)
    src = colander.SchemaNode(colander.String(), missing='')
    metadata = MetadataSequenceSchema()
    links = LinkSequenceSchema(missing=[])
    group_ids = StringSequenceSchema(missing=[])

