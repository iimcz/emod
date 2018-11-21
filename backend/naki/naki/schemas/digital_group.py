import colander
from naki.schemas.metadata import MetadataSequenceSchema

class DigitalGroupSchema(colander.MappingSchema):
    created = colander.SchemaNode(colander.String(), missing='')
    id_user = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(colander.String(), missing='')
    metadata = MetadataSequenceSchema()


