from naki.model.digital_set import DigitalSet
from colanderalchemy import SQLAlchemySchemaNode
from naki.schemas.metadata import MetadataSequenceSchema
from naki.schemas.digital_group import DigitalGroupSchema
import colander


class DGroupSchema(colander.MappingSchema):
    id_group = colander.SchemaNode(colander.String())

class DGroupSequenceSchema(colander.SequenceSchema):
    group = DGroupSchema()


DigitalSetSchema = SQLAlchemySchemaNode(DigitalSet)
DigitalSetSchema.add(MetadataSequenceSchema(name='metadata', missing=[]))
DigitalSetSchema.add(DGroupSequenceSchema(name='groups', missing=[]))
