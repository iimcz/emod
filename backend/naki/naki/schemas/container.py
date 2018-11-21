from naki.model.container import Container
from colanderalchemy import SQLAlchemySchemaNode
from colander import  SequenceSchema, String, SchemaNode
ContainerSchema = SQLAlchemySchemaNode(Container)
ContainerSchema.add(SequenceSchema(SchemaNode(String()), name = 'item_ids', missing = []))
