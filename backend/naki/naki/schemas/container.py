from naki.model.container import Container
from colanderalchemy import SQLAlchemySchemaNode
from colander import SequenceSchema, String, SchemaNode
import colander


# ContainerSchema = SQLAlchemySchemaNode(Container)
# ContainerSchema.add(SequenceSchema(SchemaNode(String()), name = 'item_ids', missing = []))

class ContainerSchema(colander.MappingSchema):
    id_container = colander.SchemaNode(colander.String(), missing='')
    id_view = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(colander.String(), missing='generic')
    description = colander.SchemaNode(colander.String(), missing='')
    x = colander.SchemaNode(colander.Integer(), missing=0)
    y = colander.SchemaNode(colander.Integer(), missing=0)
    width = colander.SchemaNode(colander.Integer(), missing=2)
    height = colander.SchemaNode(colander.Integer(), missing=2)
    z = colander.SchemaNode(colander.Integer(), missing=0)
    data = colander.SchemaNode(colander.String(), missing=None)
    item_ids = colander.SequenceSchema(SchemaNode(String()), missing=[])
