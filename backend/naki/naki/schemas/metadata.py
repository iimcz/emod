import colander


class MetadataSchema(colander.MappingSchema):
    key = colander.SchemaNode(colander.String())
    value = colander.SchemaNode(colander.String())


class MetadataSequenceSchema(colander.SequenceSchema):
    value = MetadataSchema()
