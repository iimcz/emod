import colander

class AnnotationSchema(colander.MappingSchema):
    id_user = colander.SchemaNode(colander.String(), missing='')
    uri = colander.SchemaNode(colander.String())
    id_item = colander.SchemaNode(colander.String())
    time = colander.SchemaNode(colander.Integer())
    duration = colander.SchemaNode(colander.Integer(), missing=0)
