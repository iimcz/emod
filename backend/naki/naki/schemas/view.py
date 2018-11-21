from naki.model.view import View
from colanderalchemy import SQLAlchemySchemaNode
from naki.schemas.metadata import MetadataSequenceSchema

import colander
ViewSchema = SQLAlchemySchemaNode(View)
ViewSchema.add(MetadataSequenceSchema(name = 'metadata', missing = []))

