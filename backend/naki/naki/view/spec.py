from cornice import Service
from cornice.service import get_services
from cornice_swagger import CorniceSwagger


swagger = Service(name='OpenAPI',
                  path='/api/v1/spec',
                  description="OpenAPI documentation")


@swagger.get()
def openAPI_spec(request):
    doc = CorniceSwagger(get_services())
    my_spec = doc.generate('NAKI', '1.0.0')
    return my_spec