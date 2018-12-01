from naki.model.digital_set import DigitalSet
from colanderalchemy import SQLAlchemySchemaNode
from naki.schemas.metadata import MetadataSequenceSchema

import colander
DigitalSetSchema = SQLAlchemySchemaNode(DigitalSet)
DigitalSetSchema.add(MetadataSequenceSchema(name = 'metadata', missing = []))

