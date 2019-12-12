from naki.model.digital_set import DigitalSet
from colanderalchemy import SQLAlchemySchemaNode
from naki.schemas.metadata import MetadataSequenceSchema
from naki.schemas.digital_group import DigitalGroupSchema
import colander
import datetime


class DGroupSchema(colander.MappingSchema):
    id_group = colander.SchemaNode(colander.String())


class DGroupSequenceSchema(colander.SequenceSchema):
    group = DGroupSchema()


class DigitalSetSchema(colander.MappingSchema):
    id_set = colander.SchemaNode(colander.String(), missing='')
    created = colander.SchemaNode(colander.DateTime(), missing=datetime.datetime.now())
    description = colander.SchemaNode(colander.String(), missing='')
    id_user = colander.SchemaNode(colander.String(), missing='')
    metadata = MetadataSequenceSchema(missing=[])
    groups = DGroupSequenceSchema(missing=[])

# DigitalSetSchema = SQLAlchemySchemaNode(DigitalSet)
# DigitalSetSchema.add(MetadataSequenceSchema(name='metadata', missing=[]))
# DigitalSetSchema.add(DGroupSequenceSchema(name='groups', missing=[]))
