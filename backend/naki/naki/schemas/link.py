import colander


class LinkSchema(colander.MappingSchema):
    # item_id = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(colander.String())
    uri = colander.SchemaNode(colander.String())
    description = colander.SchemaNode(colander.String())
    id_user = colander.SchemaNode(colander.String())

class LinkSequenceSchema(colander.SequenceSchema):
    value = LinkSchema()
