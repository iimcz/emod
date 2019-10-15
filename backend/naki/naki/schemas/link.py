import colander


class LinkSchema(colander.MappingSchema):
    # item_id = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(colander.String())
    uri = colander.SchemaNode(colander.String())
    description = colander.SchemaNode(colander.String(), missing='')
    id_user = colander.SchemaNode(colander.String(), missing='')
    id_link = colander.SchemaNode(colander.String(), missing='')
    id_item = colander.SchemaNode(colander.String(), missing='')


class LinkSequenceSchema(colander.SequenceSchema):
    value = LinkSchema()
