from naki.model.view import View
from colanderalchemy import SQLAlchemySchemaNode
from naki.schemas.metadata import MetadataSequenceSchema

import colander
import datetime
# ViewSchema = SQLAlchemySchemaNode(View)
# ViewSchema.add(MetadataSequenceSchema(name = 'metadata', missing = []))

class ViewSchema(colander.MappingSchema):
    id_view = colander.SchemaNode(colander.String(), missing='')
    created = colander.SchemaNode(colander.DateTime(), missing=datetime.datetime.now())
    description = colander.SchemaNode(colander.String(), missing='')
    id_user = colander.SchemaNode(colander.String(),missing='')
    public = colander.SchemaNode(colander.Integer(),missing=0)
    metadata = MetadataSequenceSchema(missing=[])


